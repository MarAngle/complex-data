import { getCanUse, exportMsg } from 'complex-utils'

const ProxyCanUse = getCanUse('Proxy')
const proxyOption = {
  get: function(target: EmptyData, key: PropertyKey) {
    exportMsg(`非预期操作提醒: 正在对空数据对象(${target.$name})进行属性[${key as string}]的获取操作！`)
    if (target[key] !== undefined) {
      return target[key]
    } else {
      return undefined
    }
  }
}

// 空数据对象
class EmptyData {
  $name: string
  [prop: PropertyKey]: unknown
  constructor (name = '', data?: Record<PropertyKey, unknown>) {
    this.$name = name
    if (data) {
      for (const n in data) {
        if (this[n] === undefined) {
          this[n] = data[n]
        } else {
          exportMsg(`EmptyData数据存在${n}属性，不能赋值${data[n]}`)
        }
      }
    }
    if (ProxyCanUse) {
      return new Proxy(this, proxyOption)
    } else {
      return this
    }
  }
  toString() {
    return ''
  }
}

export default EmptyData
