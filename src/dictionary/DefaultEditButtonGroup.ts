import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import { DefaultEditButtonOption } from "./DefaultEditButton"
import DictionaryValue, { payloadType } from "../lib/DictionaryValue"
import { renderType } from "./DefaultMod"

export interface DefaultEditButtonGroupOption extends DefaultEditButtonOption {
  disabled?: boolean
  name: string
  prop: string
  render?: renderType
}

export type DefaultEditButtonGroupClickType = (payload: payloadType) => void | Promise<unknown>

export interface DefaultEditButtonGroupInitOption extends DefaultEditInitOption {
  type: 'buttonGroup'
  list?: Partial<DefaultEditButtonGroupOption>[]
}

class DefaultEditButtonGroup extends DefaultEdit{
  static $name = 'DefaultEditButtonGroup'
  static $defaultOption = {
    type: 'default'
  }
  type: 'buttonGroup'
  $list: DefaultEditButtonGroupOption[]
  constructor(initOption: DefaultEditButtonGroupInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const list = initOption.list || []
    const $defaultOption = (this.constructor as typeof DefaultEditButtonGroup).$defaultOption
    this.$list = list.map(item => {
      if (!item.type) {
        item.type = $defaultOption.type
      }
      return item as DefaultEditButtonGroupOption
    })
  }
}

export default DefaultEditButtonGroup
