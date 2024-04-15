import EditData, { EditDataInitOption } from "./EditData"
import DictionaryValue from "../lib/DictionaryValue"

export interface SwitchEditInitOption extends EditDataInitOption {
  type: 'switch'
}

class SwitchEdit extends EditData{
  static $name = 'SwitchEdit'
  type: 'switch'
  constructor(initOption: SwitchEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
  }
}

export default SwitchEdit
