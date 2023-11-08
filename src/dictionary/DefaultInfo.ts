import DefaultMod ,{ DefaultModInitOption } from "./DefaultMod"
import DictionaryValue from "./DictionaryValue"

export interface DefaultInfoInitOption extends DefaultModInitOption {
  show?: DictionaryValue['show']
  showType?: string
}

class DefaultInfo extends DefaultMod {
  static $name = 'DefaultInfo'
  showType?: string
  show: DictionaryValue['show']
  constructor(initOption: DefaultInfoInitOption | true, modName?: string, parent?: DictionaryValue) {
    if (initOption === true) {
      initOption = {}
    }
    super(initOption, modName, parent)
    this.$setParent(parent)
    this.show = initOption.show || (parent ? parent.show : undefined)
    this.showType = initOption.showType || (parent ? parent.$getInterfaceValue('showType', modName) : '')
  }
}

export default DefaultInfo