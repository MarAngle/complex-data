import DefaultSimpleEdit, { DefaultSimpleEditInitOption } from "./DefaultSimpleEdit"
import DictionaryValue, { payloadType } from "../lib/DictionaryValue"
import { ButtonValue } from "../../type"

export type ButtonEditClickType = (payload: payloadType) => void | Promise<unknown>

export type ButtonEditOption<E = payloadType, A extends unknown[] = [payloadType]> = ButtonValue<E, A>

export interface ButtonEditInitOption extends DefaultSimpleEditInitOption {
  type: 'button'
  option: ButtonEditOption
}

class ButtonEdit extends DefaultSimpleEdit {
  static $name = 'ButtonEdit'
  static $width = undefined
  type: 'button'
  $option: ButtonEditOption
  constructor(initOption: ButtonEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    this.$option = initOption.option
  }
}

export default ButtonEdit
