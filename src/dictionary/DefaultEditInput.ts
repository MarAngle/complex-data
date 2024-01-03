import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface DefaultEditInputOption {
  type: string
  size: number
  hideClear: boolean
}

export interface DefaultEditInputInitOption extends DefaultEditInitOption {
  type?: 'input'
  option?: Partial<DefaultEditInputOption>
}

class DefaultEditInput extends DefaultEdit{
  static $name = 'DefaultEditInput'
  static $defaultOption = {
    type: 'text',
    size: 128,
    hideClear: false
  }
  type: 'input'
  $option: DefaultEditInputOption
  constructor(initOption: DefaultEditInputInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type || 'input'
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof DefaultEditInput).$defaultOption
    this.$option = {
      type: option.type || $defaultOption.type,
      size: option.size || $defaultOption.size,
      hideClear: option.hideClear === undefined ? $defaultOption.hideClear : option.hideClear
    }
  }
}

export default DefaultEditInput