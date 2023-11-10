import DefaultMod ,{ DefaultModInitOption } from "./DefaultMod"
import DictionaryValue from "./DictionaryValue"

export interface DefaultItemInitOption extends DefaultModInitOption {
  type: 'item'
  render: unknown
}

class DefaultItem extends DefaultMod {
  static $name = 'DefaultItem'
  type: 'item'
  render: unknown
  constructor(initOption: DefaultItemInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = initOption.type
    this.render = initOption.render
  }
}

export default DefaultItem