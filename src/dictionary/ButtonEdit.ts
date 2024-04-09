import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue, { payloadType } from "../lib/DictionaryValue"
import ButtonValue, { ButtonValueInitOption } from "../lib/ButtonValue"

export type ButtonEditClickType = (payload: payloadType) => void | Promise<unknown>

export type ButtonEditOption<E = payloadType, A extends unknown[] = [payloadType]> = ButtonValueInitOption<E, A>

export interface ButtonEditInitOption extends DefaultEditInitOption {
  type: 'button'
  option: ButtonEditOption
}

class ButtonEdit extends DefaultEdit{
  static $name = 'ButtonEdit'
  static $editable = false
  type: 'button'
  $option: ButtonValue<payloadType, [payloadType]>
  constructor(initOption: ButtonEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    this.$option = new ButtonValue(initOption.option)
  }
}

export default ButtonEdit
