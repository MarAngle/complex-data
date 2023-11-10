import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue, { payloadType } from "./DictionaryValue"

export type DefaultEditButtonClickType = (payload: payloadType) => void | Promise<unknown>

export interface DefaultEditButtonOption {
  type: string
  icon?: string
  name?: string
  loading?: boolean
  click?: DefaultEditButtonClickType // 返回Promise则根据状态切换loading
}

export interface DefaultEditButtonInitOption extends DefaultEditInitOption {
  type: 'button'
  option?: Partial<DefaultEditButtonOption>
}

class DefaultEditButton extends DefaultEdit{
  static $name = 'DefaultEditButton'
  static $defaultOption = {
    type: 'default'
  }
  type: 'button'
  $option: DefaultEditButtonOption
  constructor(initOption: DefaultEditButtonInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = initOption.type
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof DefaultEditButton).$defaultOption
    this.$option = {
      type: option.type || $defaultOption.type,
      icon: option.icon,
      name: option.name,
      loading: option.loading,
      click: option.click
    }
  }
}

export default DefaultEditButton
