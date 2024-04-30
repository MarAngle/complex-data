import DefaultMod, { DefaultModInitOption } from "./DefaultMod"
import DictionaryValue, { functionType } from "../lib/DictionaryValue"
import InterfaceValue, { InterfaceValueInitOption } from "../lib/InterfaceValue"

export interface DefaultSimpleEditInitOption extends DefaultModInitOption {
  colon?: boolean
  required?: InterfaceValueInitOption<boolean>
  disabled?: InterfaceValueInitOption<boolean>
  fetch?: false | functionType<any> // 编辑=>来源 格式化
  on?: Record<PropertyKey, (...args: any[]) => any>
}

class DefaultSimpleEdit extends DefaultMod {
  static $name = 'DefaultSimpleEdit'
  static $formatConfig = { name: 'DefaultSimpleEdit', level: 50, recommend: true }
  colon: InterfaceValue<boolean>
  required: InterfaceValue<boolean>
  disabled: InterfaceValue<boolean>
  fetch?: false | functionType<any>
  $on: Record<PropertyKey, (...args: any[]) => any>
  constructor(initOption: DefaultSimpleEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.colon = new InterfaceValue(initOption.colon === undefined ? true : initOption.colon)
    this.required = new InterfaceValue(initOption.required || false)
    this.disabled = new InterfaceValue(initOption.disabled || false)
    // 组件事件监控
    this.fetch = initOption.fetch
    this.$on = initOption.on || {}
  }
}

export default DefaultSimpleEdit
