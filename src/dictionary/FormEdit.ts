import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DefaultInfo from "./DefaultInfo"
import DictionaryValue from "../lib/DictionaryValue"
import GridParse from "../lib/GridParse"
import ObserveList from "./ObserveList"
import FormValue from "../lib/FormValue"
import DictionaryData from "../module/DictionaryData"

export interface FormEditOption {
  menu?: DefaultInfo[]
  gridParse?: false | GridParse
  observe?: boolean
}

export interface FormEditInitOption<M extends boolean = boolean> extends DefaultEditInitOption<M> {
  type: 'form'
  option?: Partial<FormEditOption>
}

class FormEdit<M extends boolean = boolean> extends DefaultEdit<M> {
  static $name = 'FormEdit'
  type: 'form'
  $runtime: {
    dictionary?: DictionaryData
    dictionaryList?: DictionaryValue[]
    observeList?: ObserveList
    form?: FormValue
    type?: string
    observe?: boolean
  }
  $option: Partial<FormEditOption>
  constructor(initOption: FormEditInitOption<M>, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    this.$runtime = {}
    this.$option = initOption.option || {}
  }
}

export default FormEdit
