import DefaultMod, { DefaultModInitOption } from "./DefaultMod"
import DictionaryValue from "../lib/DictionaryValue"

export interface DefaultListInitOption extends DefaultModInitOption {
  align?: 'center' | 'left' | 'right'
  ellipsis?: boolean
}

class DefaultList extends DefaultMod {
  static $name = 'DefaultList'
  static $option = {
    ellipsis: true
  }
  align: 'center' | 'left' | 'right'
  ellipsis: boolean
  constructor(initOption: DefaultListInitOption | true, parent?: DictionaryValue, modName?: string) {
    if (initOption === true) {
      initOption = {}
    }
    super(initOption, parent, modName)
    const $constructor = (this.constructor as typeof DefaultList)
    this.align = initOption.align || 'center'
    this.ellipsis = initOption.ellipsis == undefined ? $constructor.$option.ellipsis : initOption.ellipsis
  }
}

export default DefaultList