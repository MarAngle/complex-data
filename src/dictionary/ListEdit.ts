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
  simple?: boolean // 简单构建
}

export interface ListEditInitOption<M extends boolean = boolean> extends DefaultEditInitOption<M> {
  type: 'list'
  option?: Partial<ListEditOption>
}

class ListEdit<M extends boolean = boolean> extends DefaultEdit<M> {
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
    observe?: boolean
  }
  $option: ListEditOption
  constructor(initOption: ListEditInitOption<M>, parent?: DictionaryValue, modName?: string) {
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
