import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue, { payloadType } from "../lib/DictionaryValue"
import { DefaultEditFileOption } from "./DefaultEditFile"
import { renderType } from "../type"

export type DefaultEditButtonClickType = (payload: payloadType) => void | Promise<unknown>

export interface PureButtonValue<E = MouseEvent> {
  name: string
  prop: string
  type?: string
  icon?: string | (() => unknown)
  loading?: boolean | ((...args: unknown[]) => boolean)
  disabled?: boolean | ((...args: unknown[]) => boolean)
  click?: (e: E) => void | Promise<unknown> // 返回Promise则根据状态切换loading
}

export interface ButtonValue<E = MouseEvent> extends PureButtonValue<E> {
  upload?: (file: File) => Promise<unknown>
  uploadOption?: Partial<DefaultEditFileOption>
  render?: renderType
}

export type DefaultEditButtonOption<E = payloadType> = Partial<ButtonValue<E>>

export interface DefaultEditButtonInitOption extends DefaultEditInitOption {
  type: 'button'
  option?: DefaultEditButtonOption
}

class DefaultEditButton extends DefaultEdit{
  static $name = 'DefaultEditButton'
  type: 'button'
  $option: DefaultEditButtonOption
  constructor(initOption: DefaultEditButtonInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    this.$option = option
  }
}

export default DefaultEditButton
