import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/sequelize'
import dayjs from 'dayjs'

export class Users extends Model {
  declare id: number
  /* 上报ID */
  declare mobile: string
  /* 上报ID */
  declare name: string
  /* 密码 默认123456 */
  declare pwd: string
  /* 角色组,role表id字符串拼接|role_id|,|role_id| */
  declare role_ids: string
  /* 头像 */
  declare head: string
  /* openid */
  declare openid: string
  /* unionid */
  declare unionid: string
  /* 区号 */
  declare countryCode: string
  declare del: number
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '上报ID'
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '上报ID'
    },
    pwd: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '密码,默认123456',
      defaultValue: 'e10adc3949ba59abbe56e057f20f883e'
    },
    role_ids: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '角色组,role表id字符串拼接|role_id|,|role_id|'
    },
    head: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '头像'
    },
    openid: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'openid'
    },
    unionid: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'unionid'
    },
    countryCode: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'unionid'
    },
    del: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    getterMethods: {
      ctime() {
        return dayjs(this.getDataValue('ctime')).format('YYYY-MM-DD HH:mm:ss')
      },
      utime() {
        return dayjs(this.getDataValue('utime')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    comment: '用户',
    tableName: 'users',
    timestamps: true,
    createdAt: 'ctime',
    updatedAt: 'utime',
    sequelize
  }
)
