import { setProp } from 'complex-utils-next'
import Data from '../data/Data'

export type InterfaceValueInitOption<D> = Record<PropertyKey, D | undefined>

class InterfaceValue<D> extends Data {
  static $name = 'InterfaceValue'
  init: boolean
  value: Record<PropertyKey, D | undefined>
  constructor(initOption?: InterfaceValueInitOption<D>) {
    super()
    this.init = false
    this.value = {
      default: undefined
    }
    this.setData(initOption)
  }
  setData(initOption?: InterfaceValueInitOption<D | undefined>) {
    if (initOption !== undefined) {
      for (const n in initOption) {
        this.setValue(n, initOption[n])
      }
      this.init = true
    }
  }
  getData() {
    return this.value
  }
  isInit() {
    return this.init
  }
  /**
   * 设置属性值
   * @param {string} prop 属性
   * @param {*} value 值
   */
  setValue(prop: string, value: D | undefined, useSetData?: boolean) {
    if (useSetData === true) {
      // ---
      setProp(this.value, prop, value, useSetData)
    } else {
      this.value[prop] = value
    }
  }
  getValue(prop?: string) {
    if (prop && this.value[prop] !== undefined) {
      return this.value[prop]
    }
    return this.value.default
  }
  format(format: (value: Record<PropertyKey, D | undefined>) => void) {
    format(this.value)
  }
  toString() {
    const value = this.getValue('default')
    const type = typeof value
    if (type === 'object' || type === 'function') {
      return (value as object).toString()
    } else if (type !== 'string') {
      return String(value)
    } else {
      return (value as unknown as string)
    }
  }
}

export default InterfaceValue
