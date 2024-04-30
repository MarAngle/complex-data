import { getType, setProp } from 'complex-utils'

export interface InterfaceValueType<D> {
  default: D
  [prop: PropertyKey]: undefined | D
}

export type InterfaceValueInitOption<D> = D | InterfaceValueType<D>

// 警告：undefined作为无效值会影响判断逻辑，因此不能传递undefined
class InterfaceValue<D> extends null {
  static $name = 'InterfaceValue'
  value: InterfaceValueType<D>
  constructor(initOption?: InterfaceValueInitOption<D>) {
    if (getType(initOption) !== 'object') {
      this.value = {
        default: initOption as D
      }
    } else {
      this.value = initOption as InterfaceValueType<D>
    }
  }
  getData() {
    return this.value
  }
  /**
   * 设置属性值
   * @param {string} prop 属性
   * @param {*} value 值
   */
  setValue(prop: string, value: D, useSetData?: boolean) {
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
  forEach(fn: (value: D, prop: string, data: InterfaceValueType<D>) => void) {
    for (const prop in this.value) {
      fn(this.value[prop]!, prop, this.value)
    }
  }
  change(fn: (value: D, prop: string, data: InterfaceValueType<D>) => D) {
    for (const prop in this.value) {
      this.value[prop] = fn(this.value[prop]!, prop, this.value)
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
