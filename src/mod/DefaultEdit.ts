import $func from 'complex-func'
import BaseData, { BaseDataInitOption } from './../../src/data/BaseData'
import InterfaceData from './../../src/mod/InterfaceData'
import config from '../../config'


export interface DefaultEditInitOption extends BaseDataInitOption {
  type?: string,
  reload?: boolean,
  required?: boolean,
  disabled?: boolean
}



class DefaultEdit extends BaseData {
  type: string
  reload: boolean
  required: boolean
  disabled: boolean
  constructor(initOption: DefaultEditInitOption, payload) {
    if (!initOption) {
      throw new Error('编辑数据模块初始化参数为空！')
    }
    super(initOption)
    this.$triggerCreateLife('DefaultEdit', 'beforeCreate', initOption, payload)
    this.type = initOption.type || 'input'
    const defaultOption = config.option.getData(this.type)
    this.reload = initOption.reload || false // 异步二次加载判断值
    this.required = initOption.required || false
    if (defaultOption) {
      this.disabled = new InterfaceData(initOption.disabled || false)
      // 格式化占位符和检验规则
      if (defaultOption.placeholder) {
        if (!initOption.placeholder) {
          this.placeholder = new InterfaceData(defaultOption.placeholder(this.getParent().getInterfaceData('label')))
        } else {
          this.placeholder = new InterfaceData(initOption.placeholder)
        }
      }
      this.$value = {}
      this.option = {}
      // 组件事件监控
      this.on = initOption.on || {}
      // 插件单独的设置，做特殊处理时使用，尽可能的将所有能用到的数据通过option做兼容处理避免问题
      // main = { props: {} } item = { props: {} }
      this.localOption = initOption.localOption || {}
      this.$initWidth(initOption, defaultOption)
      this.$initValue(initOption, defaultOption)
      this.setMultiple(initOption.multiple || false)
      this.$initSlot(initOption)
      this.$initLocalOption(initOption)
    } else {
      this.$exportMsg(`对应的${this.type}不存在预定义，请检查代码或进行扩展！`)
    }
    this.$triggerCreateLife('DefaultEdit', 'created')
  }
  $initWidth(initOption, defaultOption) {
    // 宽度设置
    if (initOption.mainWidth) {
      let type = $func.getType(initOption.mainWidth)
      if (type == 'number') {
        this.mainWidth = initOption.mainWidth + 'px'
      } else {
        this.mainWidth = initOption.mainWidth
      }
    }
    if (initOption.width) {
      let type = $func.getType(initOption.width)
      if (type == 'number') {
        this.width = initOption.width + 'px'
      } else {
        this.width = initOption.width
      }
    } else if (initOption.width === undefined && defaultOption.width) {
      this.width = defaultOption.width
    }
  }
  // slot格式化编辑数据
  $initSlot (initOption) { // label / front / end
    this.slot = initOption.slot || {}
    if (!this.slot.type) { // slot类型 auto/main/item/model
      this.slot.type = 'auto'
    }
    if (!this.slot.name) { // name=>插槽默认名
      this.slot.name = this.$prop
    }
    if (!this.slot.label) { // label=>title
      this.slot.label = this.slot.name + '-label'
    }
  }
  $initValue(initOption, defaultOption) {
    if ($func.hasProp(initOption, 'defaultValue')) {
      this.setValueData(initOption.defaultValue, 'defaultValue')
    } else {
      this.setValueData(defaultOption.defaultValue, 'defaultValue')
    }
    if ($func.hasProp(initOption, 'initValue')) {
      this.setValueData(initOption.initValue, 'initValue')
    } else {
      this.setValueData(this.getValueData(), 'initValue')
    }
    if ($func.hasProp(initOption, 'resetValue')) {
      this.setValueData(initOption.resetValue, 'resetValue')
    } else {
      this.setValueData(this.getValueData(), 'resetValue')
    }
  }
  setMultiple(data) {
    if (this.multiple !== data) {
      this.multiple = data
      if (this.multiple) {
        this.$initMultipleValue()
      }
    }
  }
  $initMultipleValue() {
    for (let n = 0; n < config.option.valuePropList.length; n++) {
      let prop = config.option.valuePropList[n]
      let type = $func.getType(this.getValueData(prop))
      if (type != 'array') {
        this.setValueData([], prop)
      }
    }
  }
  $initLocalOption(initOption) {
    if (initOption.option) {
      this.option = {
        ...initOption
      }
    }
  }
  setValueData(data, prop = 'defaultValue') {
    this.$value[prop] = data
  }
  getValueData(prop = 'defaultValue') {
    return this.$value[prop]
  }
  $checkReadyData() {
    return this.$getData
  }
  readyData() {
    if (this.$module.status && this.$module.promise && this.$checkReadyData()) {
      return this.loadData(this.reload)
    } else {
      return Promise.resolve({ status: 'success' })
    }
  }
}

DefaultEdit.$name = 'DefaultEdit'

export default DefaultEdit
