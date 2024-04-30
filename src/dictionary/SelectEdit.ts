import PaginationData, { PaginationDataInitOption } from "../module/PaginationData"
import DefaultLoadEdit, { DefaultLoadEditInitOption } from "./DefaultLoadEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface SelectEditOption {
  list: Record<PropertyKey, unknown>[]
  optionValue: string
  optionLabel: string
  optionDisabled: string
  hideArrow: boolean
  hideClear: boolean
  autoWidth: boolean
  emptyOptionContent?: string
}

export interface SelectEditInitOption extends DefaultLoadEditInitOption {
  type: 'select'
  option?: Partial<SelectEditOption>
  pagination?: PaginationDataInitOption
}

class SelectEdit extends DefaultLoadEdit{
  static $name = 'SelectEdit'
  static $defaultOption = {
    optionValue: 'value',
    optionLabel: 'label',
    optionDisabled: 'disabled',
    hideArrow: false,
    hideClear: false,
    autoWidth: false
  }
  type: 'select'
  $option: SelectEditOption
  $pagination?: PaginationData
  constructor(initOption: SelectEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof SelectEdit).$defaultOption
    this.$option = {
      list: option.list || [],
      optionValue: option.optionValue || $defaultOption.optionValue,
      optionLabel: option.optionLabel || $defaultOption.optionLabel,
      optionDisabled: option.optionDisabled || $defaultOption.optionDisabled,
      hideArrow: option.hideArrow || $defaultOption.hideArrow,
      hideClear: option.hideClear || $defaultOption.hideClear,
      autoWidth: option.autoWidth || $defaultOption.autoWidth, // 宽度自适应
      emptyOptionContent: option.emptyOptionContent, // 无数据时文字显示 == 默认不传使用默认模板
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
