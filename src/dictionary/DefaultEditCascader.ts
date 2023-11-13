import DefaultLoadEdit, { DefaultLoadEditInitOption } from "./DefaultLoadEdit"
import DictionaryValue from "./DictionaryValue"

export interface DefaultEditCascaderOption {
  list: Record<PropertyKey, unknown>[]
  optionValue: string
  optionLabel: string
  optionDisabled: string
  optionChildren: string
  hideArrow: boolean
  hideClear: boolean
  autoWidth: boolean
}

export interface DefaultEditCascaderInitOption extends DefaultLoadEditInitOption {
  type: 'cascader'
  option?: Partial<DefaultEditCascaderOption>
}

// 后期考虑子数据的加载
class DefaultEditCascader extends DefaultLoadEdit{
  static $name = 'DefaultEditCascader'
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
  $option: DefaultEditCascaderOption
  constructor(initOption: DefaultEditCascaderInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = initOption.type
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof DefaultEditCascader).$defaultOption
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

export default DefaultEditCascader
