import PaginationData, { PaginationDataInitOption } from "../module/PaginationData"
import DefaultLoadEdit, { DefaultLoadEditInitOption } from "./DefaultLoadEdit"
import DictionaryValue from "../lib/DictionaryValue"
import SelectValue, { DefaultSelectValueType, SelectValueInitOption, SelectValueType } from "../lib/SelectValue"
import CascaderValue, { CascaderValueInitOption, CascaderValueType, DefaultCascaderValueType } from "../lib/CascaderValue"
import SelectData from "../core/SelectData"


export interface DefaultSelectEditInitOption<C extends PropertyKey | undefined = undefined, D extends (C extends PropertyKey ? CascaderValueType<C> : SelectValueType) = (C extends PropertyKey ? DefaultCascaderValueType<C> : DefaultSelectValueType), M extends boolean = boolean> extends DefaultLoadEditInitOption<M> {
  cascader: C
  select?: C extends undefined ? (SelectValueInitOption<D> | SelectValue<D>) : (CascaderValueInitOption<C, D> | CascaderValue<C, D>)
  pagination?: PaginationDataInitOption | PaginationData
}

class DefaultSelectEdit<C extends PropertyKey | undefined = undefined, D extends (C extends PropertyKey ? CascaderValueType<C> : SelectValueType) = (C extends PropertyKey ? DefaultCascaderValueType<C> : DefaultSelectValueType), M extends boolean = boolean> extends DefaultLoadEdit<M> {
  static $name = 'DefaultSelectEdit'
  static $defaultPlaceholder = function (name: string) {
    return `请选择${name}`
  }
  cascader: C
  $select: C extends undefined ? SelectValue<D> : CascaderValue<C, D>
  $pagination?: PaginationData
  constructor(initOption: DefaultSelectEditInitOption<C, D, M>, parent?: DictionaryValue, modName?: string) {
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
    this.cascader = initOption.cascader
    if (this.cascader == undefined) {
      this.$select = (initOption.select ? (initOption.select instanceof SelectValue ? initOption.select : new SelectValue(initOption.select)) : new SelectValue({}))as unknown as (C extends undefined ? SelectValue<D> : CascaderValue<C, D>)
    } else {
      this.$select = (initOption.select ? (initOption.select instanceof CascaderValue ? initOption.select : new CascaderValue(initOption.select as CascaderValueInitOption<C>)) : new CascaderValue({
        cascader: this.cascader
      })) as unknown as (C extends undefined ? SelectValue<D> : CascaderValue<C, D>)
    }
    if (initOption.pagination) {
      this.$pagination = initOption.pagination instanceof PaginationData ? initOption.pagination : new PaginationData(initOption.pagination)
    }
  }
  $clearData() {
    this.$select.setList([])
    if (this.$pagination) {
      this.$pagination.reset(true)
    }
  }
}

export default DefaultSelectEdit
