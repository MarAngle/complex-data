import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"
import { fileOption } from "../../type"

export interface FileEditOption<M extends boolean = false> extends fileOption<M> {}

export interface FileEditInitOption extends DefaultEditInitOption {
  type: 'file'
  option?: Partial<FileEditOption<boolean>>
}

class FileEdit extends DefaultEdit{
  static $name = 'FileEdit'
  static $defaultPlaceholder = function (name: string) {
    return `请上传${name}`
  }
  type: 'file'
  $option: FileEditOption<boolean>
  constructor(initOption: FileEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    this.$option = initOption.option || {}
  }
}

export default FileEdit
