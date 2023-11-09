import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "./DictionaryValue"

export interface DefaultEditCustomInitOption extends DefaultEditInitOption {
  type: 'custom' | 'slot'
  option?: Record<PropertyKey, unknown>
  custom?: Record<PropertyKey, unknown>
}

class DefaultEditCustom extends DefaultEdit{
  static $name = 'DefaultEditCustom'
  type: 'custom' | 'slot'
  $option: Record<PropertyKey, unknown>
  $custom: Record<PropertyKey, unknown>
  constructor(initOption: DefaultEditCustomInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = initOption.type
    this.$option = initOption.option || {}
    this.$custom = initOption.custom || {}
  }
}

export default DefaultEditCustom
