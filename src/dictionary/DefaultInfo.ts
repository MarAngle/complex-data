import DefaultMod ,{ DefaultModInitOption } from "./DefaultMod"
import DictionaryValue from "../lib/DictionaryValue"

export interface DefaultInfoInitOption extends DefaultModInitOption {
  show?: DictionaryValue['show']
}

class DefaultInfo extends DefaultMod {
  static $name = 'DefaultInfo'
  show: DictionaryValue['show']
  constructor(initOption: DefaultInfoInitOption | true, parent?: DictionaryValue, modName?: string) {
    if (initOption === true) {
      initOption = {}
    }
    super(initOption, parent, modName)
    this.$setParent(parent)
    this.show = initOption.show || (parent ? parent.show : undefined)
  }
}

export default DefaultInfo