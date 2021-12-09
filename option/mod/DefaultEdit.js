import _func from 'complex-func'
import BaseData from './../../src/data/BaseData'
import InterfaceData from './../../src/mod/InterfaceData'
import config from '../config'

class DefaultEdit extends BaseData {
  constructor(initOption, payload) {
    super(initOption)
    this.triggerCreateLife('DefaultEdit', 'beforeCreate', initOption, payload)
    this.type = initOption.type || 'input'
    let defaultOption = config.option.getData(this.type)
    this.reload = initOption.reload || false // 异步二次加载判断值
    this.required = initOption.required || false
    this.multiple = initOption.multiple || false
    this.disabled = new InterfaceData(initOption.disabled || false)
    // 宽度设置
    if (initOption.mainwidth) {
      let type = _func.getType(initOption.mainwidth)
      if (type == 'number') {
        this.mainwidth = initOption.mainwidth + 'px'
      } else {
        this.mainwidth = initOption.mainwidth
      }
    }
    if (initOption.width) {
      let type = _func.getType(initOption.width)
      if (type == 'number') {
        this.width = initOption.width + 'px'
      } else {
        this.width = initOption.width
      }
    } else if (initOption.width === undefined && defaultOption.width) {
      this.width = defaultOption.width
    }
    // 格式化占位符和检验规则
    if (defaultOption.placeholder) {
      if (!initOption.placeholder) {
        this.placeholder = new InterfaceData(defaultOption.placeholder(this.getParent().getInterfaceData('label')))
      } else {
        this.placeholder = new InterfaceData(initOption.placeholder)
      }
    }
    this.$value = {}
    this.initValue(initOption, defaultOption)
    if (this.multiple) {
      this.setMultipleValue()
    }
    this.initSlot(initOption)
    this.initType(initOption)
    this.triggerCreateLife('DefaultEdit', 'created')
  }
  // slot格式化编辑数据
  initSlot (initOption) { // label / front / end
    this.slot = initOption.slot || {}
    if (!this.slot.type) { // slot类型 auto/main/item/model
      this.slot.type = 'auto'
    }
    if (!this.slot.name) { // name=>插槽默认名
      this.slot.name = this.prop
    }
    if (!this.slot.label) { // label=>title
      this.slot.label = this.slot.name + '-label'
    }
  }
  initValue(initOption, defaultOption) {
    if (_func.hasProp(initOption, 'defaultValue')) {
      this.setValueData(initOption.defaultValue, 'defaultValue')
    } else {
      this.setValueData(defaultOption.defaultValue, 'defaultValue')
    }
    if (_func.hasProp(initOption, 'initValue')) {
      this.$value.initValue = initOption.initValue
    } else {
      this.$value.initValue = this.$value.defaultValue
    }
    if (_func.hasProp(initOption, 'resetValue')) {
      this.$value.resetValue = initOption.resetValue
    } else {
      this.$value.resetValue = this.$value.defaultValue
    }
  }
  setMultipleValue() {
    for (let n = 0; n < config.option.valuePropList.length; n++) {
      let prop = config.option.valuePropList[n]
      let type = _func.getType(this.getValueData(prop))
      if (type != 'array') {
        this.setValueData([], prop)
      }
    }
  }
  setValueData(data, prop = 'defaultValue') {
    this.$value[prop] = data
  }
  getValueData(prop = 'defaultValue') {
    return this.$value[prop]
  }
}

DefaultEdit.$name = 'DefaultEdit'

export default DefaultEdit
