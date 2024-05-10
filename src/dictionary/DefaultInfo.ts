import DefaultMod ,{ DefaultModInitOption } from "./DefaultMod"
import DictionaryValue from "../lib/DictionaryValue"

export interface DefaultInfoInitOption extends DefaultModInitOption {
  //
}

class DefaultInfo extends DefaultMod {
  static $name = 'DefaultInfo'
  constructor(initOption: DefaultInfoInitOption | true, parent?: DictionaryValue, modName?: string) {
    if (initOption === true) {
      initOption = {}
    }
    super(initOption, parent, modName)
  }
}

export default DefaultInfo