import { Ignore } from './../node_modules/ignore/index.d'
import Koa from 'koa'
import views from 'koa-views'
import json from 'koa-json'
import favicon from 'koa-favicon'
import koaBody from 'koa-body'
import koaStatic from 'koa-static'
// import logger from 'koa-logger'
import 'colors'
import path, { resolve } from 'path'
import { koaSwagger } from 'koa2-swagger-ui'
import moment from 'moment'
import helmet from 'koa-helmet'
import index from './routes'
import conf from './config'
import * as logs from './utils/log4js'
import fs from 'fs'
import chokidar from 'chokidar'
import { init } from './utils/videoInit'

global.data = []
global.data2 = []

// @ts-ignore
// chokidar.watch(process.env.VIDEO_PATH).on('all', (event) => {
init()
// })

const app = new Koa()

// 安全插件
app.use(
  helmet({
    contentSecurityPolicy: false
  })
)

// 允许上传文件
app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 1000 * 1024 * 1024 // 设置上传文件大小最大限制
    }
  })
)

// 网站图标
app.use(favicon(resolve(__dirname, '../public', 'favicon.ico')))

// 返回美化json
app.use(json())

// koa-logger
// app.use(logger())

// log4js
app.use(async (ctx, next) => {
  await next()
  if (ctx.request.url.startsWith('/api/')) {
    // 只记录/api/开头的请求
    logs.info(`ID:${ctx.USER?.id || 0} ${ctx.USER?.name || '未登录'} ${ctx.request.method} ${ctx.request.url}`, JSON.parse(JSON.stringify(ctx.query)), JSON.parse(JSON.stringify(ctx.request.body)))
  }
})

app.use(async (ctx, next) => {
  await next()
  if (ctx.path.endsWith('.mp4')) {
    let file = process.env.VIDEO_PATH + decodeURIComponent(ctx.path)
    let stat = fs.statSync(file)
    let fileSize = stat.size
    let range = ctx.header.range
    if (range) {
      let parts = range.replace(/bytes=/, '').split('-')
      let start = parseInt(parts[0], 10)
      let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      let chunksize = end - start + 1
      ctx.status = 206
      ctx.set('Content-Range', `bytes ${start}-${end}/${fileSize}`)
      ctx.set('Accept-Ranges', 'bytes')
      ctx.set('Content-Length', chunksize.toString())
      ctx.set('Content-Type', 'video/mp4')
      ctx.body = fs.createReadStream(file, { start, end })
    } else {
      ctx.status = 200
      ctx.set('Content-Length', fileSize.toString())
      ctx.set('Content-Type', 'video/mp4')
      ctx.body = fs.createReadStream(file)
    }
  }
})

// 资源文件
app.use(koaStatic(resolve(__dirname, '../public')))

// 模板引擎
app.use(views(resolve(__dirname, '../views'), { map: { html: 'nunjucks' } }))

// 加入cookie.get、set及自定义返回格式
app.use(async (ctx, next) => {
  // 自定义返回格式
  ctx.DATA = {
    data: {},
    msg: '成功',
    code: 0
  }
  await next()
})

if (conf.env === 'development') {
  // swagger
  app.use(
    koaSwagger({
      routePrefix: '/doc', // host at /swagger instead of default /docs
      swaggerOptions: {
        url: '/api/swagger.json' // example path to json 其实就是之后swagger-jsdoc生成的文档地址
      }
    })
  )
}

// error 业务逻辑错误
app.use((ctx, next) => {
  return next().catch((err) => {
    let code = err.status || err.statusCode || 500
    logs.error(err)
    ctx.DATA.code = 1
    ctx.DATA.msg = `Error:${err.requestId},${err.status},${err.message || 'unknown error'}`
    ctx.body = ctx.DATA
    ctx.status = code
  })
})

// koa error-handling 服务端、http错误
app.on('error', (err, ctx) => {
  const ignoreErr = /read ECONNRESET|write EPIPE|write ECONNRESET/
  if (ignoreErr.test(err.message)) {
    return
  }
  logs.error('error', err.message)
})

// routes
app.use(index.routes()).use(index.allowedMethods())

// 监听未捕获的异常
process.on('uncaughtException', (error) => {
  logs.error('uncaughtException', error)
})

// 监听Promise没有被捕获的失败函数
process.on('unhandledRejection', (error) => {
  logs.error('unhandledRejection', error)
})

process.on('exit', function (code) {
  logs.error(`### [服务停止 - ${process.env.ENV}]\n
时间：${moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')}\n
CODE：${code}`)
})

app.listen(conf.port, () => {
  logs.info(`Listening on port: `, `http://localhost:${conf.port}`)
})
