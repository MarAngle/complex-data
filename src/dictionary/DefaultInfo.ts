import DefaultSimpleMod ,{ DefaultSimpleModInitOption } from "./DefaultSimpleMod"
import DictionaryValue from "../lib/DictionaryValue"

export interface DefaultInfoInitOption extends DefaultSimpleModInitOption {
  //
}

class DefaultInfo extends DefaultSimpleMod {
  static $name = 'DefaultInfo'
  constructor(initOption: DefaultInfoInitOption | true, parent?: DictionaryValue, modName?: string) {
    if (initOption === true) {
      initOption = {}
    }
    super(initOption, parent, modName)
  }
}

export default DefaultInfo