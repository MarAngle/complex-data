import $func from 'complex-func'
import { formatInitOption } from '../utils'
import modOption from '../../modOption'
import SimpleData, { SimpleDataInitOption } from '../data/SimpleData'
import InterfaceData from './InterfaceData'
import LayoutData, { LayoutDataFormatData, LayoutDataInitOption } from './LayoutData'
import { baseObject, objectUnknown } from '../../ts'


export interface DictionaryItemInitOption extends SimpleDataInitOption {
  label?: string | baseObject<string>
  type?: string | baseObject<string>
  showProp?: string | baseObject<string>
  showType?: string | baseObject<string>
  originProp?: string | baseObject<string>
  originFrom?: string | string[],
  layout?: LayoutData | LayoutDataInitOption
}

export interface DictionaryItemPayload {
  layout?: LayoutData | LayoutDataInitOption
}

export type interfaceKeys = 'label' | 'type' | 'showProp' | 'showType' | 'originProp' | 'modType'


class DictionaryItem extends SimpleData {
  prop: string
  originFrom: string[]
  $interface: {
    label: InterfaceData<string>
    type: InterfaceData<string>
    showProp: InterfaceData<string>
    showType: InterfaceData<string>
    originProp: InterfaceData<string>
    modType: InterfaceData<string>
    // [prop: string]: InterfaceData<unknown>
  }
  $layout!: LayoutData
  $mod: {
    [prop: string]: objectUnknown
  }
  constructor (initOption: DictionaryItemInitOption, payload: DictionaryItemPayload = {}) {
    initOption = formatInitOption(initOption, null, 'DictionaryItem初始化参数不存在！')
    super(initOption)
    const originFromType = $func.getType(initOption.originFrom)
    if (originFromType === 'array') {
      this.originFrom = initOption.originFrom as string[]
    } else if (initOption.originFrom && originFromType === 'string') {
      this.originFrom = [initOption.originFrom as string]
    } else {
      this.originFrom = ['list']
    }
    // 加载接口数据
    // 数据格式判断，暂时判断为存在showProp则自动设置为object，暂时不考虑存在showProp{ prop: '' }情况下对应prop的情况
    let type = initOption.type
    if (!type && initOption.showProp) {
      type = 'object'
    }
    this.$interface = {
      label: new InterfaceData(initOption.label === undefined ? this.$name : initOption.label),
      showProp: new InterfaceData(initOption.showProp),
      type: new InterfaceData(type || 'string'),
      showType: new InterfaceData(initOption.showType),
      // prop/originProp
      originProp: new InterfaceData(initOption.originProp || this.$prop),
      modType: new InterfaceData('list')
    }
    // --- 不存在prop时默认以originProp为主，此时以默认为基准=>prop为单一字段
    if (!this.$prop) {
      this.prop = this.$getInterface('originProp')!
    } else {
      this.prop = this.$prop
    }
    this.$setLayout(initOption.layout, payload.layout)



    this.$mod = {}

  }
  /**
   * 获取接口数据对象
   * @param {string} target 对应的接口名称
   * @returns {InterfaceData}
   */
  $getInterfaceData (target: interfaceKeys) {
    return this.$interface[target]
  }
  /**
   * 获取接口prop数据，不存在对应属性或值则获取默认值
   * @param {string} target 对应的接口名称
   * @param {string} [prop] 属性值
   * @returns {*}
   */
  $getInterface (target: interfaceKeys, prop?: string) {
    return this.$interface[target].getData(prop)
  }
  /**
   * 设置接口数据
   * @param {string} target 对应的接口名称
   * @param {string} prop 属性
   * @param {*} data 值
   */
  $setInterface (target: interfaceKeys, prop: string, data: string, useSetData?: boolean) {
    this.$interface[target].setData(prop, data, useSetData)
  }
  $setLayout (layoutOption?: LayoutData | LayoutDataInitOption, parentLayoutOption?: LayoutData | LayoutDataInitOption) {
    const option = layoutOption || parentLayoutOption
    if (option && option.constructor === LayoutData) {
      this.$layout = option
    } else {
      this.$layout = new LayoutData(option as LayoutDataInitOption)
    }
  }
  $getLayout (): LayoutData
  $getLayout (prop: string): LayoutDataFormatData
  $getLayout (prop?: string) {
    if (prop) {
      return this.$layout.getData(prop)
    } else {
      return this.$layout
    }
  }
}

DictionaryItem.$name = 'DictionaryItem'

export default DictionaryItem
