import PaginationData, { PaginationDataInitOption } from "../module/PaginationData"
import DefaultLoadEdit, { DefaultLoadEditInitOption } from "./DefaultLoadEdit"
import DictionaryValue from "../lib/DictionaryValue"
import SelectValue, { DefaultSelectValueType, SelectValueInitOption, SelectValueType } from "../lib/SelectValue"
import CascaderValue, { CascaderValueInitOption, CascaderValueType, DefaultCascaderValueType } from "../lib/CascaderValue"
import SelectData from "../core/SelectData"

export interface SelectEditOption {
  hideArrow?: boolean
  hideClear?: boolean
  autoWidth?: boolean
  open?: boolean
}

export interface SelectEditInitOption<C extends PropertyKey | undefined = undefined, D extends (C extends PropertyKey ? CascaderValueType<C> : SelectValueType) = (C extends PropertyKey ? DefaultCascaderValueType<C> : DefaultSelectValueType)> extends DefaultLoadEditInitOption {
  type: C extends undefined ? 'select' : 'cascader'
  cascader: C
  select?: C extends undefined ? (SelectValueInitOption<D> | SelectValue<D>) : (CascaderValueInitOption<C, D> | CascaderValue<C, D>)
  option?: Partial<SelectEditOption>
  pagination?: PaginationDataInitOption | PaginationData
}

class SelectEdit<C extends PropertyKey | undefined = undefined, D extends (C extends PropertyKey ? CascaderValueType<C> : SelectValueType) = (C extends PropertyKey ? DefaultCascaderValueType<C> : DefaultSelectValueType)> extends DefaultLoadEdit{
  static $name = 'SelectEdit'
  static $defaultPlaceholder = function (name: string) {
    return `请选择${name}`
  }
  static $defaultOption = {
    hideArrow: false,
    hideClear: false,
    autoWidth: false
  }
  type: C extends undefined ? 'select' : 'cascader'
  cascader: C
  $select: C extends undefined ? SelectValue<D> : CascaderValue<C, D>
  $option: SelectEditOption
  $pagination?: PaginationData
  constructor(initOption: SelectEditInitOption<C>, parent?: DictionaryValue, modName?: string) {
    if (initOption.select && initOption.select instanceof SelectData) {
      // 当select为SelectData时，额外初始化
      if (initOption.reload == undefined) {
        initOption.reload = initOption.select.$reload
      }
      if (initOption.pagination == undefined && initOption.select.$pagination) {
        initOption.pagination = initOption.select.$pagination
      }
      if (initOption.getData == undefined) {
        initOption.getData = function(...args) {
          return (initOption.select as unknown as SelectData).loadData(...args)
        }
      }
    }
    super(initOption, parent, modName)
    this.type = initOption.type
    this.cascader = initOption.cascader
    if (this.cascader == undefined) {
      this.$select = (initOption.select ? (initOption.select instanceof SelectValue ? initOption.select : new SelectValue(initOption.select)) : new SelectValue({}))as unknown as (C extends undefined ? SelectValue<D> : CascaderValue<C, D>)
    } else {
      this.$select = (initOption.select ? (initOption.select instanceof CascaderValue ? initOption.select : new CascaderValue(initOption.select as CascaderValueInitOption<C>)) : new CascaderValue({
        cascader: this.cascader
      }))as unknown as (C extends undefined ? SelectValue<D> : CascaderValue<C, D>)
    }
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof SelectEdit).$defaultOption
    this.$option = {
      hideArrow: option.hideArrow || $defaultOption.hideArrow,
      hideClear: option.hideClear || $defaultOption.hideClear,
      autoWidth: option.autoWidth || $defaultOption.autoWidth, // 宽度自适应
      open: option.open
    }
    if (initOption.pagination) {
      this.$pagination = initOption.pagination instanceof PaginationData ? initOption.pagination : new PaginationData(initOption.pagination)
    }
  }
  protected _clearData() {
    this.$select.setList([])
    if (this.$pagination) {
      this.$pagination.reset(true)
    }
  }
}

export default SelectEdit
