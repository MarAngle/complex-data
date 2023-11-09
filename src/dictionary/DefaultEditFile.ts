import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "./DictionaryValue"

export interface DefaultEditFileOption {
  accept?: string
  multipleAppend: boolean
  max: number
  min: number
  size: number
  upload?: (file: File) => Promise<{ data: { name: string, url: string, data: string } }>
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
  constructor(initOption: DefaultEditFileInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = 'file'
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof DefaultEditFile).$defaultOption
    this.$option = {
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
