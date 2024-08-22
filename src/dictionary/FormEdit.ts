import CascaderEdit, { CascaderEditInitOption } from "./CascaderEdit"
import DefaultInfo from "./DefaultInfo"
import DictionaryValue from "../lib/DictionaryValue"
import GridParse from "../lib/GridParse"

export interface FormEditOption {
  menu?: DefaultInfo[]
  gridParse?: false | GridParse
}

export interface FormEditInitOption extends CascaderEditInitOption {
  type: 'form'
  option?: Partial<FormEditOption>
}

class FormEdit extends CascaderEdit{
  static $name = 'FormEdit'
  type: 'form'
  $option: Partial<FormEditOption>
  constructor(initOption: FormEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    this.$option = initOption.option || {}
  }
}

export default FormEdit
