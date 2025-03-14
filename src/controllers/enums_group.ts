import { Context } from 'koa'
import { EnumsGroup } from '../models/enums_group'

/**
 * @swagger
 * /api/enums_group/create:
 *   post:
 *     tags:
 *       - enums_group
 *     summary: 新增权限
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
 *                   title:
 *                     type: string
 *                     description: 权限名
 *                   notes:
 *                     type: string
 *                     description: 权限说明
 *                   enums_group:
 *                     type: string
 *                     description: 权限字符串xxx:0,xxx:1
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const create = async (ctx: Context) => {
  const { cell } = ctx.request.body
  const { categor } = cell
  const findRes = await EnumsGroup.findOne({
    where: { del: 0, categor }
  })
  if (!findRes) {
    const res = await EnumsGroup.create(cell)
    ctx.DATA.data = res
  } else {
    ctx.DATA.code = 1
    ctx.DATA.msg = '枚举组已存在'
  }
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/enums_group/update:
 *   put:
 *     tags:
 *       - enums_group
 *     summary: 修改权限
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
 *                   title:
 *                     type: string
 *                     description: 权限名
 *                   notes:
 *                     type: string
 *                     description: 权限说明
 *                   enums_group:
 *                     type: string
 *                     description: 权限字符串xxx:0,xxx:1
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const update = async (ctx: Context) => {
  const { id, cell } = ctx.request.body
  const [uLen] = await EnumsGroup.update(cell, {
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
 * /api/enums_group/delete:
 *   delete:
 *     tags:
 *       - enums_group
 *     summary: 删除权限
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
  const [uLen] = await EnumsGroup.update(
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
 * /api/enums_group/select:
 *   get:
 *     tags:
 *       - enums_group
 *     summary: 查询单个权限
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
  const res = await EnumsGroup.findOne({
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
 * /api/enums_group/findAll:
 *   post:
 *     tags:
 *       - enums_group
 *     summary: 查询权限列表
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
  const res = await EnumsGroup.findAndCountAll({
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
