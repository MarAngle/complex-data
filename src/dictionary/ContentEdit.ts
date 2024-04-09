import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface ContentEditOption {
  data?: string
  style?: Record<PropertyKey, unknown>
}

export interface ContentEditInitOption extends DefaultEditInitOption {
  type: 'content'
  option?: Partial<ContentEditOption>
}

class ContentEdit extends DefaultEdit{
  static $name = 'ContentEdit'
  static $editable = false
  type: 'content'
  $option: ContentEditOption
  constructor(initOption: ContentEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    this.$option = option
  }
}

export default ContentEdit
