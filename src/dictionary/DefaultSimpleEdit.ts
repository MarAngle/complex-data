import DefaultSimpleMod, { DefaultSimpleModInitOption } from "./DefaultSimpleMod"
import DictionaryValue, { functionType } from "../lib/DictionaryValue"

export interface DefaultSimpleEditInitOption extends DefaultSimpleModInitOption {
  colon?: boolean
  required?: boolean
  disabled?: boolean
  fetch?: false | functionType<any> // 编辑=>来源 格式化
  on?: Record<PropertyKey, (...args: any[]) => any>
}

class DefaultSimpleEdit extends DefaultSimpleMod {
  static $name = 'DefaultSimpleEdit'
  static $formatConfig = { name: 'DefaultSimpleEdit', level: 50, recommend: true }
  colon: boolean
  required: boolean
  disabled: boolean
  fetch?: false | functionType<any>
  $on: Record<PropertyKey, (...args: any[]) => any>
  constructor(initOption: DefaultSimpleEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.colon = initOption.colon === undefined ? true : initOption.colon
    this.required = initOption.required || false
    this.disabled = initOption.disabled || false
    // 组件事件监控
    this.fetch = initOption.fetch
    this.$on = initOption.on || {}
  }
}

export default DefaultSimpleEdit
