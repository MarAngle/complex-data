import DefaultMod, { DefaultModInitOption } from "./DefaultMod"
import DictionaryValue, { functionType } from "../lib/DictionaryValue"
import InterfaceValue, { InterfaceValueInitOption } from "../lib/InterfaceValue"

export interface SimpleEditInitOption extends DefaultModInitOption {
  colon?: boolean
  required?: InterfaceValueInitOption<boolean>
  disabled?: InterfaceValueInitOption<boolean>
  edit?: false | functionType<any> // 数据=>编辑 格式化
  post?: false | functionType<any> // 编辑=>来源 格式化
  on?: Record<PropertyKey, (...args: any[]) => any>
}

class SimpleEdit extends DefaultMod {
  static $name = 'SimpleEdit'
  static $formatConfig = { name: 'SimpleEdit', level: 50, recommend: true }
  colon: InterfaceValue<boolean>
  required: InterfaceValue<boolean>
  disabled: InterfaceValue<boolean>
  edit?: false | functionType<any>
  post?: false | functionType<any>
  $on: Record<PropertyKey, (...args: any[]) => any>
  constructor(initOption: SimpleEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.colon = new InterfaceValue(initOption.colon === undefined ? true : initOption.colon)
    this.required = new InterfaceValue(initOption.required || false)
    this.disabled = new InterfaceValue(initOption.disabled || false)
    // 组件事件监控
    this.edit = initOption.edit
    this.post = initOption.post
    this.$on = initOption.on || {}
  }
}

export default SimpleEdit
