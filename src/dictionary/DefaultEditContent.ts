import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface DefaultEditContentOption {
  data?: string
  style?: Record<PropertyKey, unknown>
}

export interface DefaultEditContentInitOption extends DefaultEditInitOption {
  type: 'content'
  option?: Partial<DefaultEditContentOption>
}

class DefaultEditContent extends DefaultEdit{
  static $name = 'DefaultEditContent'
  type: 'content'
  $option: DefaultEditContentOption
  constructor(initOption: DefaultEditContentInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    this.$option = option
  }
}

export default DefaultEditContent
