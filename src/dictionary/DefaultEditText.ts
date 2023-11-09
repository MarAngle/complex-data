import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "./DictionaryValue"

export interface DefaultEditTextOption {
  data?: string
  style: Record<PropertyKey, unknown>
}

export interface DefaultEditTextInitOption extends DefaultEditInitOption {
  type: 'text'
  option?: Partial<DefaultEditTextOption>
}

class DefaultEditText extends DefaultEdit{
  static $name = 'DefaultEditText'
  type: 'text'
  $option: DefaultEditTextOption
  constructor(initOption: DefaultEditTextInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = 'text'
    const option = initOption.option || {}
    this.$option = {
      data: option.data,
      style: option.style || {}
    }
  }
}

export default DefaultEditText
