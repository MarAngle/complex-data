import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import { DefaultEditButtonOption } from "./DefaultEditButton"
import DictionaryValue from "../lib/DictionaryValue"

export interface uploadFileDataType {
  data: string
  name: string
  url?: string
}

export interface DefaultEditFileOption {
  accept?: string
  size?: number
  upload?: (file: File | File[]) => Promise<{ file: uploadFileDataType | uploadFileDataType[] }>
  layout?: string
  multiple?: {
    min?: number
    max?: number
    append?: boolean
  }
  button?: {
    name?: DefaultEditButtonOption['name']
    type?: DefaultEditButtonOption['type']
    icon?: DefaultEditButtonOption['icon']
  }
}

export interface DefaultEditFileInitOption extends DefaultEditInitOption {
  type: 'file'
  option?: Partial<DefaultEditFileOption>
}

class DefaultEditFile extends DefaultEdit{
  static $name = 'DefaultEditFile'
  type: 'file'
  $option: DefaultEditFileOption
  constructor(initOption: DefaultEditFileInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    this.$option = option
  }
}

export default DefaultEditFile
