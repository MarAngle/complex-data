import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"
import { MenuValue } from "../../type"
import ObserveList from "./ObserveList"
import DictionaryData from "../module/DictionaryData"
import FormValue from "../lib/FormValue"

export interface ListEditOption {
  header?: MenuValue[]
  menu?: Record<string, MenuValue>
  tableProps?: Record<PropertyKey, any>
  observe?: boolean
}

export interface ListEditInitOption extends DefaultEditInitOption {
  type: 'list'
  option?: Partial<ListEditOption>
}

class ListEdit extends DefaultEdit {
  static $name = 'ListEdit'
  static $indexKey = Symbol('index')
  static $defaultOption = {
    header: [
      {
        name: '新增',
        prop: '$build',
        type: 'primary',
        icon: 'build'
      }
    ],
    menu: {
      $delete: {
        name: '删除',
        prop: '$delete',
        type: 'danger',
        icon: 'delete'
      }
    }
  } as ListEditOption
  type: 'list'
  $runtime: {
    dictionary?: DictionaryData
    dictionaryList?: DictionaryValue[]
    observeList?: ObserveList
    formList?: FormValue[]
    type?: string
  }
  $option: ListEditOption
  constructor(initOption: ListEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    this.$runtime = {}
    const $defaultOption = (this.constructor as typeof ListEdit).$defaultOption
    this.$option = {
      ...$defaultOption,
      ...initOption.option
    }
  }
}

export default ListEdit
