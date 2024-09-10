import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface SwitchEditInitOption extends DefaultEditInitOption {
  type: 'switch'
}

class SwitchEdit extends DefaultEdit {
  static $name = 'SwitchEdit'
  static $width = 50
  type: 'switch'
  constructor(initOption: SwitchEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
  }
}

export default SwitchEdit
