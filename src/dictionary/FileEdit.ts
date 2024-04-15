import EditData, { EditDataInitOption } from "./EditData"
import DictionaryValue from "../lib/DictionaryValue"
import { fileOption } from "../type"

export interface FileEditOption extends fileOption {}

export interface FileEditInitOption extends EditDataInitOption {
  type: 'file'
  option?: Partial<FileEditOption>
}

class FileEdit extends EditData{
  static $name = 'FileEdit'
  type: 'file'
  $option: FileEditOption
  constructor(initOption: FileEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    this.$option = initOption.option || {}
  }
}

export default FileEdit
