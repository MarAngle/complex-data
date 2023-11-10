import DefaultMod ,{ DefaultModInitOption } from "./DefaultMod"
import DictionaryValue from "./DictionaryValue"

export interface DefaultEditItemInitOption extends DefaultModInitOption {
  type: 'item'
  render: unknown
}

class DefaultEditItem extends DefaultMod {
  static $name = 'DefaultEditItem'
  type: 'item'
  render: unknown
  constructor(initOption: DefaultEditItemInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = initOption.type
    this.render = initOption.render
  }
}

export default DefaultEditItem