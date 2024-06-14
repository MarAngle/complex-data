import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"
import { fileOption } from "../../type"

export type FileEditOption<M extends boolean = false> = fileOption<M>

export interface FileEditInitOption extends DefaultEditInitOption {
  type: 'file'
  option?: Partial<FileEditOption<boolean>>
}

const defaultUpload = function(file: File) {
  return Promise.resolve({ file: { data: file, name: file.name } })
}

const defaultMultipleUpload = function(fileList: File[]) {
  return Promise.resolve({ file: fileList.map(file => { return {data: file, name: file.name} } ) })
}

class FileEdit<M extends boolean = false> extends DefaultEdit<M> {
  static $name = 'FileEdit'
  static $defaultPlaceholder = function (name: string) {
    return `请上传${name}`
  }
  type: 'file'
  $option: FileEditOption<M>
  constructor(initOption: FileEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    if (!option.upload) {
      option.upload = !this.multiple ?  defaultUpload : defaultMultipleUpload
    }
    this.$option = option as FileEditOption<M>
  }
}

export default FileEdit
