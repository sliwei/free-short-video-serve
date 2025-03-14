import { Context, Next } from 'koa'
import conf from '../../config'
import md5 from 'js-md5'
import createHttpError from 'http-errors'
import captcha from 'svg-captcha'
import { randomString } from '../tool'
import { redisClient } from '../redis'

export interface CreateSvgCaptcha {
  /* 字号 default: 40 */
  fontSize?: number
  /* 宽 default: 150 */
  width?: number
  /* 高 default: 50 */
  height?: number
  /* 背景色 default: #000 */
  bg?: string
}

/**
 * 生成验证码
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
export const createSvgCaptcha = async ({ fontSize = 40, width = 150, height = 50, bg = '#000' }: CreateSvgCaptcha) => {
  captcha.options.fontSize = fontSize // captcha的宽度
  captcha.options.width = width // 验证码的高度
  captcha.options.height = height // captcha文本大小
  // captcha.options.charPreset = charPreset; // 随机字符预设
  const code = captcha.create({
    size: 4,
    // ignoreChars: '0o1iLlI',
    ignoreChars: '0123456789oiLlI',
    noise: 2,
    color: false
    // background: bg
  })
  // 方式一: 直接返回MD5加密+盐后的key,校验时解密key并对比(存在重复利用漏洞)
  // const key = md5(`${conf.encryptedCharacter}${code.text.toLowerCase()}`)
  // 方式二: 将 uuid: code存Redis,并添加时效,校验后删除Redis保证不能重复利用
  const key = `SvgCaptchaKey:${randomString(20)}`
  await redisClient.connect()
  await redisClient.set(key, code.text.toLowerCase())
  await redisClient.expire(key, conf.svgCaptchaExpire)
  await redisClient.disconnect()
  return { ...code, key }
}

/**
 * 检测验证码正确性
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
export const checkSvgCaptcha = async (ctx: Context, next: Next) => {
  let code
  let key
  if (ctx.request.method === 'GET') {
    code = ctx.query.code
    key = ctx.query.key
  } else {
    code = ctx.request.body.code
    key = ctx.request.body.key
  }
  let msg = '验证码错误'
  let status = false
  if (code && key) {
    // 方式一:
    // const result = md5(`${conf.encryptedCharacter}${code.toLowerCase()}`)
    // if (result === key) {
    //   status = true
    // }
    // 方式二:
    await redisClient.connect()
    const value = await redisClient.get(key)
    await redisClient.del(key)
    await redisClient.disconnect()
    if (value) {
      if (code.toLowerCase() === value) {
        status = true
      }
    } else {
      msg = '验证码过期或被使用'
    }
  }
  if (!status) {
    ctx.DATA.code = 1
    throw createHttpError(200, msg)
  }
  await next()
}
