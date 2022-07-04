import _func from 'complex-func'
import { objectUnknown } from '../../ts'

const ProxyCanUse = _func.getCanUse('Proxy')
const proxyOption = {
  get: function(target: objectUnknown, key: PropertyKey) {
    _func.exportMsg(`非预期操作提醒: 正在对空数据对象(${target.$name})进行属性[${key as string}]的获取操作！`)
    if (target[key]) {
      return target[key]
    } else {
      return null
    }
  }
}

// 空数据对象
class EmptyData {
  $name: string
  [prop: PropertyKey]: unknown
  constructor (name = '', data?: objectUnknown) {
    this.$name = name
    if (data) {
      for (const n in data) {
        if (this[n] === undefined) {
          this[n] = data[n]
        } else {
          _func.exportMsg(`EmptyData数据存在${n}属性，不能赋值${data[n]}`)
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
