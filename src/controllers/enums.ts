import { Context } from 'koa'
import { Enums } from '../models/enums'
import { arrayToTree } from 'performant-array-to-tree'

/**
 * @swagger
 * /api/enums/create:
 *   post:
 *     tags:
 *       - enums
 *     summary: 新增枚举
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cell:
 *                 type: object
 *                 properties:
 *                   categor:
 *                     type: string
 *                     description: 类型
 *                   label:
 *                     type: string
 *                     description: 标题
 *                   value:
 *                     type: string
 *                     description: 内容
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const create = async (ctx: Context) => {
  const { cell } = ctx.request.body
  const res = await Enums.create(cell)
  ctx.DATA.data = res
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/enums/update:
 *   put:
 *     tags:
 *       - enums
 *     summary: 修改枚举
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: ID
 *               cell:
 *                 type: object
 *                 properties:
 *                   categor:
 *                     type: string
 *                     description: 类型
 *                   label:
 *                     type: string
 *                     description: 标题
 *                   value:
 *                     type: string
 *                     description: 内容
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const update = async (ctx: Context) => {
  const { id, cell } = ctx.request.body
  const [uLen] = await Enums.update(cell, {
    where: { id }
  })
  if (!uLen) {
    ctx.DATA.code = 1
    ctx.DATA.msg = '未找到数据'
  }
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/enums/updateIndex:
 *   put:
 *     tags:
 *       - enums
 *     summary: 修改枚举顺序
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             properties:
 *               index:
 *                 type: number
 *                 description: 类型
 *               id:
 *                 type: number
 *                 description: 标题
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const updateIndex = async (ctx: Context) => {
  const cells = ctx.request.body
  let pall: Promise<[affectedCount: number]>[] = []
  cells.forEach((v: { index: number; id: number }) => {
    pall.push(
      Enums.update(
        { index: v.index },
        {
          where: { id: v.id }
        }
      )
    )
  })
  const res = await Promise.all(pall)
  let all = res.length
  let err = 0
  res.forEach((v) => {
    if (v[0] === 0) {
      err += 1
    }
  })
  if (err) {
    ctx.DATA.code = 1
    ctx.DATA.msg = `${all}条数据中${err}条数据更新失败`
  }
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/enums/delete:
 *   delete:
 *     tags:
 *       - enums
 *     summary: 删除枚举
 *     description: 说明
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: id
 *         type: string
 *         description: ID
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const _delete = async (ctx: Context) => {
  const { id } = ctx.query
  const [uLen] = await Enums.update(
    { del: 1 },
    {
      where: { id }
    }
  )
  if (!uLen) {
    ctx.DATA.code = 1
    ctx.DATA.msg = '未找到数据'
  }
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/enums/select:
 *   get:
 *     tags:
 *       - enums
 *     summary: 查询单个枚举
 *     description: 说明
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: id
 *         type: string
 *         description: ID
 *       - in: query
 *         name: attributes
 *         type: string
 *         description: 返回字段
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const select = async (ctx: Context) => {
  const { id, attributes } = ctx.query
  const res = await Enums.findOne({
    where: { del: 0, id },
    attributes: attributes ? (attributes as string).split(',') : null
  })
  ctx.DATA.data = res || {}
  if (!res) {
    ctx.DATA.code = 1
    ctx.DATA.msg = '未找到数据'
  }
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/enums/findAll:
 *   post:
 *     tags:
 *       - enums
 *     summary: 查询枚举列表
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               where:
 *                 type: object
 *               order:
 *                 type: array
 *                 items:
 *                   type: string
 *               page:
 *                 type: number
 *                 description: 页
 *               size:
 *                 type: number
 *                 description: 条数
 *               attributes:
 *                 type: string
 *                 description: 返回字段
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const findAll = async (ctx: Context) => {
  const { page = 1, size = 20, where, attributes, order = [['id', 'DESC']] } = ctx.request.body
  const fixpage = +page
  const fixsize = +size
  const res = await Enums.findAndCountAll({
    where: { del: 0, ...where },
    offset: fixsize * fixpage - fixsize,
    limit: fixsize,
    order,
    attributes: attributes ? (attributes as string).split(',') : null
  })
  const { rows, count } = res
  const pages = Math.ceil(res.count / size) || 0
  ctx.DATA.data = {
    list: rows,
    page: fixpage,
    size: fixsize,
    total: count,
    pages,
    first: page === 1,
    last: page === pages || !pages
  }
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/enums/findAllOfCategor:
 *   post:
 *     tags:
 *       - enums
 *     summary: 查询某个类型下的所有枚举列表包括子项
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categor:
 *                 type: string
 *                 description: 类型
 *               attributes:
 *                 type: string
 *                 description: 返回字段
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const findAllOfCategor = async (ctx: Context) => {
  const { categor, attributes } = ctx.request.body
  const rows = await Enums.findAll({
    where: { del: 0, categor },
    attributes: attributes ? (attributes as string).split(',') : null,
    order: [['index', 'asc']]
  })
  const tree = arrayToTree(
    rows.map((v) => v.get({ plain: true })),
    { id: 'label', dataField: null }
  )
  ctx.DATA.data = tree
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/enums/findAllOfParent:
 *   post:
 *     tags:
 *       - enums
 *     summary: 查询某个类型下的所有枚举列表
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categor:
 *                 type: string
 *                 description: 分组
 *               parentId:
 *                 type: string
 *                 description: 类型
 *               attributes:
 *                 type: string
 *                 description: 返回字段
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const findAllOfParent = async (ctx: Context) => {
  const { categor, parentId = '', attributes } = ctx.request.body
  const rows = await Enums.findAll({
    where: { del: 0, parentId, categor },
    attributes: attributes ? (attributes as string).split(',') : null,
    order: [['index', 'asc']]
  })

  if (typeof parentId !== 'string') {
    let data: { [key: string]: Enums[] } = {}
    rows.forEach((v) => {
      if (!data[v.parentId]) {
        data[v.parentId] = []
      }
      data[v.parentId].push(v)
    })
    ctx.DATA.data = data
    ctx.body = ctx.DATA
  } else if (typeof categor !== 'string') {
    let data: { [key: string]: Enums[] } = {}
    rows.forEach((v) => {
      if (!data[v.categor]) {
        data[v.categor] = []
      }
      data[v.categor].push(v)
    })
    ctx.DATA.data = data
    ctx.body = ctx.DATA
  } else {
    ctx.DATA.data = rows
    ctx.body = ctx.DATA
  }
}
