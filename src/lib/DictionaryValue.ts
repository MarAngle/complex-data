import { getProp, setProp, isExist, exportMsg } from 'complex-utils'
import DefaultData, { DefaultDataInitOption } from "../data/DefaultData"
import DictionaryData from '../module/DictionaryData'
import InterfaceValue, { InterfaceValueInitOption } from './InterfaceValue'
import InterfaceLayoutValue, { InterfaceLayoutValueInitOption } from './InterfaceLayoutValue'
import DefaultMod, { DefaultModInitOption } from '../dictionary/DefaultMod'
import DefaultList, { DefaultListInitOption } from '../dictionary/DefaultList'
import DefaultInfo, { DefaultInfoInitOption } from '../dictionary/DefaultInfo'
import DefaultEdit from '../dictionary/DefaultEdit'
import DefaultEditInput, { DefaultEditInputInitOption } from '../dictionary/DefaultEditInput'
import DefaultEditInputNumber, { DefaultEditInputNumberInitOption } from '../dictionary/DefaultEditInputNumber'
import DefaultEditTextArea, { DefaultEditTextAreaInitOption } from '../dictionary/DefaultEditTextArea'
import DefaultEditSelect, { DefaultEditSelectInitOption } from '../dictionary/DefaultEditSelect'
import DefaultEditSwitch, { DefaultEditSwitchInitOption } from '../dictionary/DefaultEditSwitch'
import DefaultEditCascader, { DefaultEditCascaderInitOption } from '../dictionary/DefaultEditCascader'
import DefaultEditDate, { DefaultEditDateInitOption } from '../dictionary/DefaultEditDate'
import DefaultEditDateRange, { DefaultEditDateRangeInitOption } from '../dictionary/DefaultEditDateRange'
import DefaultEditFile, { DefaultEditFileInitOption } from '../dictionary/DefaultEditFile'
import DefaultEditButton, { DefaultEditButtonInitOption } from '../dictionary/DefaultEditButton'
import DefaultEditButtonGroup, { DefaultEditButtonGroupInitOption } from '../dictionary/DefaultEditButtonGroup'
import DefaultEditContent, { DefaultEditContentInitOption } from '../dictionary/DefaultEditContent'
import DefaultEditCustom, { DefaultEditCustomInitOption } from '../dictionary/DefaultEditCustom'
import DefaultLoadEdit from '../dictionary/DefaultLoadEdit'

export type payloadType = {
  targetData: Record<PropertyKey, unknown>
  originData?: Record<PropertyKey, unknown>
  type: string
  from?: string
  depth?: number
  index?: number
  choice?: number
  payload?: Record<PropertyKey, unknown>
}

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
      return getProp(data as Record<PropertyKey, unknown>, showProp)
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

export type DictionaryEditModInitOption = DefaultEditInputInitOption | DefaultEditInputNumberInitOption | DefaultEditSwitchInitOption | DefaultEditTextAreaInitOption | DefaultEditSelectInitOption | DefaultEditCascaderInitOption | DefaultEditDateInitOption | DefaultEditDateRangeInitOption | DefaultEditFileInitOption | DefaultEditButtonInitOption | DefaultEditButtonGroupInitOption | DefaultEditContentInitOption | DefaultEditCustomInitOption

export type DictionaryEditMod = DefaultEditInput | DefaultEditInputNumber | DefaultEditSwitch | DefaultEditTextArea | DefaultEditSelect | DefaultEditCascader | DefaultEditFile | DefaultEditDate | DefaultEditDateRange | DefaultEditButton | DefaultEditButtonGroup | DefaultEditContent | DefaultEditCustom

export type DictionaryModInitOption = DefaultListInitOption | DefaultInfoInitOption | DictionaryEditModInitOption | DefaultModInitOption

export type DictionaryMod = DefaultList | DefaultInfo | DictionaryEditMod | DefaultMod

export type DictionaryModDataInitOption = {
  list?: false | DefaultListInitOption
  info?: false | DefaultInfoInitOption
  edit?: false | DictionaryEditModInitOption
  build?: false | DictionaryEditModInitOption
  change?: false | DictionaryEditModInitOption
  search?: false | DictionaryEditModInitOption
  [prop: string]: undefined | false | DictionaryModInitOption | DefaultMod
}

