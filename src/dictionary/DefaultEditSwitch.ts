import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface DefaultEditSwitchInitOption extends DefaultEditInitOption {
  type: 'switch'
}

class DefaultEditSwitch extends DefaultEdit{
  static $name = 'DefaultEditSwitch'
  type: 'switch'
  constructor(initOption: DefaultEditSwitchInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
  }
}

export default DefaultEditSwitch
