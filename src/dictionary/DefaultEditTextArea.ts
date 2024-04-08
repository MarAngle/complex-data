import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface DefaultEditTextAreaOption {
  size: number
  autoSize: boolean
  hideClear: boolean
}

export interface DefaultEditTextAreaInitOption extends DefaultEditInitOption {
  type: 'textArea'
  option?: Partial<DefaultEditTextAreaOption>
}

class DefaultEditTextArea extends DefaultEdit{
  static $name = 'DefaultEditTextArea'
  static $defaultOption = {
    size: 2048,
    autoSize: false,
    hideClear: false
  }
  type: 'textArea'
  $option: DefaultEditTextAreaOption
  constructor(initOption: DefaultEditTextAreaInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = 'textArea'
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof DefaultEditTextArea).$defaultOption
    this.$option = {
      size: option.size || $defaultOption.size,
      autoSize: option.autoSize === undefined ? $defaultOption.autoSize : option.autoSize,
      hideClear: option.hideClear === undefined ? $defaultOption.hideClear : option.hideClear
    }
  }
}

export default DefaultEditTextArea
