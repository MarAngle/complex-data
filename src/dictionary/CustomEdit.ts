import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"

export type customModelHandler = (formdata: Record<PropertyKey, unknown>, prop: PropertyKey, args: unknown[]) => void

export interface CustomEditInitOption extends DefaultEditInitOption {
  type: 'custom'
  model?: {
    init?: PropertyKey
    change?: string
    handler?: customModelHandler
  }
  option?: Record<PropertyKey, any>
  custom?: Record<PropertyKey, any>
}

class CustomEdit extends DefaultEdit {
  static $name = 'CustomEdit'
  type: 'custom'
  $model: {
    init?: PropertyKey
    change?: string
    handler?: customModelHandler
  }
  $option: Record<PropertyKey, any>
  $custom: Record<PropertyKey, any>
  constructor(initOption: CustomEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    this.$model = initOption.model || {}
    this.$option = initOption.option || {}
    this.$custom = initOption.custom || {}
  }
}

export default CustomEdit
