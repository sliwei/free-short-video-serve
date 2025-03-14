import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/sequelize'
import dayjs from 'dayjs'

export class Authority extends Model {
  declare id: number
  /* 父级id */
  declare pid: number
  /* 权限名 */
  declare title: string
  /* 权限码 */
  declare key: string
  /* 类型0菜单1功能 */
  declare type: number
  declare del: number
}
export interface AuthorityTree extends Authority {
  children: Authority[]
}
Authority.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: '父级id'
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '权限名'
    },
    key: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: '权限码'
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '类型0菜单1功能'
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
    comment: '权限',
    tableName: 'authority',
    timestamps: true,
    createdAt: 'ctime',
    updatedAt: 'utime',
    sequelize
  }
)
