import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"
import { fileOption } from "../type"

export interface DefaultEditFileOption extends fileOption {}

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
    this.$option = initOption.option || {}
  }
}

export default DefaultEditFile
