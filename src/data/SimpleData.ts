import { getType } from 'complex-utils-next'
import Data from './Data'

export interface SimpleDataInitOption {
  name?: string
  prop?: string
  extra?: Record<PropertyKey, unknown>
}

class SimpleData extends Data {
  static $name = 'SimpleData'
  $name: string
  $prop: string
  $extra: Record<PropertyKey, unknown>
  constructor(initOption: SimpleDataInitOption) {
    super()
    this.$name = initOption.name || ''
    this.$prop = initOption.prop || ''
    if (getType(initOption.extra) === 'object') {
      this.$extra = initOption.extra!
    } else {
      this.$extra = {}
      if (initOption.extra !== undefined) {
        this.$exportMsg('初始化extra出错，数据必须为对象！')
      }
    }
  }
  /**
   * 设置额外数据
   * @param {string} prop 属性
   * @param {*} data 数据
   */
  $setExtra(prop: string, data: unknown) {
    this.$extra[prop] = data
  }
  /**
   * 获取额外数据
   * @param {string} prop 属性
   * @returns {*}
   */
  $getExtra(prop: string) {
    return this.$extra[prop]
  }
  /**
   * 获取额外数据
   * @param {string} prop 属性
   * @returns {*}
   */
  $clearExtra(prop?: string) {
    if (!prop) {
      this.$extra = {}
    } else {
      delete this.$extra[prop]
    }
  }
  /**
   * 重置额外数据，清除全部数据
   */
  $resetExtra() {
    this.$clearExtra()
  }
  $getName(): string {
    return `[${super.$getName()}-(${this.$name}/${this.$prop})]`
  }
}

export default SimpleData
