import DefaultEdit from "./DefaultEdit"
import type { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"
import type { fileOption, multipleFileOption } from "../../type"

export type FileEditOption<M extends boolean = boolean> = fileOption<M>

export interface FileEditInitOption<M extends boolean = boolean> extends DefaultEditInitOption<M> {
  type: 'file'
  option?: FileEditOption<boolean>
}

class FileEdit<M extends boolean = boolean> extends DefaultEdit<M> {
  static $name = 'FileEdit'
  static $width = undefined
  static $defaultPlaceholder = function (name: string) {
    return `请上传${name}`
  }
  type: 'file'
  $option: FileEditOption<M>
  constructor(initOption: FileEditInitOption<M>, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    if (this.multiple && !(option as multipleFileOption).multiple) {
      (option as multipleFileOption).multiple = {}
    }
    this.$option = option as FileEditOption<M>
    if (this.$option.image && this.$option.accept === undefined) {
      this.$option.accept = 'image/*'
    }
  }
}

export default FileEdit
