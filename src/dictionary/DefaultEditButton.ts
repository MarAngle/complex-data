import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue, { payloadType } from "../lib/DictionaryValue"
import ButtonValue, { ButtonValueInitOption } from "../lib/ButtonValue"

export type DefaultEditButtonClickType = (payload: payloadType) => void | Promise<unknown>

export type DefaultEditButtonOption<E = payloadType, A extends unknown[] = [payloadType]> = ButtonValueInitOption<E, A>

export interface DefaultEditButtonInitOption extends DefaultEditInitOption {
  type: 'button'
  option: DefaultEditButtonOption
}

class DefaultEditButton extends DefaultEdit{
  static $name = 'DefaultEditButton'
  static $editable = false
  type: 'button'
  $option: ButtonValue<payloadType, [payloadType]>
  constructor(initOption: DefaultEditButtonInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    this.$option = new ButtonValue(initOption.option)
  }
}

export default DefaultEditButton
