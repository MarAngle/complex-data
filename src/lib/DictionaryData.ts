import { getType, getProp, setProp, formatNum, isExist } from 'complex-utils'
import SimpleData, { SimpleDataInitOption } from "../data/SimpleData"
import { formatInitOption } from '../utils'
import DictionaryList, { DictionaryListInitOption, formatDataOption } from './DictionaryList'
import InterfaceData, { InterfaceDataInitOption } from './InterfaceData'
import LayoutData, { HasLayoutData, LayoutDataInitOption } from './LayoutData'

type payloadType = { targetData: Record<PropertyKey, unknown>, originData?: Record<PropertyKey, unknown>, type: string, from?: string, depth?: number }

type baseFunction<RES> = (data: unknown, payload: payloadType) => RES

interface customerFunction {
  format?: false | baseFunction<unknown>
  defaultGetData?: false | baseFunction<unknown>
  show?: false | baseFunction<unknown>
  edit?: false | baseFunction<unknown>
  post?: false | baseFunction<unknown>
  check?: false | baseFunction<boolean>
}

export interface parentOptionType {
  layout?: LayoutDataInitOption
}

export type funcKeys = keyof customerFunction

export interface DictionaryDataInitOption extends SimpleDataInitOption, customerFunction {
  prop: string,
  simple?: boolean,
  originProp?: InterfaceDataInitOption<string>
  label?: InterfaceDataInitOption<string>
  type?: InterfaceDataInitOption<string>
  showProp?: InterfaceDataInitOption<string>
  showType?: InterfaceDataInitOption<string>
  originFrom?: string | string[]
  layout?: LayoutDataInitOption
  dictionary?: DictionaryListInitOption
}


type interfaceKeys = keyof DictionaryData['$interface']


const defaultGetData = function (this: DictionaryData, data: unknown, { type }: payloadType) {
  const showProp = this.$getInterface('showProp', type)
  if (showProp) {
    if (data && typeof data == 'object') {
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

class DictionaryData extends SimpleData implements customerFunction, HasLayoutData {
  static $name = 'DictionaryData'
  prop: string
  $originFrom: string[]
  $simple: boolean
  $dictionary?: DictionaryList
  $interface: {
    originProp: InterfaceData<string>
    label: InterfaceData<string>
    type: InterfaceData<string>
    showProp: InterfaceData<string>
    showType: InterfaceData<string>
  }
  $layout!: LayoutData
  format?: false | baseFunction<unknown>
  defaultGetData?: false | baseFunction<unknown>
  show?: false | baseFunction<unknown>
  edit?: false | baseFunction<unknown>
  post?: false | baseFunction<unknown>
  check?: false | baseFunction<boolean>
  constructor(initOption: DictionaryDataInitOption, parentOption: parentOptionType = {}) {
    initOption = formatInitOption(initOption, null, 'DictionaryItem初始化参数不存在！')
    super(initOption)
    this.prop = this.$prop
    // 加载基本自定义函数
    this.format = initOption.format
    this.defaultGetData = initOption.defaultGetData === undefined ? defaultGetData : initOption.defaultGetData
    this.show = initOption.show === undefined ? this.defaultGetData : initOption.show
    this.edit = initOption.edit === undefined ? this.defaultGetData : initOption.edit
    this.post = initOption.post === undefined ? this.defaultGetData : initOption.post
    this.check = initOption.check === undefined ? defaultCheck : initOption.check
    // 加载来源
    switch (typeof initOption.originFrom) {
      case 'object':
        this.$originFrom = initOption.originFrom
        break;
      case 'string':
        this.$originFrom = [initOption.originFrom]
        break;
      default:
        this.$originFrom = ['list']
        break;
    }
    // 加载接口数据
    this.$interface = {
      label: new InterfaceData(initOption.label === undefined ? this.$name : initOption.label),
      showProp: new InterfaceData(initOption.showProp),
      type: new InterfaceData(initOption.type ? initOption.type : initOption.showProp ? 'object' : 'string'),
      showType: new InterfaceData(initOption.showType),
      originProp: new InterfaceData(initOption.originProp || this.prop),
    }
    this.$setLayout(initOption.layout || parentOption.layout)
    this.$simple = initOption.simple === undefined ? false : initOption.simple
    // if (!this.format) {
    //   this.$simple = initOption.simple === undefined ? true : initOption.simple
    // } else {
    //   this.$simple = false
    // }
    // this.$mod = {}
  }
  $getInterfaceData(target: interfaceKeys) {
    return this.$interface[target]
  }
  $getInterface(target: interfaceKeys, prop?: string) {
    return this.$interface[target].getData(prop)
  }
  $setInterface(target: interfaceKeys, prop: string, data: string, useSetData?: boolean) {
    this.$interface[target].setData(prop, data, useSetData)
  }
  $setLayout(data?: LayoutDataInitOption) {
    this.$layout = new LayoutData(data)
  }
  $getLayout(prop?: string) {
    return this.$layout.getData(prop)
  }
  $getLayoutData() {
    return this.$layout
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
  $formatDataBySimple(targetData: Record<PropertyKey, any>, originData: Record<PropertyKey, any>, originFrom: string, option: formatDataOption) {
    const originProp = this.$getInterface('originProp', originFrom)!
    // 快捷模式快速判断
    if (!option.format || this.prop != originProp) {
      setProp(targetData, this.prop, getProp(originData, originProp), true)
    }
    // 非新建模式下，prop不更名则不进行任何操作
  }
  $formatDataByDictionary(targetData: Record<PropertyKey, any>, originData: Record<PropertyKey, any>, originFrom: string, option: formatDataOption, depth: number) {
    depth++
    const originProp = this.$getInterface('originProp', originFrom)!
    const type = this.$getInterface('type', originFrom)!
    const originValue = getProp(originData, originProp)
    let targetValue
    if (type != 'array') {
      if (getType(originValue) == 'object') {
        if (!option.format) {
          // 新增模式
          targetValue = this.$dictionary!.createData(originValue, originFrom, option, depth)
        } else {
          targetData = this.$dictionary!.formatData(originValue, originValue, originFrom, option, depth)
        }
      } else {
        targetValue = {}
      }
    } else {
      if (getType(originValue) == 'array') {
        targetValue = this.$dictionary!.formatListData(targetData[this.prop], originValue, originFrom, option, depth)
      } else {
        targetValue = []
      }
    }
    return targetValue
  }
  $formatData(targetData: Record<PropertyKey, any>, originData: Record<PropertyKey, any>, originFrom: string, option: formatDataOption, depth: number) {
    if (this.$isOriginFrom(originFrom)) {
      if (!this.format && !this.$dictionary) {
        // 快捷模式快速判断
        this.$formatDataBySimple(targetData, originData, originFrom, option)
        return
      }
      let targetValue
      if (this.$dictionary) {
        targetValue = this.$formatDataByDictionary(targetData, originData, originFrom, option, depth)
      }
      targetValue = this.$triggerFunc('format', targetValue, {
        targetData: targetData,
        originData: originData,
        depth: depth,
        type: originFrom
      })
      setProp(targetData, this.prop, targetValue, true)
    }
  }
}

export default DictionaryData
