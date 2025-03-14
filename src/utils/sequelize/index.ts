import * as logs from '../log4js'
import { Sequelize } from 'sequelize'
import config from '../../config'
import 'colors'

const { db, env } = config
const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  dialect: 'mariadb',
  port: 3306,
  pool: {
    max: 100,
    min: 0,
    acquire: 20000,
    idle: 2000
  },
  define: {
    timestamps: false
  },
  timezone: '+08:00',
  logging: (sql: string, timing?: number) => {
    logs.info(sql)
  },
  query: {}
})

sequelize
  .authenticate()
  .then(() => {
    logs.info('数据库连接成功')
    if (env === 'production') {
      sequelize.sync({ alter: true })
    }
  })
  .catch((err) => {
    logs.error('数据库连接失败', err)
  })

export { sequelize }
