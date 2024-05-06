import PaginationData, { PaginationDataInitOption } from "../module/PaginationData"
import DefaultLoadEdit, { DefaultLoadEditInitOption } from "./DefaultLoadEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface SelectEditOption<C extends( undefined | PropertyKey) = undefined> {
  list: Record<PropertyKey, any>[]
  cascader: C
  optionValue: string
  optionLabel: string
  optionDisabled: string
  hideArrow: boolean
  hideClear: boolean
  autoWidth: boolean
}

export interface SelectEditInitOption<C extends( undefined | PropertyKey) = undefined> extends DefaultLoadEditInitOption {
  type: C extends PropertyKey ? 'cascader' : 'select'
  option?: Partial<SelectEditOption<C>>
  pagination?: PaginationDataInitOption
}

class SelectEdit<C extends( undefined | PropertyKey) = undefined> extends DefaultLoadEdit{
  static $name = 'SelectEdit'
  static $defaultOption = {
    optionValue: 'value',
    optionLabel: 'label',
    optionDisabled: 'disabled',
    cascader: 'children',
    hideArrow: false,
    hideClear: false,
    autoWidth: false
  }
  type: C extends PropertyKey ? 'cascader' : 'select'
  $option: SelectEditOption<C>
  $pagination?: PaginationData
  constructor(initOption: SelectEditInitOption<C>, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof SelectEdit).$defaultOption
    this.$option = {
      list: option.list || [],
      cascader: option.cascader || $defaultOption.cascader as C,
      optionValue: option.optionValue || $defaultOption.optionValue,
      optionLabel: option.optionLabel || $defaultOption.optionLabel,
      optionDisabled: option.optionDisabled || $defaultOption.optionDisabled,
      hideArrow: option.hideArrow || $defaultOption.hideArrow,
      hideClear: option.hideClear || $defaultOption.hideClear,
      autoWidth: option.autoWidth || $defaultOption.autoWidth, // 宽度自适应
    }
    if (initOption.pagination) {
      this.$pagination = new PaginationData(initOption.pagination)
    }
  }
  protected _clearData() {
    this.$option.list = []
    if (this.$pagination) {
      this.$pagination.reset(true)
    }
  }
}

export default SelectEdit
