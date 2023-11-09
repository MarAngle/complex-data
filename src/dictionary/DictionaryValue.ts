import { getProp, setProp, isExist } from 'complex-utils-next'
import DefaultData, { DefaultDataInitOption } from "../data/DefaultData"
import InterfaceValue, { InterfaceValueInitOption } from '../lib/InterfaceValue'
import DefaultList, { DefaultListInitOption } from './DefaultList'
import DefaultInfo, { DefaultInfoInitOption } from './DefaultInfo'
import DefaultEditInput, { DefaultEditInputInitOption } from './DefaultEditInput'
import DefaultEditInputNumber, { DefaultEditInputNumberInitOption } from './DefaultEditInputNumber'
import DefaultEditTextArea, { DefaultEditTextAreaInitOption } from './DefaultEditTextArea'
import DefaultEditSelect, { DefaultEditSelectInitOption } from './DefaultEditSelect'
import DefaultEditSwitch, { DefaultEditSwitchInitOption } from './DefaultEditSwitch'
import DefaultEditCascader, { DefaultEditCascaderInitOption } from './DefaultEditCascader'
import DefaultEditFile, { DefaultEditFileInitOption } from './DefaultEditFile'
import DefaultEditButton, { DefaultEditButtonInitOption } from './DefaultEditButton'
import DefaultEditText, { DefaultEditTextInitOption } from './DefaultEditText'
import DefaultEditCustom, { DefaultEditCustomInitOption } from './DefaultEditCustom'
import DefaultMod, { DefaultModInitOption } from './DefaultMod'
import DictionaryData from '../module/DictionaryData'

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

export type DictionanyEditModInitOption = DefaultEditInputInitOption | DefaultEditInputNumberInitOption | DefaultEditSwitchInitOption | DefaultEditTextAreaInitOption | DefaultEditSelectInitOption | DefaultEditCascaderInitOption | DefaultEditFileInitOption | DefaultEditButtonInitOption | DefaultEditTextInitOption | DefaultEditCustomInitOption

export type DictionanyEditMod = DefaultEditInput | DefaultEditInputNumber | DefaultEditSwitch | DefaultEditTextArea | DefaultEditSelect | DefaultEditCascader | DefaultEditFile | DefaultEditButton | DefaultEditText | DefaultEditCustom

export type DictionanyModInitOption = DefaultListInitOption | DefaultInfoInitOption | DictionanyEditModInitOption | DefaultModInitOption

export type DictionanyMod = DefaultList | DefaultInfo | DictionanyEditMod | DefaultMod

export type DictionanyModDataInitOption = {
  list?: false | DefaultListInitOption
  info?: false | DefaultInfoInitOption
  edit?: false | DictionanyEditModInitOption
  build?: false | DictionanyEditModInitOption
  change?: false | DictionanyEditModInitOption
  search?: false | DictionanyEditModInitOption
  [prop: string]: undefined | false | DictionanyModInitOption | DefaultMod
}

export type DictionanyModDataType = {
  list?: DefaultList
  info?: DefaultInfo
  edit?: DictionanyEditMod
  build?: DictionanyEditMod
  change?: DictionanyEditMod
  search?: DictionanyEditMod
  [prop: string]: undefined | DictionanyMod
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
  mod?: DictionanyModDataInitOption
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
  mod: DictionanyModDataType
  constructor(initOption: DictionaryValueInitOption, parent?: DictionaryData) {
    super(initOption)
    this._triggerCreateLife('DictionaryValue', 'beforeCreate', initOption)
    this.$setParent(parent)
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
    this.mod = {}
    const mod = initOption.mod || {}
    for (const modName in mod) {
      const modInitOption = mod[modName]
      if (modInitOption) {
        this.mod[modName] = this._buildMod(modName, modInitOption)
      }
    }
    this._triggerCreateLife('DictionaryValue', 'created', initOption)
  }
  protected _buildMod(modName: string, modInitOption: DictionanyModInitOption | DefaultMod) {
    if (modInitOption instanceof DefaultMod) {
      return modInitOption
    }
    const $format = modInitOption.$format || modName
    if ($format === 'list') {
      return new DefaultList(modInitOption as DefaultListInitOption)
    } else if ($format === 'info') {
      return new DefaultInfo(modInitOption as DefaultInfoInitOption)
    } else if ($format === 'edit' || modName === 'build' || modName === 'change') {
      const editModInitOption = modInitOption as DictionanyEditModInitOption
      if (!editModInitOption.type || editModInitOption.type === 'input') {
        return new DefaultEditInput(editModInitOption)
      } else if (editModInitOption.type === 'inputNumber') {
        return new DefaultEditInputNumber(editModInitOption)
      } else if (editModInitOption.type === 'textArea') {
        return new DefaultEditTextArea(editModInitOption)
      } else if (editModInitOption.type === 'select') {
        return new DefaultEditSelect(editModInitOption)
      } else if (editModInitOption.type === 'switch') {
        return new DefaultEditSwitch(editModInitOption)
      } else if (editModInitOption.type === 'cascader') {
        return new DefaultEditCascader(editModInitOption)
      } else if (editModInitOption.type === 'file') {
        return new DefaultEditFile(editModInitOption)
      } else if (editModInitOption.type === 'button') {
        return new DefaultEditButton(editModInitOption)
      } else if (editModInitOption.type === 'text') {
        return new DefaultEditText(editModInitOption)
      } else if (editModInitOption.type === 'custom' || editModInitOption.type === 'slot') {
        return new DefaultEditCustom(editModInitOption)
      } else {
        this.$exportMsg(`mod初始化错误，不存在${editModInitOption.type}的编辑类型，如需特殊构建请自行生成DefaultMod实例！`)
      }
    } else {
      this.$exportMsg(`mod初始化错误，不存在${$format}的格式化类型，如需特殊构建请自行生成DefaultMod实例！`)
    }
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
