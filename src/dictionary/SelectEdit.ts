import DefaultSelectEdit from "./DefaultSelectEdit"
import type { DefaultSelectEditInitOption } from "./DefaultSelectEdit"
import DictionaryValue from "../lib/DictionaryValue"
import type { SelectValueType } from "../lib/SelectValue"
import type { CascaderValueType } from "../lib/CascaderValue"

export interface SelectEditOption {
  hideArrow?: boolean
  hideClear?: boolean
  autoWidth?: boolean
  notFoundContent?: string // 无检索数据的展示逻辑
}

export interface searchInitOption {
  reload?: boolean // 上次检索完成后再次打开时按照上次检索条件展示还是按照无数据重新检索展示
  limit?: number // 限制几个字段开始检索，根据插件实现
  limitContent?: string // 限制情况下的内容展示
  debounce?: number // 防抖
}

export interface searchOption extends searchInitOption {
  operate: boolean
  value: undefined | string
}

export interface SelectEditInitOption<C extends PropertyKey | undefined = undefined, D extends (C extends PropertyKey ? CascaderValueType<C> : SelectValueType) = (C extends PropertyKey ? CascaderValueType<C> : SelectValueType), M extends boolean = boolean> extends DefaultSelectEditInitOption<C, D, M> {
  type: C extends undefined ? 'select' : 'cascader'
  option?: Partial<SelectEditOption>
  search?: searchInitOption
}

class SelectEdit<C extends PropertyKey | undefined = undefined, D extends (C extends PropertyKey ? CascaderValueType<C> : SelectValueType) = (C extends PropertyKey ? CascaderValueType<C> : SelectValueType), M extends boolean = boolean> extends DefaultSelectEdit<C, D, M> {
  static $name = 'SelectEdit'
  static $defaultOption = {
    hideArrow: false,
    hideClear: false,
    autoWidth: false
  }
  type: C extends undefined ? 'select' : 'cascader'
  $option: SelectEditOption
  $search?: searchOption
  constructor(initOption: SelectEditInitOption<C, D, M>, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof SelectEdit).$defaultOption
    this.$option = {
      hideArrow: option.hideArrow || $defaultOption.hideArrow,
      hideClear: option.hideClear || $defaultOption.hideClear,
      autoWidth: option.autoWidth || $defaultOption.autoWidth, // 宽度自适应
      notFoundContent: option.notFoundContent
    }
    if (initOption.search) {
      this.$search = {
        operate: false,
        value: undefined,
        ...initOption.search
      }
    }
  }
  loadData(force?: boolean, ...args: unknown[]) {
    const search = this.$search
    if (search) {
      const value = args[0] as undefined | string
      search.value = value
      if (search.limit && (!value || value.length < search.limit)) {
        return Promise.reject({ status: 'fail', code: 'limit' })
      } else {
        search.operate = true
        const promise = super.loadData(force, ...args)
        promise.finally(() => {
          search.operate = false
        })
        return promise
      }
    } else {
      return super.loadData(force, ...args)
    }
  }
}

export default SelectEdit
