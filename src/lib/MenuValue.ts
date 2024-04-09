import { menuIcon } from "../type"

export interface MenuValueInitOption<E = MouseEvent, A extends unknown[] = unknown[]> {
  name: string
  prop: string
  type?: string
  icon?: menuIcon
  loading?: boolean | ((...args: A) => boolean)
  disabled?: boolean | ((...args: A) => boolean)
  click?: (e: E) => void | Promise<unknown> // 返回Promise则根据状态切换loading
}

class MenuValue<E = MouseEvent, A extends unknown[] = unknown[]> {
  name: string
  prop: string
  type?: string
  icon?: menuIcon
  loading?: boolean | ((...args: A) => boolean)
  disabled?: boolean | ((...args: A) => boolean)
  click?: (e: E) => void | Promise<unknown> // 返回Promise则根据状态切换loading
  constructor(initOption: MenuValueInitOption<E, A>) {
    this.name = initOption.name
    this.prop = initOption.prop
    this.type = initOption.type
    this.icon = initOption.icon
    this.loading = initOption.loading
    this.disabled = initOption.disabled
    this.click = initOption.click
  }
}

export default MenuValue

