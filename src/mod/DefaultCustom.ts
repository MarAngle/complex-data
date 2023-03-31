
// import config from "../../config";
import DictionaryData from "../lib/DictionaryData";

export interface DefaultCustomInitOption {
  [prop: PropertyKey]: any
}

class DefaultCustom {
  static $name = 'DefaultCustom'
  prop: string
  local: Record<PropertyKey, any>
  constructor(initOption: DefaultCustomInitOption | true, modName: string, parent: DictionaryData) {
    if (initOption === true) {
      initOption = {}
    }
    this.prop = parent.$prop
    this.local = initOption || {}
  }
}

export default DefaultCustom