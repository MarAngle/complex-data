import DefaultMod from "./DefaultMod"
import type { DefaultModInitOption } from "./DefaultMod"
import DictionaryValue from "../lib/DictionaryValue"
import type { GridOption } from "../lib/GridParse"
import { createGridOption } from "../lib/GridParse"
import type { observeType } from "./ObserveList"

export interface DefaultInfoInitOption extends DefaultModInitOption {
  colon?: boolean
  grid?: GridOption
  observe?: observeType
}

class DefaultInfo extends DefaultMod {
  static $name = 'DefaultInfo'
  colon: boolean
  $grid?: GridOption
  $observe?: observeType
  constructor(initOption: DefaultInfoInitOption | true, parent?: DictionaryValue, modName?: string) {
    if (initOption === true) {
      initOption = {}
    }
    super(initOption, parent, modName)
    this.colon = initOption.colon ?? true
    this.$grid = createGridOption(initOption.grid)
    if (initOption.observe) {
      this.$observe = initOption.observe
    }
  }
}

export default DefaultInfo