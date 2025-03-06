import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface InputEditOption {
  type: string
  size: number
  hideClear: boolean
}

export interface InputEditInitOption extends DefaultEditInitOption<false> {
  type?: 'input'
  option?: Partial<InputEditOption>
}

class InputEdit extends DefaultEdit<false> {
  static $name = 'InputEdit'
  static $defaultOption = {
    type: 'text',
    size: 128,
    hideClear: false
  }
  type: 'input'
  $option: InputEditOption
  constructor(initOption: InputEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type || 'input'
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof InputEdit).$defaultOption
    this.$option = {
      type: option.type || $defaultOption.type,
      size: option.size || $defaultOption.size,
      hideClear: option.hideClear ?? $defaultOption.hideClear
    }
  }
}

export default InputEdit
