import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/sequelize'
import dayjs from 'dayjs'

export class Role extends Model {
  declare id: number
  /* 角色名 */
  declare title: string
  /* 角色说明 */
  declare notes: string
  /* 权限字符串xxx:0,xxx:1 */
  declare authority: string
  declare del: number
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: '角色名'
    },
    notes: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '角色说明'
    },
    authority: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: '权限字符串xxx:0,xxx:1'
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
    comment: '角色',
    tableName: 'role',
    timestamps: true,
    createdAt: 'ctime',
    updatedAt: 'utime',
    sequelize
  }
)
