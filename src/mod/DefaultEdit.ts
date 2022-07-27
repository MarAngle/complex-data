import $func from 'complex-func'
import BaseData, { BaseDataInitOption } from './../../src/data/BaseData'
import InterfaceData, { InterfaceDataInitOption } from './../../src/mod/InterfaceData'
import config, { DictType } from '../../config'
import { objectAny, objectFunction } from '../../ts'
import DictionaryItem from './DictionaryItem'


interface valueType {
  default?: any,
  init?: any,
  reset?: any,
  [prop: PropertyKey]: any
}

export interface DefaultEditInitOption extends BaseDataInitOption {
  type?: string
  reload?: boolean
  required?: boolean
  multiple?: boolean
  disabled?: InterfaceDataInitOption<boolean>
  placeholder?: InterfaceDataInitOption<string>
  mainWidth?: string | number
  width?: string | number
  option?: objectAny
  localOption?: objectAny
  value?: valueType
  on?: objectFunction
  tips?: string | {
    data: string,
    location?: string
  }
  slot?: {
    type?: string,
    name?: string,
    label?: string
  }
}

class DefaultEdit extends BaseData {
  type: string
  reload: boolean
  required: boolean
  multiple!: boolean
  disabled: InterfaceData<boolean>
  placeholder!: InterfaceData<string>
  $mainWidth?: string
  $width?: string
  $value!: {
    default: any,
    init: any,
    reset: any,
    [prop: PropertyKey]: any
  }
  $option: objectAny
  $localOption: objectAny
  $on: objectFunction
  $tips!: {
    data: string,
    location: string
  }
  $slot!: {
    type: string,
    name: string,
    label: string
  }
  constructor(initOption: DefaultEditInitOption) {
    if (!initOption) {
      throw new Error('编辑数据模块初始化参数为空！')
    }
    super(initOption)
    this.$triggerCreateLife('DefaultEdit', 'beforeCreate', initOption)
    this.type = initOption.type || 'input'
    const defaultOption = config.DefaultEdit.option.getData(this.type)
    this.reload = initOption.reload || false // 异步二次加载判断值
    this.required = initOption.required || false
    this.disabled = new InterfaceData(initOption.disabled || false)
    this.$option = {}
    this.$tips = {
      data: '',
      location: ''
    }
    // 组件事件监控
    this.$on = initOption.on || {}
    // 插件单独的设置，做特殊处理时使用，尽可能的将所有能用到的数据通过option做兼容处理避免问题
    // main = { props: {} } item = { props: {} }
    this.$localOption = initOption.localOption || {}
    if (defaultOption) {
      // 格式化占位符和检验规则
      if (defaultOption.placeholder) {
        if (!initOption.placeholder) {
          this.placeholder = new InterfaceData(defaultOption.placeholder((this.$getParent() as DictionaryItem).$getInterfaceData('label')))
        } else {
          this.placeholder = new InterfaceData(initOption.placeholder)
        }
      }
      this.$initWidth(initOption, defaultOption)
      this.$initValue(initOption.value, defaultOption)
      this.setMultiple(initOption.multiple || false)
      this.$initSlot(initOption)
      this.$initLocalOption(initOption)
    } else {
      this.$exportMsg(`对应的${this.type}不存在预定义，请检查代码或进行扩展！`)
    }
    this.$triggerCreateLife('DefaultEdit', 'created')
  }
  // 格式化编辑数据
  $initTips (initOption: DefaultEditInitOption) {
    // tips提示
    if (!initOption.tips) {
      this.$tips.data =''
      this.$tips.location =''
    } else {
      if (typeof initOption.tips != 'object') {
        this.$tips.data = initOption.tips || ''
        this.$tips.location = 'top'
      } else {
        this.$tips.data = initOption.tips.data
        this.$tips.location = initOption.tips.location || 'top'
      }
    }
  }
  $initWidth(initOption: DefaultEditInitOption, defaultOption: DictType) {
    // 宽度设置
    if (initOption.mainWidth) {
      const type = $func.getType(initOption.mainWidth)
      if (type == 'number') {
        this.$mainWidth = initOption.mainWidth + 'px'
      } else {
        this.$mainWidth = initOption.mainWidth as string 
      }
    }
    if (initOption.width) {
      const type = $func.getType(initOption.width)
      if (type == 'number') {
        this.$width = initOption.width + 'px'
      } else {
        this.$width = initOption.width as string
      }
    } else if (initOption.width === undefined && defaultOption.width) {
      this.$width = defaultOption.width
    }
  }
  // slot格式化编辑数据
  $initSlot (initOption: DefaultEditInitOption) { // label / front / end
    this.$slot = initOption.slot || {} as any
    if (!this.$slot.type) { // slot类型 auto/main/item/model
      this.$slot.type = 'auto'
    }
    if (!this.$slot.name) { // name=>插槽默认名
      this.$slot.name = this.$prop
    }
    if (!this.$slot.label) { // label=>title
      this.$slot.label = this.$slot.name + '-label'
    }
  }
  $initValue(initOptionValue: valueType = {}, defaultOption: DictType) {
    this.$value = {} as any
    if ($func.hasProp(initOptionValue, 'default')) {
      this.setValueData(initOptionValue.default, 'default')
    } else {
      this.setValueData(defaultOption.default, 'default')
    }
    if ($func.hasProp(initOptionValue, 'init')) {
      this.setValueData(initOptionValue.init, 'init')
    } else {
      this.setValueData(this.getValueData(), 'init')
    }
    if ($func.hasProp(initOptionValue, 'reset')) {
      this.setValueData(initOptionValue.reset, 'reset')
    } else {
      this.setValueData(this.getValueData(), 'reset')
    }
  }
  setMultiple(data: boolean) {
    if (this.multiple !== data) {
      this.multiple = data
      if (this.multiple) {
        this.$initMultipleValue()
      }
    }
  }
  $initMultipleValue() {
    for (let n = 0; n < config.DefaultEdit.option.valuePropList.length; n++) {
      const prop = config.DefaultEdit.option.valuePropList[n]
      const type = $func.getType(this.getValueData(prop))
      if (type != 'array') {
        this.setValueData([], prop)
      }
    }
  }
  $initLocalOption(initOption: DefaultEditInitOption) {
    if (initOption.option) {
      this.$option = {
        ...initOption
      }
    }
  }
  setValueData(data: any, prop = 'default') {
    this.$value[prop] = data
  }
  getValueData(prop = 'default') {
    return this.$value[prop]
  }
  $checkReadyData() {
    return this.$getData
  }
  readyData() {
    if (this.$module.status && this.$module.promise && this.$checkReadyData()) {
      return this.$loadData(this.reload)
    } else {
      return Promise.resolve({ status: 'success' })
    }
  }
}

DefaultEdit.$name = 'DefaultEdit'

export default DefaultEdit
