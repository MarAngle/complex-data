import CascaderEdit, { CascaderEditInitOption } from "./CascaderEdit"
import DictionaryValue from "../lib/DictionaryValue"
import { MenuValue } from "../../type"

export interface ListEditOption {
  build: false | MenuValue // 头部新增按钮
  delete: false | MenuValue // 列表删除按钮
  index: boolean // 列表是否展示序号
  id?: PropertyKey // 列表id
  tableProps?: Record<PropertyKey, any>
}

export interface ListEditInitOption extends CascaderEditInitOption {
  type: 'list'
  option?: Partial<ListEditOption>
}

class ListEdit extends CascaderEdit{
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
  $option: ListEditOption
  constructor(initOption: ListEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const $defaultOption = (this.constructor as typeof ListEdit).$defaultOption
    this.$option = {
      ...$defaultOption,
      ...initOption.option
    }
  }
}

export default ListEdit
