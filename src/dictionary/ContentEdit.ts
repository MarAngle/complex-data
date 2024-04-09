import SimpleEdit, { SimpleEditInitOption } from "./SimpleEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface ContentEditOption {
  data?: string
  style?: Record<PropertyKey, unknown>
}

export interface ContentEditInitOption extends SimpleEditInitOption {
  type: 'content'
  option?: Partial<ContentEditOption>
}

class ContentEdit extends SimpleEdit{
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
