import DefaultInfo, { DefaultInfoInitOption } from "./DefaultInfo"
import DictionaryValue, { functionType } from "../lib/DictionaryValue"
import InterfaceValue, { InterfaceValueInitOption } from "../lib/InterfaceValue"

export interface DefaultSimpleEditInitOption extends DefaultInfoInitOption {
  required?: boolean
  disabled?: InterfaceValueInitOption<boolean>
  collect?: functionType<any> // 编辑=>来源 格式化
  on?: Record<PropertyKey, (...args: any[]) => any>
}

class DefaultSimpleEdit extends DefaultInfo {
  static $name = 'DefaultSimpleEdit'
  static $formatConfig = { name: 'DefaultSimpleEdit', level: 50, recommend: true }
  required: boolean
  disabled: InterfaceValue<boolean>
  collect?: functionType<any>
  $on: Record<PropertyKey, (...args: any[]) => any>
  constructor(initOption: DefaultSimpleEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.required = initOption.required || false
    this.disabled = new InterfaceValue(initOption.disabled || false)
    // 组件事件监控
    if (initOption.collect) {
      this.collect = initOption.collect
    }
    this.$on = initOption.on || {}
  }
  changeDisabled(value: boolean, prop = 'default') {
    this.disabled.setValue(prop, value)
  }
}

export default DefaultSimpleEdit
