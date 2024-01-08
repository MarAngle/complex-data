import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue, { payloadType } from "../lib/DictionaryValue"
import { renderType } from "./DefaultMod"
import { DefaultEditFileOption } from "./DefaultEditFile"

export type DefaultEditButtonClickType = (payload: payloadType) => void | Promise<unknown>

export interface DefaultEditButtonOption {
  type: string
  icon?: string | (() => unknown)
  name?: string
  loading?: boolean | ((...args: unknown[]) => boolean)
  disabled?: boolean | ((...args: unknown[]) => boolean)
  upload?: (file: File) => Promise<unknown>
  uploadOption?: Partial<DefaultEditFileOption>
  render?: renderType
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
  constructor(initOption: DefaultEditButtonInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof DefaultEditButton).$defaultOption
    if (!option.type) {
      option.type = $defaultOption.type
    }
    this.$option = option as DefaultEditButtonOption
  }
}

export default DefaultEditButton
