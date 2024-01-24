import { renderType } from "../type"

export interface ButtonValueInitOption<E = MouseEvent> {
  name: string
  prop?: string
  type?: string
  icon?: string | (() => unknown)
  loading?: boolean | ((...args: unknown[]) => boolean)
  disabled?: boolean | ((...args: unknown[]) => boolean)
  render?: renderType
  click?: (e: E) => void | Promise<unknown> // 返回Promise则根据状态切换loading
}

class ButtonValue<E> {
  name: string
  prop?: string
  type?: string
  icon?: string | (() => unknown)
  loading?: boolean | ((...args: unknown[]) => boolean)
  disabled?: boolean | ((...args: unknown[]) => boolean)
  render?: renderType
  click?: (e: E) => void | Promise<unknown> // 返回Promise则根据状态切换loading
  constructor(initOption: ButtonValueInitOption) {
    this.name = initOption.name
  }
}

export default ButtonValue
