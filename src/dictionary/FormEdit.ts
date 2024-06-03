import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DefaultInfo from "./DefaultInfo"
import DictionaryValue from "../lib/DictionaryValue"
import GridParse from "../lib/GridParse"

export interface FormEditOption {
  type?: string
  menu?: DefaultInfo[]
  gridParse?: GridParse
}

export interface FormEditInitOption extends DefaultEditInitOption {
  type: 'form'
  option?: Partial<FormEditOption>
}

class FormEdit extends DefaultEdit{
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
