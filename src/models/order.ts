import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../utils/sequelize'
import dayjs from 'dayjs'

export class Order extends Model {
  declare id: number
  /* 步骤 'create', 'acceptCheck', 'salesCheck', 'masterCheck' */
  declare step: string
  /* 步骤模板 */
  declare steps: string
  /* 当前状态 0:待审核 1:通过 2:驳回 */
  declare status: number
  /* 审核备注 */
  declare remarks: string
  /* 供应商 */
  declare supplier: string
  /* 施工单位 */
  declare construction: string
  /* 工程名称 */
  declare name: string
  /* 项目经理 */
  declare master: string
  /* 浇筑部位 */
  declare position: string
  /* 供货地址 */
  declare address: string
  /* 强度等级 */
  declare level: string
  /* 浇筑方式 */
  declare type: string
  /* 计划方量 */
  declare volume: number
  /* 供货时间 */
  declare support_time: string
  /* 最后一次供货时间 */
  declare last_support_time: string
  /* 报单人 */
  declare operator: string
  /* 联系电话 */
  declare mobile: string
  /* 工地联系人 */
  declare work_operator: string
  /* 联系电话 */
  declare work_mobile: string
  /* 施工泵车 */
  declare car: string
  /* 施工序列 */
  declare index: string
  /* 施工说明 */
  declare notes: string
  /* 运距 */
  declare distance: string
  /* 项目负责业务员 */
  declare sales: string
  /* 是否需要资料 */
  declare material: string
  /* 创建人id */
  declare cid: string
  /* 创建人name */
  declare cname: string
  /* 是否被撤销 */
  declare cancel: number
  declare del: number
  declare ctime: string
  declare utime: string
}

Order.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    step: { type: DataTypes.STRING(100), comment: '步骤' },
    steps: { type: DataTypes.STRING(2000), comment: '步骤模板' },
    status: { type: DataTypes.INTEGER, comment: '当前状态 0:待审核 1:通过 2:驳回' },
    remarks: { type: DataTypes.STRING(100), comment: '审核备注' },
    supplier: { type: DataTypes.STRING(100), comment: '供应商' },
    construction: { type: DataTypes.STRING(100), comment: '施工单位' },
    name: { type: DataTypes.STRING(50), comment: '工程名称' },
    master: { type: DataTypes.STRING(50), comment: '项目经理' },
    position: { type: DataTypes.STRING(50), comment: '浇筑部位' },
    address: { type: DataTypes.STRING(100), comment: '供货地址' },
    level: { type: DataTypes.STRING(50), comment: '强度等级' },
    type: { type: DataTypes.STRING(50), comment: '浇筑方式' },
    volume: { type: DataTypes.INTEGER, comment: '计划方量' },
    support_time: {
      type: DataTypes.DATE,
      comment: '供货时间',
      get() {
        return dayjs(this.getDataValue('support_time')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    last_support_time: {
      type: DataTypes.DATE,
      comment: '最后一天施工时间',
      get() {
        return dayjs(this.getDataValue('last_support_time')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    operator: { type: DataTypes.STRING(50), comment: '报单人' },
    mobile: { type: DataTypes.STRING(50), comment: '联系电话' },
    work_operator: { type: DataTypes.STRING(50), comment: '工地联系人' },
    work_mobile: { type: DataTypes.STRING(50), comment: '联系电话' },
    car: { type: DataTypes.STRING(50), comment: '施工泵车' },
    index: { type: DataTypes.STRING(50), comment: '施工序列' },
    notes: { type: DataTypes.STRING(200), comment: '施工说明' },
    distance: { type: DataTypes.STRING(50), comment: '运距' },
    sales: { type: DataTypes.STRING(50), comment: '项目负责业务员' },
    material: { type: DataTypes.STRING(50), comment: '是否需要资料' },
    cid: { type: DataTypes.INTEGER, comment: '创建人id' },
    cname: { type: DataTypes.STRING(50), comment: '创建人name' },
    cancel: { type: DataTypes.INTEGER, allowNull: false, comment: '是否被撤销', defaultValue: 0 },
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
    comment: '业务单',
    tableName: 'order',
    timestamps: true,
    // 报单日期
    createdAt: 'ctime',
    updatedAt: 'utime',
    sequelize
  }
)
