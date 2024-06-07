import { isExist, exportMsg, getComplexProp, trimData } from 'complex-utils'
import { ComplexType } from 'complex-utils/src/type/getComplexType'
import DefaultData, { DefaultDataInitOption } from "../data/DefaultData"
import DictionaryData, { DictionaryDataInitOption } from '../module/DictionaryData'
import InterfaceValue, { InterfaceValueInitOption } from './InterfaceValue'
import DefaultMod, { DefaultModInitOption } from '../dictionary/DefaultMod'
import DefaultList, { DefaultListInitOption } from '../dictionary/DefaultList'
import DefaultInfo, { DefaultInfoInitOption } from '../dictionary/DefaultInfo'
import DefaultEdit from '../dictionary/DefaultEdit'
import InputEdit, { InputEditInitOption } from '../dictionary/InputEdit'
import InputNumberEdit, { InputNumberEditInitOption } from '../dictionary/InputNumberEdit'
import TextAreaEdit, { TextAreaEditInitOption } from '../dictionary/TextAreaEdit'
import SelectEdit, { SelectEditInitOption } from '../dictionary/SelectEdit'
import SwitchEdit, { SwitchEditInitOption } from '../dictionary/SwitchEdit'
import DateEdit, { DateEditInitOption } from '../dictionary/DateEdit'
import DateRangeEdit, { DateRangeEditInitOption } from '../dictionary/DateRangeEdit'
import FileEdit, { FileEditInitOption } from '../dictionary/FileEdit'
import ButtonEdit, { ButtonEditInitOption } from '../dictionary/ButtonEdit'
import ButtonGroupEdit, { ButtonGroupEditInitOption } from '../dictionary/ButtonGroupEdit'
import ContentEdit, { ContentEditInitOption } from '../dictionary/ContentEdit'
import CustomEdit, { CustomEditInitOption } from '../dictionary/CustomEdit'
import FormEdit, { FormEditInitOption } from '../dictionary/FormEdit'
import DefaultLoadEdit from '../dictionary/DefaultLoadEdit'
import DefaultSimpleEdit from '../dictionary/DefaultSimpleEdit'
import ObserveList from '../dictionary/ObserveList'
import config from '../../config'
import FormValue from './FormValue'

export type payloadType = {
  targetData: Record<PropertyKey, any>
  originData?: Record<PropertyKey, any>
  type: string
  from?: string
  depth?: number
  index?: number
  choice?: number
  payload?: Record<PropertyKey, any>
}

export type functionType<R> = (data: unknown, payload: payloadType) => R

interface functions {
  assign?: false | functionType<unknown> // 来源=>本地 赋值函数
  parse?: false | functionType<unknown> // 数据=>展示/编辑 解析函数
  collect?: false | functionType<unknown> // 编辑=>来源 获取函数
  check?: false | functionType<boolean> // 数据存在判断函数
}

export type funcKeys = keyof functions

