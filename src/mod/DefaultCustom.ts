
// import config from "../../config";
import Data from "../data/Data";
import DictionaryData from "../lib/DictionaryData";
import { ObserveItem } from "./ObserveList";

export interface DefaultCustomInitOption {
  observe?: ObserveItem['$observe']
  [prop: PropertyKey]: any
}

class DefaultCustom extends Data<DictionaryData> implements ObserveItem{
  static $name = 'DefaultCustom'
  declare parent: DictionaryData
  prop: string
  local: Record<PropertyKey, any>
  $observe?: ObserveItem['$observe']
  constructor(initOption: DefaultCustomInitOption | true, modName: string, parent: DictionaryData) {
    if (initOption === true) {
      initOption = {}
    }
    super()
    this.$setParent(parent)
    this.prop = parent.$prop
    this.local = initOption || {}
    this.$observe = initOption.observe
  }
}

export default DefaultCustom