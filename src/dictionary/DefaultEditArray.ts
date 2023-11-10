import DefaultMod ,{ DefaultModInitOption } from "./DefaultMod"
import DictionaryValue, { DictionaryModInitOption, initMod } from "./DictionaryValue"

export interface DefaultEditArrayInitOption extends DefaultModInitOption {
  type: 'array'
  children?: (DictionaryModInitOption | DefaultMod)[]
}

class DefaultEditArray extends DefaultMod {
  static $name = 'DefaultEditArray'
  type: 'array'
  children: DefaultMod[]
  constructor(initOption: DefaultEditArrayInitOption, modName: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = initOption.type
    this.children = []
    if (initOption.children) {
      initOption.children.forEach(itemInitOption => {
        const mod = initMod(modName, itemInitOption)
        if (mod) {
          this.children.push(mod)
        }
      })
    }
  }
}

export default DefaultEditArray