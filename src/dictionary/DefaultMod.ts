import DefaultSimpleMod ,{ DefaultSimpleModInitOption } from "./DefaultSimpleMod"
import DictionaryValue from "../lib/DictionaryValue"
import { GridOption, createGridOption } from "../lib/GridParse"
import { observeType } from "./ObserveList"

export interface DefaultModInitOption extends DefaultSimpleModInitOption {
  grid?: GridOption
  observe?: observeType
}

class DefaultMod extends DefaultSimpleMod {
  static $name = 'DefaultMod'
  $grid?: GridOption
  $observe?: observeType
  constructor(initOption: DefaultModInitOption | true, parent?: DictionaryValue, modName?: string) {
    if (initOption === true) {
      initOption = {}
    }
    super(initOption, parent, modName)
    this.$grid = createGridOption(initOption.grid)
    this.$observe = initOption.observe
  }
}

export default DefaultMod