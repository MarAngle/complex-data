import DefaultSimpleEdit, { DefaultSimpleEditInitOption } from "./DefaultSimpleEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface ContentEditOption {
  data?: string
  style?: Record<PropertyKey, any>
}

export interface ContentEditInitOption extends DefaultSimpleEditInitOption {
  type: 'content'
  option?: Partial<ContentEditOption>
}

class ContentEdit extends DefaultSimpleEdit {
  static $name = 'ContentEdit'
  type: 'content'
  $option: ContentEditOption
  constructor(initOption: ContentEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    this.$option = initOption.option || {}
  }
}

export default ContentEdit
