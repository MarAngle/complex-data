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
