import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import { DefaultEditButtonOption } from "./DefaultEditButton"
import DictionaryValue from "../lib/DictionaryValue"

export interface uploadFileDataType {
  data: string
  name: string
  url?: string
}

export interface DefaultEditFileOption {
  type?: string
  icon?: DefaultEditButtonOption['icon']
  accept?: string
  multipleAppend: boolean
  max: number
  min: number
  size: number
  upload?: ((file: File) => Promise<{ file: uploadFileDataType }>) | ((file: File[]) => Promise<{ file: uploadFileDataType[] }>)
  layout: string
}

export interface DefaultEditFileInitOption extends DefaultEditInitOption {
  type: 'file'
  option?: Partial<DefaultEditFileOption>
}

class DefaultEditFile extends DefaultEdit{
  static $name = 'DefaultEditFile'
  static $defaultOption = {
    multipleAppend: false,
    layout: 'auto'
  }
  type: 'file'
  $option: DefaultEditFileOption
  constructor(initOption: DefaultEditFileInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof DefaultEditFile).$defaultOption
    this.$option = {
      type: option.type,
      icon: option.icon,
      accept: option.accept,
      multipleAppend: option.multipleAppend === undefined ? $defaultOption.multipleAppend : option.multipleAppend,
      max: option.max || 0,
      min: option.min || 0,
      size: option.size || 0,
      upload: option.upload,
      layout: option.layout === undefined ? $defaultOption.layout : option.layout,
    }
  }
}

export default DefaultEditFile
