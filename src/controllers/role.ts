import { Context } from 'koa'
import { Role } from '../models/role'
import { Users } from '../models/users'

/**
 * @swagger
 * /api/role/create:
 *   post:
 *     tags:
 *       - role
 *     summary: 新增角色
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
 *                     description: 角色名
 *                   notes:
 *                     type: string
 *                     description: 角色说明
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
  const res = await Role.create(cell)
  ctx.DATA.data = res
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/role/update:
 *   put:
 *     tags:
 *       - role
 *     summary: 修改角色
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
 *                     description: 角色名
 *                   notes:
 *                     type: string
 *                     description: 角色说明
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
  const [uLen] = await Role.update(cell, {
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
 * /api/role/delete:
 *   delete:
 *     tags:
 *       - role
 *     summary: 删除角色
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
  const [uLen] = await Role.update(
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
 * /api/role/select:
 *   get:
 *     tags:
 *       - role
 *     summary: 查询单个角色
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
  const res = await Role.findOne({
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
 * /api/role/findAll:
 *   post:
 *     tags:
 *       - role
 *     summary: 查询角色列表
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
  const res = await Role.findAndCountAll({
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
 * /api/role/findAuthority:
 *   get:
 *     tags:
 *       - role
 *     summary: 查询我的权限
 *     description: 说明
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const findAuthority = async (ctx: Context) => {
  const { id } = ctx.USER
  const users = await Users.findOne({
    where: { del: 0, id },
    attributes: { exclude: ['pwd'] }
  })
  if (!users) {
    ctx.DATA.code = 1
    ctx.DATA.msg = '查无此人'
    ctx.body = ctx.DATA
    return
  }
  const { role_ids } = users
  if (role_ids) {
    const role = await Role.findAll({
      where: {
        del: 0,
        id: role_ids
          .split(',')
          .map((v) => Number(v.replace(/\|/g, '')))
          .filter((v) => v)
      }
    })
    let authority: string[] = []
    role.forEach((v) => {
      authority = [...authority, ...v.authority.split(',')]
    })
    const noRepeat = authority.filter((v, i) => {
      return authority.indexOf(v) === i
    })
    ctx.DATA.data = noRepeat.join(',')
  } else {
    ctx.DATA.data = ''
  }
  ctx.body = ctx.DATA
}
