import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import { DefaultEditButtonOption } from "./DefaultEditButton"
import DictionaryValue, { payloadType } from "../lib/DictionaryValue"
import config from "../../config"

export interface DefaultEditButtonGroupOption extends DefaultEditButtonOption {
  name: string
  prop: string
}

export type DefaultEditButtonGroupClickType = (payload: payloadType) => void | Promise<unknown>

export interface DefaultEditButtonGroupInitOption extends DefaultEditInitOption {
  type: 'buttonGroup'
  interval?: number | string
  list?: Partial<DefaultEditButtonGroupOption>[]
}

class DefaultEditButtonGroup extends DefaultEdit{
  static $name = 'DefaultEditButtonGroup'
  static $defaultOption = {
    type: 'default',
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
    this.$list = list.map(item => {
      if (!item.type) {
        item.type = $defaultOption.type
      }
      return item as DefaultEditButtonGroupOption
    })
  }
}

export default DefaultEditButtonGroup
