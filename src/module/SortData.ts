import ResetData from './ResetData'
import type { ResetDataInitOption } from './ResetData'

export type compareFunction<T = any> = (a: T, b: T) => number

export interface SortDataInitOption extends ResetDataInitOption {
  prop?: PropertyKey[]
  sorter?: Record<PropertyKey, true | compareFunction>
}

export type orderType = 'asc' | 'desc'

class SortData extends ResetData {
  static $name = 'SortData'
  static $formatConfig = { name: 'SortData', level: 50, recommend: true }
  prop: PropertyKey[]
  sorter: Record<PropertyKey, true | compareFunction>
  data: {
    value: undefined | PropertyKey
    order: undefined | orderType
  }
  constructor (initOption: SortDataInitOption) {
    super('sort', initOption)
    this.prop = initOption.prop || []
    this.sorter = initOption.sorter || {}
    this.data = {
      value: undefined,
      order: undefined
    }
  }
  hasProp(prop: PropertyKey) {
    return this.prop.indexOf(prop) > -1
  }
  getConfig(prop: PropertyKey) {
    if (this.hasProp(prop)) {
      return this.sorter[prop]
    } else {
      return false
    }
  }
  setData(value: undefined | PropertyKey, order: undefined | orderType) {
    this.data.value = value
    this.data.order = order
  }
  getValue() {
    return this.data.value
  }
  getOrder() {
    return this.data.order
  }
  getData() {
    return {
      value: this.getValue(),
      order: this.getOrder()
    }
  }
  /**
   * 重置操作
   * @param {boolean} force 重置判断值
   */
  reset(force?: boolean) {
    if (force !== false) {
      this.setData(undefined, undefined)
    }
  }
  destroy(force?: boolean) {
    if (force !== false) {
      this.reset(force)
    }
  }
}

export default SortData
