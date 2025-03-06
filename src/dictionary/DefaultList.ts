import DefaultMod, { DefaultModInitOption } from "./DefaultMod"
import DictionaryValue from "../lib/DictionaryValue"

type alignType = 'center' | 'left' | 'right'

export interface DefaultListInitOption extends DefaultModInitOption {
  align?: alignType
  ellipsis?: boolean
}

class DefaultList extends DefaultMod {
  static $name = 'DefaultList'
  static $option = {
    align: 'center' as alignType,
    ellipsis: true
  }
  align: alignType
  ellipsis: boolean
  constructor(initOption: DefaultListInitOption | true, parent?: DictionaryValue, modName?: string) {
    if (initOption === true) {
      initOption = {}
    }
    super(initOption, parent, modName)
    const $constructor = (this.constructor as typeof DefaultList)
    this.align = initOption.align || $constructor.$option.align
    this.ellipsis = initOption.ellipsis ?? $constructor.$option.ellipsis
  }
}

export default DefaultList