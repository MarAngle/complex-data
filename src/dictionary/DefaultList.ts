import DefaultMod, { DefaultModInitOption } from "./DefaultMod"
import DictionaryValue from "../lib/DictionaryValue"

export interface DefaultListInitOption extends DefaultModInitOption {
  align?: 'center' | 'left' | 'right'
  ellipsis?: boolean
  auto?: boolean
  show?: DictionaryValue['show']
}

class DefaultList extends DefaultMod {
  static $name = 'DefaultList'
  static $option = {
    ellipsis: true,
    auto: true
  }
  align: 'center' | 'left' | 'right'
  ellipsis: boolean
  auto: boolean
  show: DictionaryValue['show']
  constructor(initOption: DefaultListInitOption | true, parent?: DictionaryValue, modName?: string) {
    if (initOption === true) {
      initOption = {}
    }
    super(initOption, parent, modName)
    const $constructor = (this.constructor as typeof DefaultList)
    this.show = initOption.show || (parent ? parent.show : undefined)
    this.align = initOption.align || 'center'
    this.ellipsis = initOption.ellipsis === undefined ? $constructor.$option.ellipsis : initOption.ellipsis
    this.auto = initOption.auto === undefined ? $constructor.$option.auto : initOption.auto
  }
}

export default DefaultList