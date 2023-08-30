/* eslint-disable @typescript-eslint/no-explicit-any */
import { getType } from 'complex-utils'
import Data from './Data'
import DefaultData from './DefaultData'
import { formatInitOption } from '../utils'

export interface SimpleDataInitOption<P extends undefined | DefaultData<any> = undefined> {
  name?: string,
  prop?: string,
  parent?: P,
  extra?: Record<PropertyKey, any>
}

class SimpleData<P extends undefined | DefaultData<any> = undefined> extends Data<P> {
  static $name = 'SimpleData'
  $name: string
  $prop: string
  $extra: Record<PropertyKey, any>
  constructor(initOption: SimpleDataInitOption<P>) {
    initOption = formatInitOption(initOption)
    super()
    this.$name = initOption.name || ''
    this.$prop = initOption.prop || ''
    this.$setParent(initOption.parent)
    if (getType(initOption.extra) === 'object') {
      this.$extra = initOption.extra!
    } else {
      this.$extra = {}
      if (initOption.extra !== undefined) {
        this.$exportMsg(`初始化extra出错，数据必须为对象！`)
      }
    }
  }
  /**
   * 设置额外数据
   * @param {string} prop 属性
   * @param {*} data 数据
   */
  $setExtra(prop: string, data: any) {
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
  $selfName(): string {
    let parentName = ''
    const parent = this.$getParent()
    if (parent && parent.$selfName) {
      parentName += `{PARENT:${parent.$selfName()}}-`
    }
    return `${parentName}[${super.$selfName()}-(${this.$name}/${this.$prop})]`
  }
}

export default SimpleData
