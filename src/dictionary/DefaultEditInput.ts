import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit";
import DictionaryValue from "./DictionaryValue";

export interface DefaultEditInputOption {
  type: string
  maxLength: number
  hideClear: boolean
}

export interface DefaultEditInputInitOption extends DefaultEditInitOption{
  type?: 'input'
  option?: Partial<DefaultEditInputOption>
}

class DefaultEditInput extends DefaultEdit{
  static $name = 'DefaultEditInput'
  static $defaultOption = {
    type: 'text',
    maxLength: 128,
    hideClear: false
  }
  type: 'input'
  $option: DefaultEditInputOption
  constructor(initOption: DefaultEditInputInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = 'input'
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof DefaultEditInput).$defaultOption
    this.$option = {
      type: option.type || $defaultOption.type,
      maxLength: option.maxLength || $defaultOption.maxLength,
      hideClear: option.hideClear || $defaultOption.hideClear
    }
  }
}

export default DefaultEditInput
