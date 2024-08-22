import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DefaultMod from "./DefaultMod"
import DictionaryValue, { DictionaryModInitOption } from "../lib/DictionaryValue"
import { ButtonValue } from "../../type"

export interface ListEditOption {
  build: boolean | ButtonValue // 头部新增按钮
  delete: boolean | ButtonValue // 列表删除按钮
  index: boolean // 列表是否展示序号
}

export interface ListEditInitOption extends DefaultEditInitOption {
  type: 'list'
  list: (DictionaryModInitOption | DefaultMod)[]
  option?: Partial<ListEditOption>
}

class ListEdit extends DefaultEdit{
  static $name = 'ListEdit'
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
  $list: DefaultMod[]
  $option: ListEditOption
  constructor(initOption: ListEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    this.$list = []
    initOption.list.forEach(item => {
      const mod = DictionaryValue.$initMod(item)
      if (mod) {
        this.$list.push(mod)
      }
    })
    const $defaultOption = (this.constructor as typeof ListEdit).$defaultOption
    this.$option = {
      ...$defaultOption,
      ...initOption.option
    }
  }
}

export default ListEdit
