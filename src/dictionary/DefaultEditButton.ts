import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue, { payloadType } from "./DictionaryValue"

export interface DefaultEditButtonOption {
  type: string
  icon?: string
  name?: string
  loading?: boolean
}

export type DefaultEditButtonClickType = (payload: payloadType) => void | Promise<unknown>

export interface DefaultEditButtonInitOption extends DefaultEditInitOption {
  type: 'button'
  option?: Partial<DefaultEditButtonOption>
  click?: DefaultEditButtonClickType // 返回Promise则根据状态切换loading
}

class DefaultEditButton extends DefaultEdit{
  static $name = 'DefaultEditButton'
  static $defaultOption = {
    type: 'default'
  }
  type: 'button'
  $option: DefaultEditButtonOption
  click?: DefaultEditButtonClickType
  constructor(initOption: DefaultEditButtonInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = 'button'
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof DefaultEditButton).$defaultOption
    this.$option = {
      type: option.type || $defaultOption.type,
      icon: option.icon,
      name: option.name,
      loading: option.loading
    }
    this.click = initOption.click
  }
}

export default DefaultEditButton
