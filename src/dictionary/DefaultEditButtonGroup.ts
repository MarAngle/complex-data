import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import { ButtonValue } from "./DefaultEditButton"
import DictionaryValue, { payloadType } from "../lib/DictionaryValue"
import config from "../../config"

export type DefaultEditButtonGroupOption<E = payloadType, A extends unknown[] = [payloadType]> = ButtonValue<E, A>

export interface DefaultEditButtonGroupInitOption extends DefaultEditInitOption {
  type: 'buttonGroup'
  interval?: number | string
  list?: DefaultEditButtonGroupOption[]
}

class DefaultEditButtonGroup extends DefaultEdit{
  static $name = 'DefaultEditButtonGroup'
  static $defaultOption = {
    interval: 16
  }
  type: 'buttonGroup'
  interval: string
  $list: DefaultEditButtonGroupOption[]
  constructor(initOption: DefaultEditButtonGroupInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const $defaultOption = (this.constructor as typeof DefaultEditButtonGroup).$defaultOption
    const interval = initOption.interval === undefined ? $defaultOption.interval : initOption.interval
    this.interval = typeof interval === 'number' ? config.formatPixel(interval) : interval
    const list = initOption.list || []
    this.$list = list
  }
}

export default DefaultEditButtonGroup
