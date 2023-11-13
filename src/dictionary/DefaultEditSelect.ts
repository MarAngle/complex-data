import PaginationData, { PaginationDataInitOption } from "../module/PaginationData"
import DefaultLoadEdit, { DefaultLoadEditInitOption } from "./DefaultLoadEdit"
import DictionaryValue from "./DictionaryValue"

export interface DefaultEditSelectOption {
  list: Record<PropertyKey, unknown>[]
  optionValue: string
  optionLabel: string
  optionDisabled: string
  hideArrow: boolean
  hideClear: boolean
  autoWidth: boolean
  emptyOptionContent?: string
}

export interface DefaultEditSelectInitOption extends DefaultLoadEditInitOption {
  type: 'select'
  option?: Partial<DefaultEditSelectOption>
  pagination?: PaginationDataInitOption
}

class DefaultEditSelect extends DefaultLoadEdit{
  static $name = 'DefaultEditSelect'
  static $defaultOption = {
    optionValue: 'value',
    optionLabel: 'label',
    optionDisabled: 'disabled',
    hideArrow: false,
    hideClear: false,
    autoWidth: false
  }
  type: 'select'
  $option: DefaultEditSelectOption
  $pagination?: PaginationData
  constructor(initOption: DefaultEditSelectInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = initOption.type
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof DefaultEditSelect).$defaultOption
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
      this.$pagination.$reset(true)
    }
  }
}

export default DefaultEditSelect
