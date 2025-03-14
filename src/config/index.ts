import * as logs from '../utils/log4js'

/**
 * 配置文件
 */
const config = {
  title: 'api',
  env: process.env.NODE_ENV, // development || production
  port: 3000, // 端口
  expirationDate: 1000 * 3600 * 24 * 7, // 7天
  encryptedCharacter: 'JcqlC3eT', // 验证码加盐
  svgCaptchaExpire: 60, // 验证码Redis过期时间
  mail: {
    from: process.env.MAIL_FROM, // 标题发件人
    user: process.env.MAIL_USER, // 登录人
    pass: process.env.MAIL_PASS // 密码
  },
  db: {
    database: process.env.DB_database,
    username: process.env.DB_username,
    password: process.env.DB_password,
    host: process.env.DB_host,
    port: process.env.DB_port
  },
  redis: process.env.RD_url,
  weapp: {
    appid: 'wxae222910244f60a2',
    secret: 'd55f01cc8613faa2e47186dc61f84c40'
  }
}

logs.info('ENV:', config.env)
logs.info('DB_HOST:', config.db.host)
logs.info('DB_DATABASE:', config.db.database)

export default config
