import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"
import GridParse from "../lib/GridParse"
import ObserveList from "./ObserveList"
import FormValue from "../lib/FormValue"

export interface CascaderEditInitOption extends DefaultEditInitOption {
  type: 'form' | 'list'
}

class CascaderEdit extends DefaultEdit{
  static $name = 'CascaderEdit'
  $runtime: {
    gridParse?: GridParse
    dictionaryList?: DictionaryValue[]
    observeList?: ObserveList
    form?: FormValue
    type?: string
    observe?: boolean
  }
  constructor(initOption: CascaderEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.$runtime = {}
  }
}

export default CascaderEdit
