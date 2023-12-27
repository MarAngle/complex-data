import { getType } from 'complex-utils'
import Data from './Data'

export interface SimpleDataInitOption {
  extra?: Record<PropertyKey, unknown>
}

class SimpleData extends Data {
  static $name = 'SimpleData'
  static $formatConfig = { name: 'Data:SimpleData', level: 30, recommend: false }
  $extra!: Record<PropertyKey, unknown>
  constructor(initOption: SimpleDataInitOption) {
    super()
    const extraType = getType(initOption.extra)
    Object.defineProperty(this, '$extra', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: extraType === 'object' ? initOption.extra : {}
    })
    if (extraType !== 'object' && initOption.extra !== undefined) {
      this.$exportMsg('初始化extra出错，数据必须为对象！')
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
  // 如添加销毁函数需要添加到BaseData的destroy中
}

export default SimpleData
