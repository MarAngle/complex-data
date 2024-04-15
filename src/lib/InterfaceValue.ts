import { getType, setProp } from 'complex-utils'

export type InterfaceValueType<D> = undefined | D

export type InterfaceValueInitOption<D> = D | Record<PropertyKey, InterfaceValueType<D>>

class InterfaceValue<D> extends null {
  static $name = 'InterfaceValue'
  init: boolean
  value: Record<PropertyKey, InterfaceValueType<D>>
  constructor(initOption?: InterfaceValueInitOption<D>) {
    if (initOption === undefined) {
      this.init = false
      this.value = {
        default: undefined
      }
    } else {
      this.init = true
      if (getType(initOption) !== 'object') {
        this.value = {
          default: initOption as D
        }
      } else {
        this.value = initOption as Record<PropertyKey, InterfaceValueType<D>>
      }
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
  setValue(prop: string, value: InterfaceValueType<D>, useSetData?: boolean) {
    if (useSetData === true) {
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
  format(format: (value: Record<PropertyKey, InterfaceValueType<D>>) => void) {
    format(this.value)
  }
  map(fn: (data: Record<PropertyKey, InterfaceValueType<D>>, prop: string) => void) {
    for (const prop in this.value) {
      fn(this.value, prop)
    }
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
