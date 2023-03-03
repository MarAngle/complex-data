import { getCanUse, exportMsg } from 'complex-utils'

const ProxyCanUse = getCanUse('Proxy')

const createErrorMsg = function(name: string, key: PropertyKey, msg: string) {
  exportMsg(`[EmptyData:${name}.${key as string}]空对象运行警告: ${msg}`)
}

const createErrorFunction = function(name: string, key: PropertyKey) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ErrorFunction = function(...args: any[]) {
    createErrorMsg(name, key, '正在进行函数运行操作！')
  }

  ErrorFunction.toString = function() {
    createErrorMsg(name, key, '正在进行字符串相关操作！')
  }
  return ErrorFunction
}

const proxyOption = {
  get: function (target: EmptyData, key: PropertyKey) {
    if (target[key] !== undefined) {
      createErrorMsg(target.$name, key, '正在进行非空属性获取操作！')
      return target[key]
    } else {
      return createErrorFunction(target.$name, key)
    }
  },
  set: function (target: EmptyData, key: PropertyKey, data: any) {
    createErrorMsg(target.$name, key, `正在进行属性赋值(${data})操作！`)
    return false
  }
}

// 空数据对象
class EmptyData {
  $name: string
  [prop: PropertyKey]: unknown
  constructor(name = '', data?: Record<PropertyKey, unknown>) {
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
