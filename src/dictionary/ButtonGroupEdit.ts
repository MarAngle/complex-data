import SimpleEdit, { SimpleEditInitOption } from "./SimpleEdit"
import DictionaryValue, { payloadType } from "../lib/DictionaryValue"
import ButtonValue, { ButtonValueInitOption } from "../lib/ButtonValue"
import config from "../../config"

export type ButtonGroupEditOption<E = payloadType, A extends unknown[] = [payloadType]> = ButtonValueInitOption<E, A>

export interface ButtonGroupEditInitOption extends SimpleEditInitOption {
  type: 'buttonGroup'
  interval?: number | string
  list: ButtonGroupEditOption[]
}

class ButtonGroupEdit extends SimpleEdit{
  static $name = 'ButtonGroupEdit'
  static $editable = false
  static $defaultOption = {
    interval: 16
  }
  type: 'buttonGroup'
  interval: string
  $list: ButtonValue<payloadType, [payloadType]>[]
  constructor(initOption: ButtonGroupEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const $defaultOption = (this.constructor as typeof ButtonGroupEdit).$defaultOption
    const interval = initOption.interval === undefined ? $defaultOption.interval : initOption.interval
    this.interval = typeof interval === 'number' ? config.formatPixel(interval) : interval
    this.$list = initOption.list.map(option => new ButtonValue(option))
  }
}

export default ButtonGroupEdit
