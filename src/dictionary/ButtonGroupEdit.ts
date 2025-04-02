import DefaultSimpleEdit, { DefaultSimpleEditInitOption } from "./DefaultSimpleEdit"
import DictionaryValue from "../lib/DictionaryValue"
import { dataConfig } from "../../index"
import { ButtonEditOption } from "./ButtonEdit"

export interface ButtonGroupEditInitOption extends DefaultSimpleEditInitOption {
  type: 'buttonGroup'
  interval?: number | string
  list: ButtonEditOption[]
}

class ButtonGroupEdit extends DefaultSimpleEdit {
  static $name = 'ButtonGroupEdit'
  static $width = undefined
  static $defaultOption = {
    interval: 16
  }
  type: 'buttonGroup'
  interval: string
  $list: ButtonEditOption[]
  constructor(initOption: ButtonGroupEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const $defaultOption = (this.constructor as typeof ButtonGroupEdit).$defaultOption
    const interval = initOption.interval ?? $defaultOption.interval
    this.interval = typeof interval === 'number' ? dataConfig.formatPixel(interval) : interval
    this.$list = initOption.list
  }
}

export default ButtonGroupEdit
