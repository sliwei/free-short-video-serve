import { Context, Next } from 'koa'
import { Users } from '../models/users'
import { Role } from '../models/role'
import { createToken } from '../utils/jwt'
import { Op } from 'sequelize'
import conf from '../config'
import { rand } from '../utils/tool'

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     tags:
 *       - users
 *     summary: 新增用户
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
 *                   mobile:
 *                     type: string
 *                     description: 姓名
 *                   name:
 *                     type: string
 *                     description: 电话
 *                   pwd:
 *                     type: string
 *                     description: 密码
 *                   role_ids:
 *                     type: string
 *                     description: 角色
 *                   head:
 *                     type: string
 *                     description: 头像
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const create = async (ctx: Context) => {
  const { cell } = ctx.request.body
  const res = await Users.create(cell)
  ctx.DATA.data = res
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/users/update:
 *   put:
 *     tags:
 *       - users
 *     summary: 修改用户
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
 *                   mobile:
 *                     type: string
 *                     description: 姓名
 *                   name:
 *                     type: string
 *                     description: 电话
 *                   pwd:
 *                     type: string
 *                     description: 密码
 *                   role_ids:
 *                     type: string
 *                     description: 角色
 *                   head:
 *                     type: string
 *                     description: 头像
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const update = async (ctx: Context) => {
  const { id, cell } = ctx.request.body
  const [uLen] = await Users.update(cell, {
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
 * /api/users/delete:
 *   delete:
 *     tags:
 *       - users
 *     summary: 删除用户
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
  const [uLen] = await Users.update(
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
 * /api/users/select:
 *   get:
 *     tags:
 *       - users
 *     summary: 查询单个用户
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
  const res = await Users.findOne({
    where: { del: 0, id },
    attributes: attributes ? (attributes as string).split(',').filter((v) => v !== 'pwd') : { exclude: ['pwd'] }
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
 * /api/users/findAll:
 *   post:
 *     tags:
 *       - users
 *     summary: 查询用户列表
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               mobile:
 *                 type: string
 *               role_id:
 *                 type: string
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
  const { page = 1, size = 20, role_id, name, mobile, attributes, order = [['id', 'DESC']] } = ctx.request.body
  const fixpage = +page
  const fixsize = +size
  const where = {
    name: { [Op.like]: `%${name}%` },
    mobile: { [Op.like]: `%${mobile}%` },
    role_ids: { [Op.like]: `%|${role_id}|%` }
  }
  if (!name) delete where.name
  if (!mobile) delete where.mobile
  if (!role_id) delete where.role_ids
  const res = await Users.findAndCountAll({
    where: { del: 0, ...where },
    offset: fixsize * fixpage - fixsize,
    limit: fixsize,
    order,
    attributes: attributes ? (attributes as string).split(',').filter((v) => v !== 'pwd') : { exclude: ['pwd'] }
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
 * /api/users/login:
 *   post:
 *     tags:
 *       - users
 *     summary: 登录
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *                 description: 电话
 *               pwd:
 *                 type: string
 *                 description: 密码
 *               code:
 *                 type: string
 *                 description: 验证码
 *               key:
 *                 type: string
 *                 description: 验证码key
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const login = async (ctx: Context) => {
  const { mobile, pwd } = ctx.request.body
  const users = await Users.findOne({
    where: { del: 0, mobile, pwd },
    attributes: { exclude: ['pwd'] }
  })
  if (!users) {
    ctx.DATA.code = 1
    ctx.DATA.msg = '账号或密码错误'
    ctx.body = ctx.DATA
    return
  }
  const { role_ids } = users
  let authority: string[] = []
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
    role.forEach((v) => {
      authority = [...authority, ...v.authority.split(',')]
    })
  }
  const noRepeat = authority.filter((v, i) => {
    return authority.indexOf(v) === i
  })
  const token = createToken({ id: users.id, name: users.name, openid: users.openid, authority: noRepeat.join(',') })
  ctx.DATA.data = {
    id: users.id,
    mobile: users.mobile,
    name: users.name,
    head: users.head,
    token,
    openid: users.openid,
    easyPwd: pwd === 'e10adc3949ba59abbe56e057f20f883e'
  }
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/users/wxLogin:
 *   post:
 *     tags:
 *       - users
 *     summary: wx登录
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: code
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const wxLogin = async (ctx: Context) => {
  const { code } = ctx.request.body
  const response = await fetch(`https://api.weixin.qq.com/sns/jscode2session?grant_type=authorization_code&js_code=${code}&appid=${conf.weapp.appid}&secret=${conf.weapp.secret}`)
  const data: any = await response.json()
  const { session_key, unionid, openid } = data
  let users = await Users.findOne({
    where: { del: 0, openid },
    attributes: { exclude: ['pwd'] }
  })
  if (!users) {
    users = await Users.create({
      name: `用户${rand(10000, 99999)}`,
      openid,
      unionid
    })
  }
  const { role_ids } = users
  let authority: string[] = []
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
    role.forEach((v) => {
      authority = [...authority, ...v.authority.split(',')]
    })
  }
  const noRepeat = authority.filter((v, i) => {
    return authority.indexOf(v) === i
  })
  const token = createToken({ id: users.id, name: users.name, openid, authority: noRepeat.join(',') })
  ctx.DATA.data = {
    id: users.id,
    mobile: users.mobile,
    name: users.name,
    head: users.head,
    token,
    session_key,
    openid,
    unionid
  }
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/users/wxBindMobile:
 *   post:
 *     tags:
 *       - users
 *     summary: wx绑定手机
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: code
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const wxBindMobile = async (ctx: Context) => {
  const { id } = ctx.USER
  const { code } = ctx.request.body
  const tempUsers = await Users.findOne({
    where: { del: 0, id },
    attributes: { exclude: ['pwd'] }
  })
  if (tempUsers.mobile) {
    ctx.DATA.msg = '查询此用户已存在手机号,请使用修改手机号换绑'
    ctx.body = ctx.DATA
    return
  }
  const response = await fetch(`https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${ctx.WxAccessToken}`, {
    method: 'post',
    body: JSON.stringify({ code }),
    headers: { 'Content-Type': 'application/json' }
  })
  const data: any = await response.json()
  const { phone_info } = data
  const { purePhoneNumber: mobile, countryCode } = phone_info
  // 根据号码查询库里是否已存在此号码用户,已存在,将微信用户绑定到原数据并删除临时数据.不存在,就修改临时数据
  const users = await Users.findOne({
    where: { del: 0, mobile },
    attributes: { exclude: ['pwd'] }
  })
  let editLen
  const defVipRole = '|20|'
  if (users) {
    // 删除临时数据
    Users.update({ del: 1 }, { where: { id } })
    let role_ids = users.role_ids
    if (!role_ids.includes(defVipRole)) {
      let arr = role_ids.split(',')
      arr.push(defVipRole)
      role_ids = arr.join(',')
    }
    editLen = await Users.update({ mobile, countryCode, role_ids, openid: tempUsers.openid, unionid: tempUsers.unionid }, { where: { id: users.id } })
  } else {
    editLen = await Users.update({ mobile, countryCode, role_ids: defVipRole }, { where: { id } })
  }
  if (!editLen[0]) {
    ctx.DATA.code = 1
    ctx.DATA.msg = '未找到数据'
  }
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/users/resetPwd:
 *   put:
 *     tags:
 *       - users
 *     summary: 重置密码
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
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const resetPwd = async (ctx: Context) => {
  const { id } = ctx.request.body
  const [uLen] = await Users.update({ pwd: 'e10adc3949ba59abbe56e057f20f883e' }, { where: { id } })
  if (!uLen) {
    ctx.DATA.code = 1
    ctx.DATA.msg = '未找到数据'
  }
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/users/updetePwd:
 *   put:
 *     tags:
 *       - users
 *     summary: 修改密码
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
 *               pwd:
 *                 type: string
 *                 description: ID
 *               newPwd:
 *                 type: string
 *                 description: ID
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const updatePwd = async (ctx: Context) => {
  const { id, pwd, newPwd } = ctx.request.body
  const res = await Users.findOne({
    where: { del: 0, id, pwd }
  })
  if (!res) {
    ctx.DATA.code = 1
    ctx.DATA.msg = '旧密码错误,如果忘记密码请联系管理员重置'
    ctx.body = ctx.DATA
    return
  }
  const [uLen] = await Users.update({ pwd: newPwd }, { where: { id } })
  if (!uLen) {
    ctx.DATA.code = 1
    ctx.DATA.msg = '未找到数据'
  }
  ctx.body = ctx.DATA
}
