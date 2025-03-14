import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/sequelize'
import dayjs from 'dayjs'

export class Enums extends Model {
  declare id: number
  /* 父级类型,取label */
  declare parentId: string
  /* 类型 */
  declare categor: string
  /* 标题 */
  declare label: string
  /* 内容 */
  declare value: string
  /* 排序 */
  declare index: number
  /* 枚举其他属性 */
  declare attr: string
  declare del: number
}

Enums.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    parentId: { type: DataTypes.STRING(100), comment: '父级类型', defaultValue: '' },
    categor: { type: DataTypes.STRING(100), comment: '类型' },
    label: { type: DataTypes.STRING(100), comment: '标题' },
    value: { type: DataTypes.STRING(2000), comment: '内容' },
    index: { type: DataTypes.INTEGER, comment: '排序', defaultValue: 1 },
    attr: { type: DataTypes.STRING(2000), comment: '枚举其他属性' },
    del: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
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
    comment: '枚举',
    tableName: 'enums',
    timestamps: true,
    createdAt: 'ctime',
    updatedAt: 'utime',
    sequelize
  }
)
