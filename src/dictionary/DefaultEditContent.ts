import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "./DictionaryValue"

export interface DefaultEditContentOption {
  data?: string
  style: Record<PropertyKey, unknown>
}

export interface DefaultEditContentInitOption extends DefaultEditInitOption {
  type: 'content'
  option?: Partial<DefaultEditContentOption>
}

class DefaultEditContent extends DefaultEdit{
  static $name = 'DefaultEditContent'
  type: 'content'
  $option: DefaultEditContentOption
  constructor(initOption: DefaultEditContentInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = initOption.type
    const option = initOption.option || {}
    this.$option = {
      data: option.data,
      style: option.style || {}
    }
  }
}

export default DefaultEditContent
