import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DefaultInfo from "./DefaultInfo"
import DictionaryValue from "../lib/DictionaryValue"
import GridParse from "../lib/GridParse"
import ObserveList from "./ObserveList"
import FormValue from "../lib/FormValue"

export interface FormEditOption {
  menu?: DefaultInfo[]
  gridParse?: false | GridParse
}

export interface FormEditInitOption extends DefaultEditInitOption {
  type: 'form'
  option?: Partial<FormEditOption>
}

class FormEdit extends DefaultEdit{
  static $name = 'FormEdit'
  type: 'form'
  $runtime: {
    gridParse?: GridParse
    dictionaryList?: DictionaryValue[]
    observeList?: ObserveList
    form?: FormValue
    type?: string
    observe?: boolean
  }
  $option: Partial<FormEditOption>
  constructor(initOption: FormEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    this.$runtime = {}
    this.$option = initOption.option || {}
  }
}

export default FormEdit
