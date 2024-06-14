// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type renderType<ARGS extends any[] = any[], RES = any> = (...args: ARGS) => RES

export type menuIcon = string | (() => any)

export interface fileDataType {
  data: string | File | Record<PropertyKey, any>
  name: string
  url?: string
}

export interface defaultFileOption {
  accept?: string
  size?: number
  layout?: string
  complex?: boolean
  button?: {
    name?: string
    type?: string
    icon?: menuIcon
  }
}

export interface singleFileOption extends defaultFileOption {
  upload?: (file: File) => Promise<{ file: fileDataType }>
}

export interface multipleFileOption extends defaultFileOption {
  upload?: (file: File[]) => Promise<{ file: fileDataType[] }>
  multiple: {
    min?: number
    max?: number
    append?: boolean
  }
}

export type fileOption<M extends boolean = false> = M extends true ? multipleFileOption : singleFileOption

export interface MenuValue<E = MouseEvent, A extends unknown[] = unknown[]> {
  name: string
  prop?: string
  type?: string
  icon?: menuIcon
  debounce?: number // 函数防抖，事件触发结束后的N秒才可继续触发
  loading?: boolean | ((...args: A) => boolean)
  disabled?: boolean | ((...args: A) => boolean)
  click?: (e: E) => void | Promise<unknown> // 返回Promise则根据状态切换loading
  render?: renderType
}

export interface ButtonValue<E = MouseEvent, A extends unknown[] = unknown[]> extends MenuValue<E, A> {
  upload?: (file: File) => Promise<unknown>
  fileOption?: Partial<fileOption<boolean>>
}
