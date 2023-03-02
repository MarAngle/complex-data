import { getType, getProp, setProp, formatNum, isExist } from 'complex-utils'
import SimpleData, { SimpleDataInitOption } from "../data/SimpleData"
import { formatInitOption } from '../utils'
import DictionaryList, { DictionaryListInitOption } from './DictionaryList'
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

export interface DictionaryDataInitOption extends SimpleDataInitOption, customerFunction {
  prop: string,
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
  originFrom: string[]
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
        this.originFrom = initOption.originFrom
        break;
      case 'string':
        this.originFrom = [initOption.originFrom]
        break;
      default:
        this.originFrom = ['list']
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
}

export default DictionaryData
