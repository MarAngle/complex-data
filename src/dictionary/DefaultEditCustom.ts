import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "./DictionaryValue"

export interface DefaultEditCustomInitOption extends DefaultEditInitOption {
  type: 'custom'
  option?: Record<PropertyKey, unknown>
  custom?: Record<PropertyKey, unknown>
}

class DefaultEditCustom extends DefaultEdit{
  static $name = 'DefaultEditCustom'
  type: 'custom'
  $option: Record<PropertyKey, unknown>
  $custom: Record<PropertyKey, unknown>
  constructor(initOption: DefaultEditCustomInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    this.$option = initOption.option || {}
    this.$custom = initOption.custom || {}
  }
}

export default DefaultEditCustom
