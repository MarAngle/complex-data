import { getType, getProp, setProp, isExist } from 'complex-utils-next'
import DefaultData, { DefaultDataInitOption } from "../data/DefaultData"
import InterfaceValue, { InterfaceValueInitOption } from '../lib/InterfaceValue'

export type payloadType = { targetData: Record<PropertyKey, unknown>, originData?: Record<PropertyKey, unknown>, type: string, from?: string, depth?: number, index?: number, payload?: Record<PropertyKey, unknown> }

export type functionType<R> = (data: unknown, payload: payloadType) => R

interface functions {
  format?: false | functionType<unknown> // 来源=>本地 格式化函数
  defaultGetData?: false | functionType<unknown> // 默认获取数据的函数
  show?: false | functionType<unknown> // 数据=>展示 格式化
  edit?: false | functionType<unknown> // 数据=>编辑 格式化
  post?: false | functionType<unknown> // 编辑=>来源 格式化
  check?: false | functionType<boolean> // 数据存在判断函数
}

export type funcKeys = keyof functions

const defaultGetData = function (this: DictionaryValue, data: unknown, { type }: payloadType) {
  const showProp = this.$getInterfaceValue('showProp', type)
  if (showProp) {
    if (data !== undefined && typeof data === 'object' && data !== null) {
      return getProp(data, showProp)
    } else {
      return undefined
    }
  } else {
    return data
  }
}
const defaultCheck = function (data: unknown) {
  return isExist(data)
}

export interface formatDataOption {
  format?: boolean
  depth?: boolean
}

export interface DictionaryValueInitOption extends DefaultDataInitOption, functions {
  prop: string
  name: InterfaceValueInitOption<string>
  originFrom?: string | string[]
  simple?: boolean // 简单快速处理判断值
  originProp?: InterfaceValueInitOption<string> // 来源属性
  label?: InterfaceValueInitOption<string> // 名称
  showProp?: InterfaceValueInitOption<string> // 展示的属性
  type?: InterfaceValueInitOption<string> // 值类型
  showType?: InterfaceValueInitOption<string> // 展示的类型
}

export type interfaceKeys = keyof DictionaryValue['$interface']

class DictionaryValue extends DefaultData implements functions {
  static $name = 'DictionaryValue'
  $originFrom: string[]
  $simple: boolean
  $interface: {
    name: InterfaceValue<string>
    originProp: InterfaceValue<string>
    showProp: InterfaceValue<string>
    type: InterfaceValue<string>
    showType: InterfaceValue<string>
    modType: InterfaceValue<string>
  }
  format?: false | functionType<unknown>
  defaultGetData?: false | functionType<unknown>
  show?: false | functionType<unknown>
  edit?: false | functionType<unknown>
  post?: false | functionType<unknown>
  check?: false | functionType<boolean>
  constructor(initOption: DictionaryValueInitOption) {
    super(initOption)
    this._triggerCreateLife('DictionaryValue', 'beforeCreate', initOption)
    this.$originFrom = typeof initOption.originFrom === 'string' ? [initOption.originFrom] : ['list']
    this.$simple = initOption.simple === undefined ? false : initOption.simple
    this.$interface = {
      name: new InterfaceValue(initOption.name),
      originProp: new InterfaceValue(initOption.originProp || this.$prop),
      showProp: new InterfaceValue(initOption.showProp),
      type: new InterfaceValue(initOption.type ? initOption.type : initOption.showProp ? 'object' : 'string'),
      showType: new InterfaceValue(initOption.showType),
      modType: new InterfaceValue()
    }
    // 加载基本自定义函数
    this.format = initOption.format
    this.defaultGetData = initOption.defaultGetData === undefined ? defaultGetData.bind(this) : initOption.defaultGetData
    this.show = initOption.show === undefined ? this.defaultGetData : initOption.show
    this.edit = initOption.edit === undefined ? this.defaultGetData : initOption.edit
    this.post = initOption.post
    this.check = initOption.check === undefined ? defaultCheck : initOption.check

    this._triggerCreateLife('DictionaryValue', 'created', initOption)
  }
  $getInterfaceData(target: interfaceKeys) {
    return this.$interface[target]
  }
  $getInterfaceValue(target: interfaceKeys, prop?: string) {
    return this.$interface[target].getValue(prop)
  }
  $setInterfaceValue(target: interfaceKeys, prop: string, data: string, useSetData?: boolean) {
    this.$interface[target].setValue(prop, data, useSetData)
    this.$syncData(true, '$setInterfaceValue')
  }
  /**
   * 判断是否存在来源
   * @param {string} originFrom 来源
   * @returns {boolean}
   */
  $isOriginFrom (originFrom: string) {
    return this.$originFrom.indexOf(originFrom) > -1
  }
  $triggerFunc (funcName: funcKeys, originData: unknown, payload: payloadType) {
    const itemFunc = this[funcName]
    if (itemFunc) {
      return itemFunc(originData, payload)
    } else {
      return originData
    }
  }
  $formatDataBySimple(targetData: Record<PropertyKey, unknown>, originData: Record<PropertyKey, unknown>, originFrom: string, option: formatDataOption) {
    const originProp = this.$getInterfaceValue('originProp', originFrom)!
    // 快捷模式快速判断
    if (!option.format || this.$prop !== originProp) {
      setProp(targetData, this.$prop, getProp(originData, originProp), true)
    }
    // 非新建模式下，prop不更名则不进行任何操作
  }
}

export default DictionaryValue
