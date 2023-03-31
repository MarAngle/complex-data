

// import config from "../../config";
import DictionaryData from "../lib/DictionaryData";
import DefaultEdit from "./DefaultEdit";
import DefaultInfo from "./DefaultInfo";
import DefaultList from "./DefaultList";

interface DictionaryModInitOption {
  name?: string
  local?: Record<PropertyKey, any>
}

class DictionaryMod{
  static $name = 'DictionaryMod'
  [prop: string]: DefaultList | DefaultInfo | DefaultEdit
  constructor(initOption: DictionaryModInitOption | true, modName: string, parent: DictionaryData) {
    if (initOption === true) {
      initOption = {}
    }
    super()
  }
}

export default DictionaryMod