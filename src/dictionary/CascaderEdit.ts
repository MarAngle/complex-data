import LoadEdit, { LoadEditInitOption } from "./LoadEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface CascaderEditOption {
  list: Record<PropertyKey, unknown>[]
  optionValue: string
  optionLabel: string
  optionDisabled: string
  optionChildren: string
  hideArrow: boolean
  hideClear: boolean
  autoWidth: boolean
}

export interface CascaderEditInitOption extends LoadEditInitOption {
  type: 'cascader'
  option?: Partial<CascaderEditOption>
}

// 后期考虑子数据的加载
class CascaderEdit extends LoadEdit{
  static $name = 'CascaderEdit'
  static $defaultOption = {
    optionValue: 'value',
    optionLabel: 'label',
    optionDisabled: 'disabled',
    optionChildren: 'children',
    hideArrow: false,
    hideClear: false,
    autoWidth: false
  }
  type: 'cascader'
  $option: CascaderEditOption
  constructor(initOption: CascaderEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof CascaderEdit).$defaultOption
    this.$option = {
      list: option.list || [],
      optionValue: option.optionValue || $defaultOption.optionValue,
      optionLabel: option.optionLabel || $defaultOption.optionLabel,
      optionDisabled: option.optionDisabled || $defaultOption.optionDisabled,
      optionChildren: option.optionChildren || $defaultOption.optionChildren,
      hideArrow: option.hideArrow || $defaultOption.hideArrow,
      hideClear: option.hideClear || $defaultOption.hideClear,
      autoWidth: option.autoWidth || $defaultOption.autoWidth, // 宽度自适应
    }
  }
}

export default CascaderEdit
