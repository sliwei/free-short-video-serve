import { Context } from 'koa'
import conf from '../config'
import md5 from 'js-md5'
import { createSvgCaptcha } from '../utils/verification'

/**
 * @swagger
 * /api/tool/svgCaptcha:
 *   get:
 *     tags:
 *       - tool
 *     summary: 生成数字字母验证码
 *     description: 说明
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: size
 *         type: string
 *         description: 字体大小
 *       - in: query
 *         name: w
 *         type: string
 *         description: 高
 *       - in: query
 *         name: h
 *         type: string
 *         description: 宽
 *       - in: query
 *         name: bg
 *         type: string
 *         description: 背景色#xxx
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const svgCaptcha = async (ctx: Context) => {
  const fontSize = Number(ctx.query.size) || 40
  const width = Number(ctx.query.w) || 150
  const height = Number(ctx.query.h) || 50
  const bg = (ctx.query.bg as string) || '#000'
  const captcha = await createSvgCaptcha({ fontSize, width, height, bg })
  ctx.DATA.data = {
    svg: captcha.data,
    key: captcha.key
  }
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/tool/sendEmail:
 *   post:
 *     tags:
 *       - tool
 *     summary: 发邮件
 *     description: 发邮件
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 姓名
 *               phone:
 *                 type: number
 *                 description: 电话
 *               problem:
 *                 type: string
 *                 description: 问题
 *               to:
 *                 type: string
 *                 description: 收件人
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
export const sendEmail = async (ctx: Context) => {
  const { name, phone, problem, to } = ctx.request.body
  // send mail with defined transport object
  const data = {
    from: `"官方" <${conf.mail.from}>`, // sender address
    to, // list of receivers
    subject: '收到邮件', // Subject line
    html: `<div>
    <h2>姓名：${name}</h2>
    <h3>电话：${phone}</h3>
    <div>问题：${problem}</div>
  </div>` // html body
  }
  const info = await ctx.mailer.sendMail(data)
  ctx.DATA.data = {
    from: info.from,
    to: info.to,
    accepted: info.accepted,
    response: info.response,
    messageId: info.messageId
  }
  ctx.body = ctx.DATA
}
