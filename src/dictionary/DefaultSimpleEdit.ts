import DefaultInfo, { DefaultInfoInitOption } from "./DefaultInfo"
import DictionaryValue, { functionType } from "../lib/DictionaryValue"

export interface DefaultSimpleEditInitOption extends DefaultInfoInitOption {
  required?: boolean
  disabled?: boolean
  collect?: false | functionType<any> // 编辑=>来源 格式化
  on?: Record<PropertyKey, (...args: any[]) => any>
}

class DefaultSimpleEdit extends DefaultInfo {
  static $name = 'DefaultSimpleEdit'
  static $formatConfig = { name: 'DefaultSimpleEdit', level: 50, recommend: true }
  required: boolean
  disabled: boolean
  collect?: false | functionType<any>
  $on: Record<PropertyKey, (...args: any[]) => any>
  constructor(initOption: DefaultSimpleEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.required = initOption.required || false
    this.disabled = initOption.disabled || false
    // 组件事件监控
    this.collect = initOption.collect
    this.$on = initOption.on || {}
  }
}

export default DefaultSimpleEdit
