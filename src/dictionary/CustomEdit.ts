import EditData, { EditDataInitOption } from "./EditData"
import DictionaryValue from "../lib/DictionaryValue"

export interface CustomEditInitOption extends EditDataInitOption {
  type: 'custom'
  option?: Record<PropertyKey, unknown>
  custom?: Record<PropertyKey, unknown>
}

class CustomEdit extends EditData{
  static $name = 'CustomEdit'
  type: 'custom'
  $option: Record<PropertyKey, unknown>
  $custom: Record<PropertyKey, unknown>
  constructor(initOption: CustomEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    this.$option = initOption.option || {}
    this.$custom = initOption.custom || {}
  }
}

export default CustomEdit
