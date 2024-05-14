// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type renderType<ARGS extends any[] = any[], RES = any> = (...args: ARGS) => RES

export type menuIcon = string | (() => any)

export interface fileDataType {
  data: string
  name: string
  url?: string
}

export interface fileOption {
  accept?: string
  size?: number
  upload?: (file: File | File[]) => Promise<{ file: fileDataType | fileDataType[] }>
  layout?: string
  complex?: boolean
  multiple?: {
    min?: number
    max?: number
    append?: boolean
  }
  button?: {
    name?: string
    type?: string
    icon?: menuIcon
  }
}

export interface MenuValue<E = MouseEvent, A extends unknown[] = unknown[]> {
  name: string
  prop?: string
  type?: string
  icon?: menuIcon
  loading?: boolean | ((...args: A) => boolean)
  disabled?: boolean | ((...args: A) => boolean)
  click?: (e: E) => void | Promise<unknown> // 返回Promise则根据状态切换loading
  render?: renderType
}

export interface ButtonValue<E = MouseEvent, A extends unknown[] = unknown[]> extends MenuValue<E, A> {
  upload?: (file: File) => Promise<unknown>
  fileOption?: Partial<fileOption>
}
