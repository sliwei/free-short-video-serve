import { Context } from 'koa'
import { Authority, AuthorityTree } from '../models/authority'

/**
 * @swagger
 * /api/authority/create:
 *   post:
 *     tags:
 *       - authority
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
 *                   authority:
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
  const res = await Authority.create(cell)
  ctx.DATA.data = res
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/authority/update:
 *   put:
 *     tags:
 *       - authority
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
 *                   authority:
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
  const [uLen] = await Authority.update(cell, {
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
 * /api/authority/delete:
 *   delete:
 *     tags:
 *       - authority
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
  const [uLen] = await Authority.update(
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
 * /api/authority/select:
 *   get:
 *     tags:
 *       - authority
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
  const res = await Authority.findOne({
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
 * /api/authority/findAll:
 *   post:
 *     tags:
 *       - authority
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
  const res = await Authority.findAndCountAll({
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
 * /api/authority/findTree:
 *   post:
 *     tags:
 *       - authority
 *     summary: 查询权限列表树
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
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const findTree = async (ctx: Context) => {
  const { where } = ctx.request.body
  const authority = await Authority.findAll({
    where: { del: 0, ...where },
    order: [['type', 'ASC']],
    raw: true
  })
  const authorityObj: { [key: string]: AuthorityTree } = {}
  authority.forEach((v) => {
    if (v.type === 0) {
      if (!authorityObj[v.id]) {
        authorityObj[v.id] = { ...v, children: [] } as AuthorityTree
      }
    } else {
      authorityObj[v.pid].children.push(v)
    }
  })
  const authorityTree: AuthorityTree[] = []
  Object.keys(authorityObj).forEach((id) => {
    authorityTree.push(authorityObj[id])
  })
  ctx.DATA.data = authorityTree
  ctx.body = ctx.DATA
}
