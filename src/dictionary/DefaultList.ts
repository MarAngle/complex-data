import DefaultMod, { DefaultModInitOption } from "./DefaultMod"
import DictionaryValue from "../lib/DictionaryValue"

export interface DefaultListInitOption extends DefaultModInitOption {
  align?: 'center' | 'left' | 'right'
  width?: number | string
  ellipsis?: boolean
  auto?: boolean
  show?: DictionaryValue['show']
}

class DefaultList extends DefaultMod {
  static $name = 'DefaultList'
  static $option = {
    width: 100,
    ellipsis: true,
    auto: true
  }
  align: 'center' | 'left' | 'right'
  width?: number | string
  ellipsis: boolean
  auto: boolean
  show: DictionaryValue['show']
  constructor(initOption: DefaultListInitOption | true, parent?: DictionaryValue, modName?: string) {
    if (initOption === true) {
      initOption = {}
    }
    super(initOption, parent, modName)
    this.show = initOption.show || (parent ? parent.show : undefined)
    this.align = initOption.align || 'center'
    this.width = initOption.width === undefined ? DefaultList.$option.width : initOption.width
    this.ellipsis = initOption.ellipsis === undefined ? DefaultList.$option.ellipsis : initOption.ellipsis
    this.auto = initOption.auto === undefined ? DefaultList.$option.auto : initOption.auto
  }
}

export default DefaultList