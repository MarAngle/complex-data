import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "./DictionaryValue"

export interface DefaultEditSwitchInitOption extends DefaultEditInitOption {
  type: 'switch'
}

class DefaultEditSwitch extends DefaultEdit{
  static $name = 'DefaultEditSwitch'
  type: 'switch'
  constructor(initOption: DefaultEditSwitchInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = initOption.type
  }
}

export default DefaultEditSwitch
