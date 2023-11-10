import DefaultMod ,{ DefaultModInitOption } from "./DefaultMod"
import DictionaryValue, { DictionaryModInitOption, initMod } from "./DictionaryValue"

export interface DefaultArrayInitOption extends DefaultModInitOption {
  type: 'array'
  children?: (DictionaryModInitOption | DefaultMod)[]
}

class DefaultArray extends DefaultMod {
  static $name = 'DefaultArray'
  type: 'array'
  children: DefaultMod[]
  constructor(initOption: DefaultArrayInitOption, modName: string, parent?: DictionaryValue) {
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

export default DefaultArray