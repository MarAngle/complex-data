import DefaultEdit from "./DefaultEdit"
import type { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface TextAreaEditOption {
  size: number
  autoSize: boolean
  hideClear: boolean
}

export interface TextAreaEditInitOption extends DefaultEditInitOption<false> {
  type: 'textArea'
  option?: Partial<TextAreaEditOption>
}

class TextAreaEdit extends DefaultEdit<false> {
  static $name = 'TextAreaEdit'
  static $defaultOption = {
    size: 2048,
    autoSize: false,
    hideClear: false
  }
  type: 'textArea'
  $option: TextAreaEditOption
  constructor(initOption: TextAreaEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = 'textArea'
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof TextAreaEdit).$defaultOption
    this.$option = {
      size: option.size || $defaultOption.size,
      autoSize: option.autoSize ?? $defaultOption.autoSize,
      hideClear: option.hideClear ?? $defaultOption.hideClear
    }
  }
}

export default TextAreaEdit
