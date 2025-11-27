
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type renderType<ARGS extends any[] = any[], RES = any> = (...args: ARGS) => RES

export type menuIcon = string | (() => any)

export type fileDataType = {
  name: string
  value: any
  url?: string
}

export interface defaultFileOption {
  accept?: string
  image?: {
    width: number
    height?: number
    modal?: any
  }
  size?: number
  layout?: string
  complex?: boolean
  isUrl?: boolean
  button?: {
    name?: string
    type?: string
    icon?: menuIcon
  }
}

export interface singleFileOption {
  upload?: (file: File) => Promise<{ file: fileDataType }>
}

export interface multipleFileOption {
  upload?: (file: File[]) => Promise<{ file: fileDataType[] }>
  multiple: {
    min?: number
    max?: number
    append?: boolean
  }
}

export type fileOption<M extends boolean = false> = M extends true ? defaultFileOption & multipleFileOption : defaultFileOption & singleFileOption

export interface MenuValue<E = MouseEvent, A extends unknown[] = unknown[]> {
  name: string
  prop?: string
  type?: string
  icon?: menuIcon
  confirm?: string | {
    content: string
    title?: string
    okText?: string
    cancelText?: string
  }
  debounce?: number // 函数防抖，事件触发结束后的N秒才可继续触发
  loading?: boolean | ((...args: A) => boolean)
  disabled?: boolean | ((...args: A) => boolean)
  hidden?: boolean | ((...args: A) => boolean)
  modifiers?: string // 事件修饰符，链式传递，理论上存在.stop.self，实际上.self因为判断问题暂不实现
  click?: (e: E) => void | Promise<unknown> // 返回Promise则根据状态切换loading
  render?: renderType
}

export interface ButtonValue<E = MouseEvent, A extends unknown[] = unknown[]> extends MenuValue<E, A> {
  upload?: (file: File) => Promise<unknown>
  fileOption?: Partial<fileOption<boolean>>
}
