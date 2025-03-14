/**
 * 数据校验
 * wiki：https://github.com/node-modules/parameter/blob/master/example.js
 * @type {Parameter}
 */
import createHttpError from 'http-errors'
import { Context, Next } from 'koa'
import Parameter from 'parameter'
const parm = new Parameter()

// 自定义校验
// parm.addRule('name', fn)

// 路由校验列表
const ruleList: any = {
  _api_tool_sendEmail: {
    name: 'string?',
    phone: 'number?',
    problem: 'string?',
    to: 'string?'
    // to: /^[a-z]$/ // 正则
    // to: [1, 2] // 限定
    // to: 'object' // 对象
    // to: 'array' // 数组
  }
}

/**
 * 校验方法
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
export const parameter = async (ctx: Context, next: Next) => {
  let errors, data
  if (ctx.request.method === 'GET') {
    data = ctx.query
  } else {
    data = ctx.request.body
  }
  try {
    const name = ctx.routerPath.replace(/\//g, '_')
    errors = parm.validate(ruleList[name], data)
  } catch (e) {
    throw createHttpError(500, e.toString() + ',该请求要求校验参数却没有配置校验规则')
  }
  if (errors && errors.length) {
    ctx.DATA.data = errors
    throw createHttpError(500, '数据校验未通过')
  }
  await next()
}
