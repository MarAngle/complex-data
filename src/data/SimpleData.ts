import { getType } from 'complex-utils'
import Data from './Data'
import { formatInitOption } from '../utils'

export interface SimpleDataInitOption {
  name?: string,
  prop?: string,
  parent?: Data,
  extra?: Record<PropertyKey, any>
}

class SimpleData extends Data {
  static $name = 'SimpleData'
	$parent?: Data
	$name: string
	$prop: string
	$extra!: Record<PropertyKey, any>
  constructor (initOption: SimpleDataInitOption) {
    initOption = formatInitOption(initOption)
    super()
    this.$name = initOption.name || ''
    this.$prop = initOption.prop || ''
    this.$setParent(initOption.parent)
    if (getType(initOption.extra) == 'object') {
      this.$extra = initOption.extra!
    } else if (initOption.extra !== undefined) {
      this.$exportMsg(`初始化extra出错，数据必须为对象！`)
    }
  }
  /**
   * 设置父数据,需要设置为不可枚举避免循环递归：主要针对微信小程序环境
   * @param {object} parent 父数据
   */
  $setParent (parent?: Data) {
    Object.defineProperty(this, '$parent', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: parent
    })
  }
  /**
   * 获取父数据
   * @returns {object | undefined}
   */
  $getParent(): Data | undefined {
    return this.$parent
  }
  /**
   * 设置额外数据
   * @param {string} prop 属性
   * @param {*} data 数据
   */
  $setExtra (prop: string, data: any) {
    this.$extra[prop] = data
  }
  /**
   * 获取额外数据
   * @param {string} prop 属性
   * @returns {*}
   */
  $getExtra (prop:string){
    return this.$extra[prop]
  }
  /**
   * 获取额外数据
   * @param {string} prop 属性
   * @returns {*}
   */
  $clearExtra (prop?:string) {
    if (!prop) {
      this.$extra = {}
    } else {
      delete this.$extra[prop]
    }
  }
  /**
   * 重置额外数据，清除全部数据
   */
  $resetExtra () {
    this.$clearExtra()
  }
  $selfName (): string {
    let parentName = ''
    const parent = this.$getParent()
    if (parent && parent.$selfName) {
      parentName += `{PARENT:${parent.$selfName()}}-`
    }
    return `${parentName}[${super.$selfName()}-(${this.$name}/${this.$prop})]`
  }
}

export default SimpleData
