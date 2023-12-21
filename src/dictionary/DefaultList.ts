import DefaultMod, { DefaultModInitOption } from "./DefaultMod"
import DictionaryValue from "../lib/DictionaryValue"
import config from "../../config"

export interface DefaultListInitOption extends DefaultModInitOption {
  align?: 'center' | 'left' | 'right'
  width?: number | string
  ellipsis?: boolean
  auto?: boolean
  show?: DictionaryValue['show']
}

class DefaultList extends DefaultMod {
  static $name = 'DefaultList'
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
    this.width = initOption.width === undefined ? config.dictionary.module.list.width : initOption.width
    this.ellipsis = initOption.ellipsis === undefined ? config.dictionary.module.list.ellipsis : initOption.ellipsis
    this.auto = initOption.auto === undefined ? config.dictionary.module.list.auto : initOption.auto
  }
}

export default DefaultList