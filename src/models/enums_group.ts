import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/sequelize'
import dayjs from 'dayjs'

export class EnumsGroup extends Model {
  declare id: number
  /* 类型 */
  declare categor: string
  /* 是否有下级 */
  declare isChild: number
  declare del: number
}

EnumsGroup.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    categor: { type: DataTypes.STRING(100), comment: '类型' },
    isChild: { type: DataTypes.INTEGER, comment: '是否有下级', defaultValue: 0 },
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
    comment: '枚举组',
    tableName: 'enums_group',
    timestamps: true,
    createdAt: 'ctime',
    updatedAt: 'utime',
    sequelize
  }
)
