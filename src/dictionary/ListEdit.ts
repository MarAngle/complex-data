import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"
import { MenuValue } from "../../type"
import ObserveList from "./ObserveList"
import DictionaryData from "../module/DictionaryData"
import FormValue from "../lib/FormValue"

export interface ListEditOption {
  build: false | MenuValue // 头部新增按钮
  delete: false | MenuValue // 列表删除按钮
  index: boolean // 列表是否展示序号
  id?: PropertyKey // 列表id
  tableProps?: Record<PropertyKey, any>
  observe?: boolean
}

export interface ListEditInitOption extends DefaultEditInitOption {
  type: 'list'
  option?: Partial<ListEditOption>
}

class ListEdit extends DefaultEdit{
  static $name = 'ListEdit'
  static $indexKey = Symbol('index')
  static $defaultOption = {
    build: {
      name: '新增',
      prop: 'build',
      type: 'primary',
      icon: 'plus'
    },
    delete: {
      name: '删除',
      prop: 'delete',
      type: 'danger',
    },
    index: true
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