export type DictionaryModDataType = {
  list?: DefaultList
  info?: DefaultInfo
  edit?: DictionaryEditMod
  build?: DictionaryEditMod
  change?: DictionaryEditMod
  search?: DictionaryEditMod
  [prop: string]: undefined | DictionaryMod
}

export interface DictionaryValueInitOption extends DefaultDataInitOption, functions {
  prop: string
  name: InterfaceValueInitOption<string>
  originFrom?: string | string[]
  simple?: {
    format?: boolean
    edit?: boolean
  } // 简单快速处理判断值
  originProp?: InterfaceValueInitOption<string> // 来源属性
  label?: InterfaceValueInitOption<string> // 名称
  showProp?: InterfaceValueInitOption<string> // 展示的属性
  type?: InterfaceValueInitOption<string> // 值类型
  showType?: InterfaceValueInitOption<string> // 展示的类型
  layout?: InterfaceLayoutValueInitOption
  mod?: DictionaryModDataInitOption
}

export type interfaceKeys = keyof DictionaryValue['$interface']

class DictionaryValue extends DefaultData implements functions {
  static $name = 'DictionaryValue'
  static _initEditMod = function(editModInitOption: DictionaryEditModInitOption, parent?: DictionaryValue, modName?: string) {
    if (!editModInitOption.type || editModInitOption.type === 'input') {
      return new DefaultEditInput(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'inputNumber') {
      return new DefaultEditInputNumber(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'textArea') {
      return new DefaultEditTextArea(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'select') {
      return new DefaultEditSelect(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'switch') {
      return new DefaultEditSwitch(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'cascader') {
      return new DefaultEditCascader(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'date') {
      return new DefaultEditDate(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'dateRange') {
      return new DefaultEditDateRange(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'file') {
      return new DefaultEditFile(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'button') {
      return new DefaultEditButton(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'buttonGroup') {
      return new DefaultEditButtonGroup(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'content') {
      return new DefaultEditContent(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'custom' || editModInitOption.type === 'slot') {
      return new DefaultEditCustom(editModInitOption, parent, modName)
    } else {
      exportMsg(`mod初始化错误，不存在${editModInitOption.type}的编辑类型，如需特殊构建请自行生成DefaultMod实例！`)
    }
  }
  static $initEditMod = function(editModInitOption: DictionaryEditMod | DictionaryEditModInitOption, parent?: DictionaryValue, modName?: string) {
    if (editModInitOption instanceof DefaultEdit) {
      return editModInitOption
    } else {
      return DictionaryValue._initEditMod(editModInitOption, parent, modName)
    }
  }
  static $initMod = function(modInitOption: DictionaryModInitOption | DefaultMod, parent?: DictionaryValue, modName?: string) {
    if (modInitOption instanceof DefaultMod) {
      return modInitOption
    }
    const $format = modInitOption.$format || modName
    if ($format === 'list') {
      return new DefaultList(modInitOption as DefaultListInitOption, parent, modName)
    } else if ($format === 'info') {
      return new DefaultInfo(modInitOption as DefaultInfoInitOption, parent, modName)
    } else if ($format === 'edit' || $format === 'build' || $format === 'change' || $format === 'search') {
      const editModInitOption = modInitOption as DictionaryEditModInitOption
      return DictionaryValue._initEditMod(editModInitOption, parent, modName)
    } else {
      exportMsg(`mod初始化错误，不存在${$format}的格式化类型，如需特殊构建请自行生成DefaultMod实例！`)
    }
  }
  $originFrom: string[]
  $simple: {
    format?: boolean
    edit?: boolean
  } // 简单快速处理判断值
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
  $layout?: InterfaceLayoutValue
  $mod: DictionaryModDataType
  constructor(initOption: DictionaryValueInitOption, parent?: DictionaryData) {
    super(initOption)
    this._triggerCreateLife('DictionaryValue', false, initOption)
    this.$setParent(parent)
    this.$originFrom = typeof initOption.originFrom === 'string' ? [initOption.originFrom] : ['list']
    this.$simple = initOption.simple || {}
    this.$interface = {
      name: new InterfaceValue(initOption.name),
      originProp: new InterfaceValue(initOption.originProp || this.$prop),
      showProp: new InterfaceValue(initOption.showProp),
      type: new InterfaceValue(initOption.type ? initOption.type : initOption.showProp ? 'object' : 'string'),
      showType: new InterfaceValue(initOption.showType),
      modType: new InterfaceValue()
    }
    // 加载基本自定义函数
    this.defaultGetData = initOption.defaultGetData === undefined ? defaultGetData.bind(this) : initOption.defaultGetData
    if (!this.$simple.edit) {
      // 非简单编辑数据时
      this.format = initOption.format
      this.show = initOption.show === undefined ? this.defaultGetData : initOption.show
    } else if (initOption.format) {
      this.$exportMsg('当前编辑为简单模式,不接受format函数!')
    }
    this.edit = initOption.edit === undefined ? this.defaultGetData : initOption.edit
    this.post = initOption.post
    this.check = initOption.check === undefined ? defaultCheck : initOption.check
    if (initOption.layout) {
      this.$layout = new InterfaceLayoutValue(initOption.layout)
    }
    this.$mod = {}
    const mod = initOption.mod || {}
    const redirect: Record<string, string> = {}
    for (const modName in mod) {
      const modInitOption = mod[modName]
      if (modInitOption) {
        if ((modInitOption as DictionaryModInitOption).$redirect) {
          redirect[modName] = (modInitOption as DictionaryModInitOption).$redirect!
        } else {
          this.$mod[modName] = DictionaryValue.$initMod(modInitOption, this, modName)
        }
      }
    }
    for (const modName in redirect) {
      this.$mod[modName] = this.$mod[redirect[modName]]
    }
    this._triggerCreateLife('DictionaryValue', true, initOption)
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
  $getMod (modName: string) {
    return this.$mod[modName]
  }
  $triggerFunc (funcName: funcKeys, originData: unknown, payload: payloadType) {
    const itemFunc = this[funcName]
    if (itemFunc) {
      return itemFunc(originData, payload)
    } else {
      return originData
    }
  }
  $setTargetData(prop: string, originValue: unknown, funcName: funcKeys, option: payloadType, useSetData?: boolean ) {
    const targetValue = this.$triggerFunc(funcName, originValue, option)
    setProp(option.targetData, prop, targetValue, useSetData)
  }
  $formatData(targetData: Record<PropertyKey, unknown>, originData: Record<PropertyKey, unknown>, originFrom: string, useSetData?: boolean) {
    if (this.$isOriginFrom(originFrom)) {
      const originProp = this.$getInterfaceValue('originProp', originFrom)!
      const targetValue = getProp(originData, originProp)
      if (!this.format) {
        setProp(targetData, this.$prop, targetValue, useSetData)
      } else {
        this.$setTargetData(this.$prop, targetValue, 'format', {
          targetData: targetData,
          originData: originData,
          type: originFrom
        }, useSetData)
      }
    }
  }
  $setEditValue (mod: DefaultEdit, { targetData, originData, type, from = 'init' }: payloadType) {
    let targetValue
    // 存在源数据则获取属性值并调用主要模块的edit方法格式化，否则通过模块的getValueData方法获取初始值
    if (originData) {
      targetValue = this.$triggerFunc('edit', originData[this.$prop], {
        type: type,
        targetData,
        originData,
        from: from
      })
    } else if (mod.getValue) {
      targetValue = mod.getValue(from === 'reset' ? 'reset' : 'init')
    }
    // 模块存在edit函数时将当前数据进行edit操作
    if (mod.edit) {
      targetValue = mod.edit(targetValue, {
        type: type,
        targetData,
        originData,
        from: from
      })
    }
    return targetValue
  }
  $createEditValue (option: payloadType) {
    return new Promise((resolve) => {
      const mod = this.$getMod(option.type)
      const next = (targetValue: unknown, code: string, unSet?: boolean) => {
        if (!unSet) {
          setProp(option.targetData, this.$prop, targetValue, true)
        }
        resolve({ status: !code ? 'success' : code, code: code })
      }
      if (mod) {
        if (mod instanceof DefaultEdit) {
          if (mod.$editable) {
            if (mod instanceof DefaultLoadEdit) {
              mod.loadData().finally(() => {
                next(this.$setEditValue(mod, option), '')
              })
            } else {
              next(this.$setEditValue(mod, option), '')
            }
          } else {
            next(undefined, 'not editable', true)
          }
        } else {
          next(undefined, 'not edit', true)
        }
      } else {
        next(undefined, 'not exist', true)
      }
    })
  }
}

export default DictionaryValue
