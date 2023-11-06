import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit";
import DictionaryValue from "./DictionaryValue";

export interface DefaultEditButtonOption {
  type: string
  icon?: unknown
  name?: string
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
    this.type = 'button'
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof DefaultEditButton).$defaultOption
    this.$option = {
      type: option.type || $defaultOption.type,
      icon: option.icon,
      name: option.name
    }
  }
}

export default DefaultEditButton
