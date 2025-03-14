import koaRouter from 'koa-router'
import swaggerJsdoc from 'swagger-jsdoc'
import { join } from 'path'
import conf from '../config'
import createHttpError from 'http-errors'
// 中间件
import { parameter } from '../utils/parameter' // 参数校验
import { mailer } from '../utils/nodemailer' // 发邮件
import { checkToken } from '../utils/jwt' // jwt token校验
import { checkSvgCaptcha } from '../utils/verification' // 验证码校验
import { wxAccessToken } from '../utils/weapp' // 微信中间件
// controllers
import * as test from '../controllers/test'
import * as video from '../controllers/video'
import * as tool from '../controllers/tool'
import * as index from '../controllers/index'
import * as users from '../controllers/users'
import * as role from '../controllers/role'
import * as authority from '../controllers/authority'
import * as enums from '../controllers/enums'
import * as order from '../controllers/order'
import * as enums_group from '../controllers/enums_group'

const router = new koaRouter()

// test
router.get('/api/test/get', test.get)
router.post('/api/test/post', test.post)
// video
router.post('/api/video/list', video.list)
router.post('/api/video/recommend', video.recommend)
// users
// router.post('/api/users/create', checkToken, users.create)
// router.put('/api/users/update', checkToken, users.update)
// router.del('/api/users/delete', checkToken, users._delete)
// router.get('/api/users/select', checkToken, users.select)
// router.post('/api/users/findAll', checkToken, users.findAll)
// router.post('/api/users/login', checkSvgCaptcha, users.login)
// router.post('/api/users/wxLogin', users.wxLogin)
// router.post('/api/users/wxBindMobile', checkToken, wxAccessToken, users.wxBindMobile)
// router.put('/api/users/resetPwd', checkToken, users.resetPwd)
// router.put('/api/users/updatePwd', checkToken, users.updatePwd)
// // role
// router.post('/api/role/create', checkToken, role.create)
// router.put('/api/role/update', checkToken, role.update)
// router.del('/api/role/delete', checkToken, role._delete)
// router.get('/api/role/select', checkToken, role.select)
// router.post('/api/role/findAll', checkToken, role.findAll)
// router.get('/api/role/findAuthority', checkToken, role.findAuthority)
// // authority
// router.post('/api/authority/create', checkToken, authority.create)
// router.put('/api/authority/update', checkToken, authority.update)
// router.del('/api/authority/delete', checkToken, authority._delete)
// router.get('/api/authority/select', checkToken, authority.select)
// router.post('/api/authority/findAll', checkToken, authority.findAll)
// router.post('/api/authority/findTree', checkToken, authority.findTree)
// // enums
// router.post('/api/enums/create', checkToken, enums.create)
// router.put('/api/enums/update', checkToken, enums.update)
// router.put('/api/enums/updateIndex', checkToken, enums.updateIndex)
// router.del('/api/enums/delete', checkToken, enums._delete)
// router.get('/api/enums/select', checkToken, enums.select)
// router.post('/api/enums/findAll', checkToken, enums.findAll)
// router.post('/api/enums/findAllOfCategor', checkToken, enums.findAllOfCategor)
// router.post('/api/enums/findAllOfParent', checkToken, enums.findAllOfParent)
// // order
// router.post('/api/order/create', checkToken, order.create)
// router.put('/api/order/update', checkToken, order.update)
// router.del('/api/order/delete', checkToken, order._delete)
// router.get('/api/order/select', checkToken, order.select)
// router.post('/api/order/findAll', checkToken, order.findAll)
// router.get('/api/order/exportTodayOrder', checkToken, order.exportTodayOrder)
// router.get('/api/order/getTodayOrder', checkToken, order.getTodayOrder)
// // enums_group
// router.post('/api/enums_group/create', checkToken, enums_group.create)
// router.put('/api/enums_group/update', checkToken, enums_group.update)
// router.del('/api/enums_group/delete', checkToken, enums_group._delete)
// router.get('/api/enums_group/select', checkToken, enums_group.select)
// router.post('/api/enums_group/findAll', checkToken, enums_group.findAll)
// // tool
// router.get('/api/tool/svgCaptcha', tool.svgCaptcha)
// router.post('/api/tool/sendEmail', checkToken, parameter, mailer, tool.sendEmail)
// swagger json
const jsDoc = swaggerJsdoc({
  definition: {
    openapi: '3.0.1',
    info: {
      description: '服务端',
      version: '1.0.0',
      title: '服务端'
    },
    host: '',
    basePath: '/',
    // tags: [
    //   {
    //     name: 'test',
    //     description: 'auth'
    //   }
    // ],
    schemes: ['http', 'https'],
    // components: {
    //   schemas: {
    //     Order: {
    //       type: 'object'
    //     }
    //   },
    //   securitySchemes: {
    //     BasicAuth: { type: 'http', scheme: 'basic' }
    //   }
    // }
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [join(__dirname, '../controllers/*.js')]
})
router.get('/api/swagger.json', async (ctx) => {
  ctx.set('Content-Type', 'application/json')
  if (conf.env === 'development') {
    ctx.body = jsDoc
  } else {
    throw createHttpError(404)
  }
})
// index
router.get('/', index.index)

export default router