const parse = function (this: DictionaryValue, data: any, { type }: payloadType) {
  const showProp = this.$getInterfaceValue('showProp', type)
  if (showProp) {
    if (data !== undefined && data !== null && typeof data === 'object') {
      return data[showProp]
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

export type DictionaryEditModInitOption = InputEditInitOption | InputNumberEditInitOption | SwitchEditInitOption | TextAreaEditInitOption | SelectEditInitOption | SelectEditInitOption<PropertyKey> | DateEditInitOption | DateRangeEditInitOption | FileEditInitOption | ButtonEditInitOption | ButtonGroupEditInitOption | ContentEditInitOption | CustomEditInitOption | FormEditInitOption

export type DictionaryEditMod = InputEdit | InputNumberEdit | SwitchEdit | TextAreaEdit | SelectEdit | SelectEdit<PropertyKey> | FileEdit | DateEdit | DateRangeEdit | ButtonEdit | ButtonGroupEdit | ContentEdit | CustomEdit | FormEdit

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
    edit?: boolean
  } // 简单快速处理判断值
  complex?: {
    assignProp?: boolean
  }
  originProp?: InterfaceValueInitOption<string> // 来源属性
  label?: InterfaceValueInitOption<string> // 名称
  showProp?: InterfaceValueInitOption<string> // 展示的属性
  type?: InterfaceValueInitOption<ComplexType> // 值类型
  mod?: DictionaryModDataInitOption
  dictionray?: DictionaryDataInitOption | DictionaryData
}

export type interfaceKeys = keyof DictionaryValue['$interface']

class DictionaryValue extends DefaultData implements functions {
  static $name = 'DictionaryValue'
  static _initEditMod = function(editModInitOption: DictionaryEditModInitOption, parent?: DictionaryValue, modName?: string) {
    if (!editModInitOption.type || editModInitOption.type === 'input') {
      return new InputEdit(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'inputNumber') {
      return new InputNumberEdit(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'textArea') {
      return new TextAreaEdit(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'select') {
      return new SelectEdit(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'cascader') {
      return new SelectEdit(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'switch') {
      return new SwitchEdit(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'date') {
      return new DateEdit(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'dateRange') {
      return new DateRangeEdit(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'file') {
      return new FileEdit(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'button') {
      return new ButtonEdit(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'buttonGroup') {
      return new ButtonGroupEdit(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'content') {
      return new ContentEdit(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'custom') {
      return new CustomEdit(editModInitOption, parent, modName)
    } else if (editModInitOption.type === 'form') {
      return new FormEdit(editModInitOption, parent, modName)
    } else {
      exportMsg(`mod初始化错误，不存在${editModInitOption.type}的编辑类型，如需特殊构建请自行生成DefaultMod实例！`)
    }
  }
  static $initEditMod = function(editModInitOption: DictionaryEditMod | DictionaryEditModInitOption, parent?: DictionaryValue, modName?: string) {
    if (editModInitOption instanceof DefaultSimpleEdit) {
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
      return DictionaryValue._initEditMod(modInitOption as DictionaryEditModInitOption, parent, modName)
    } else {
      exportMsg(`mod初始化错误，不存在${$format}的格式化类型，如需特殊构建请自行生成DefaultMod实例！`)
    }
  }
  $originFrom: string[]
  $simple: {
    edit?: boolean
  } // 简单处理判断值
  $complex: {
    assignProp?: boolean
  } // 复杂处理判断值
  $interface: {
    name: InterfaceValue<string>
    originProp?: InterfaceValue<string>
    showProp?: InterfaceValue<string>
    type: InterfaceValue<string>
  }
  assign?: false | functionType<unknown>
  parse?: false | functionType<unknown>
  collect?: false | functionType<unknown>
  check?: false | functionType<boolean>
  $mod: DictionaryModDataType
  dictionary?: DictionaryData
  constructor(initOption: DictionaryValueInitOption, parent?: DictionaryData) {
    super(initOption)
    const $constructor = (this.constructor as typeof DefaultMod)
    if ($constructor.$formatInitOption) {
      initOption = $constructor.$formatInitOption(initOption, parent)
    }
    this._triggerCreateLife('DictionaryValue', false, initOption)
    this.$setParent(parent)
    this.$originFrom = initOption.originFrom === undefined ? ['list'] : typeof initOption.originFrom === 'string' ? [initOption.originFrom] : initOption.originFrom
    this.$simple = initOption.simple || {}
    this.$complex = initOption.complex || {}
    this.$interface = {
      name: new InterfaceValue(initOption.name),
      type: new InterfaceValue(initOption.type ? initOption.type : initOption.showProp ? 'object' : 'string')
    }
    if (initOption.originProp) {
      this.$interface.originProp = new InterfaceValue(initOption.originProp)
    }
    // 加载showProp和基本自定义函数
    if (initOption.showProp) {
      this.$interface.showProp = new InterfaceValue(initOption.showProp)
      this.parse = initOption.parse === undefined ? parse.bind(this) : initOption.parse
    } else if (initOption.parse) {
      this.parse = initOption.parse
    }
    if (!this.$simple.edit) {
      // 非简单编辑数据时
      this.assign = initOption.assign
    } else if (initOption.assign) {
      this.$exportMsg('当前编辑为简单模式,不接受assign函数!')
    }
    this.collect = initOption.collect
    this.check = initOption.check === undefined ? defaultCheck : initOption.check
    this.$mod = {}
    if (initOption.mod) {
      const mod = initOption.mod
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
    }
    if (initOption.dictionray) {
      this.dictionary = initOption.dictionray instanceof DictionaryData ? initOption.dictionray : new DictionaryData(initOption.dictionray)
    }
    this._triggerCreateLife('DictionaryValue', true, initOption)
  }
  $getInterfaceData(target: interfaceKeys) {
    return this.$interface[target]
  }
  $getInterfaceValue(target: interfaceKeys, prop?: string) {
    return this.$interface[target]?.getValue(prop)
  }
  $setInterfaceValue(target: interfaceKeys, prop: string, data: string, useSetData?: boolean) {
    this.$interface[target]?.setValue(prop, data, useSetData)
    this._syncData(true, '$setInterfaceValue')
  }
  $getOriginProp(originFrom: string) {
    return this.$interface.originProp ? this.$interface.originProp.getValue(originFrom)! : this.$prop
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
  // 触发相关的格式化函数
  $triggerFunc (funcName: funcKeys, originData: unknown, payload: payloadType) {
    const itemFunc = this[funcName]
    if (itemFunc) {
      return itemFunc(originData, payload)
    } else {
      return originData
    }
  }
  // 格式化数据
  // 警告：不对原字段进行操作，因为原字段会作为originData对其他字段进行依赖，在complex.assign赋值模式下，原字段也不会做删除处理，保证了2种模式下的取值逻辑相同
  $formatData(targetData: Record<PropertyKey, any>, originFrom: string, useSetData?: boolean) {
    if (this.$isOriginFrom(originFrom)) {
      // 仅存在assign函数或者originProp !== this.$prop需要进行格式化操作
      if (!this.$complex.assignProp) {
        const originProp = this.$getOriginProp(originFrom)
        if (this.assign) {
          config.nonEmptySetProp(targetData, this.$prop, this.$triggerFunc('assign', targetData[originProp], {
            targetData: targetData,
            originData: targetData,
            type: originFrom
          }), useSetData)
        } else if (originProp !== this.$prop) {
          // 不存在赋值函数则在prop不同时重新赋值
          // 不应对原字段进行操作，原因如标题处
          config.nonEmptySetProp(targetData, this.$prop, targetData[originProp], useSetData)
        }
      } else {
        const originProp = this.$getOriginProp(originFrom)
        if (this.assign) {
          config.nonEmptySetComplexProp(targetData, this.$prop, this.$triggerFunc('assign', getComplexProp(targetData, originProp), {
            targetData: targetData,
            originData: targetData,
            type: originFrom
          }), useSetData)
        } else if (originProp !== this.$prop) {
          // 不存在赋值函数则在prop不同时重新赋值
          // 不应对原字段进行操作，原因如标题处
          config.nonEmptySetComplexProp(targetData, this.$prop, targetData[originProp], useSetData)
        }
      }
    }
  }
  // 赋值
  $assignData(targetData: Record<PropertyKey, any>, originData: Record<PropertyKey, any>, originFrom: string, useSetData?: boolean) {
    if (this.$isOriginFrom(originFrom)) {
      const originProp = this.$getOriginProp(originFrom)
      if (!this.$complex.assignProp) {
        let targetValue = originData[originProp]
        if (this.assign) {
          targetValue = this.$triggerFunc('assign', targetValue, {
            targetData: targetData,
            originData: originData,
            type: originFrom
          })
        }
        config.nonEmptySetProp(targetData, this.$prop, targetValue, useSetData)
      } else {
        let targetValue = getComplexProp(originData, originProp)
        if (this.assign) {
          targetValue = this.$triggerFunc('assign', targetValue, {
            targetData: targetData,
            originData: originData,
            type: originFrom
          })
        }
        config.nonEmptySetComplexProp(targetData, this.$prop, targetValue, useSetData)
      }
    }
  }
  modIsEditable(mod?: DictionaryMod): mod is DefaultEdit {
    return !!mod && mod instanceof DefaultEdit && mod.$editable
  }
  modIsCascader(mod: DictionaryMod): mod is FormEdit {
    return !!this.dictionary && mod instanceof FormEdit
  }
  $parseValue (mod: DefaultInfo | DefaultEdit, payload: payloadType) {
    let targetValue
    // 存在源数据则获取属性值并调用主要模块的parse方法格式化，否则通过模块的getValueData方法获取初始值
    if (payload.originData) {
      targetValue = this.$triggerFunc('parse', payload.originData[this.$prop], payload)
    } else if (mod instanceof DefaultEdit) {
      targetValue = mod.getValue(payload.from === 'reset' ? 'reset' : 'default')
    }
    // 模块存在parse函数时将当前数据进行parse操作
    if (mod.parse) {
      targetValue = mod.parse(targetValue, payload)
    }
    return targetValue
  }
  protected _setParseValue(mod: DefaultEdit, payload: payloadType) {
    const targetValue = this.$parseValue(mod, payload)
    if (!this.modIsCascader(mod)) {
      config.nonEmptySetProp(payload.targetData, mod.$prop, targetValue, true)
      return Promise.resolve({ status: 'success' })
    } else {
      return new Promise((resolve, reject) => {
        // 级联表单
        this.dictionary!.parseData(mod.$runtime.dictionaryList!, mod.$runtime.form!, payload.type, targetValue, payload.from).then(res => {
          if (mod.$runtime.observe) {
            mod.$runtime.observeList!.startObserve(mod.$runtime.form!.getData(), mod.$runtime.type)
          }
          config.nonEmptySetProp(payload.targetData, mod.$prop, res.data, true)
          resolve({ status: 'success' })
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
  parseValue (payload: payloadType) {
    return new Promise((resolve, reject) => {
      const mod = this.$getMod(payload.type)
      if (mod && mod instanceof DefaultInfo) {
        // 解析数据解析DefaultInfo或者DefaultEdit.editable = true的数据
        if (this.modIsEditable(mod)) {
          if (mod instanceof DefaultLoadEdit) {
            mod.loadData().finally(() => {
              this._setParseValue(mod, payload).then(res => {
                resolve(res)
              }).catch(err => {
                reject(err)
              })
            })
          } else {
            this._setParseValue(mod, payload).then(res => {
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          }
        } else {
          const targetValue = this.$parseValue(mod, payload)
          config.nonEmptySetProp(payload.targetData, mod.$prop, targetValue, true)
          resolve({ status: 'success', code: 'not edit' })
        }
      } else {
        resolve({ status: 'success' })
      }
    })
  }
  collectValue (payload: payloadType, empty?: undefined | boolean, observeList?: ObserveList) {
    const mod = this.$getMod(payload.type)
    if (this.modIsEditable(mod)) {
      // 收集数据仅限editable模块
      if (observeList && observeList.isFrozen(mod.$prop)) {
        // 冻结的模块不参与最终的生成数据逻辑
        return
      }
      let originValue = payload.originData![mod.$prop]
      if (mod.trim) {
        originValue = trimData(originValue)
      }
      if (this.modIsCascader(mod)) {
        originValue = this.dictionary!.collectData(originValue, mod.$runtime.dictionaryList!, payload.type, mod.$runtime.observeList)
      }
      if (mod.collect) {
        originValue = mod.collect(originValue, payload)
      }
      originValue = this.$triggerFunc('collect', originValue, payload)
      if (!empty && !this.$triggerFunc('check', originValue, payload)) {
        // 空值不上传且值不存在时
        return
      }
      config.nonEmptySetProp(payload.targetData, this.$getOriginProp(payload.type), originValue)
    }
  }
}

export default DictionaryValue
