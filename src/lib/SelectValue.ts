import Data from "../data/Data"

export type filterType = string | number

export type checkItem<D extends SelectValueType> = (item: D) => boolean

export interface SelectValueType {
  [prop: PropertyKey]: any
}

export interface DefaultSelectValueType<V = any> {
  label: string
  value: V
  disabled?: boolean
  color?: string
  filter?: filterType[]
  [prop: PropertyKey]: any
}

export interface SelectValueInitOption<D extends SelectValueType = DefaultSelectValueType> {
  list?: D[]
  hidden?: string
  equal?: boolean
  miss?: D
}

function checkItemByHidden<D extends SelectValueType>(item: D, hiddenProp: keyof D) {
  return !item[hiddenProp]
}

export function getFilter<D extends SelectValueType>(filter: undefined | checkItem<D> | filterType, filterProp: keyof D, hidden?: boolean, hiddenProp?: keyof D) {
  const filterHidden = hiddenProp && !hidden // 存在hidden属性且hidden为否，则需要过滤hidden属性
  if (filter) {
    if (typeof filter !== 'function') {
      const filterValue = filter
      filter = function(item: D) {
        return item[filterProp] && (item[filterProp] as filterType[]).includes(filterValue)
      }
    }
    if (!filterHidden) {
      return filter
    } else {
      return function(item: D) {
        return checkItemByHidden(item, hiddenProp) && (filter as checkItem<D>)(item)
      }
    }
  } else if (filterHidden) {
    return function(item: D) {
      return checkItemByHidden(item, hiddenProp)
    }
  }
}

class SelectValue<D extends SelectValueType = DefaultSelectValueType> extends Data {
  static $name = 'SelectValue'
  static $formatConfig = { name: 'SelectValue', level: 50, recommend: true }
  list: D[]
  hidden?: keyof D
  equal?: boolean
  miss?: D
  constructor(initOption: SelectValueInitOption<D>) {
    super()
    this.list = initOption.list || []
    if (this.equal) {
      this.equal = initOption.equal
    }
    if (this.hidden) {
      this.hidden = initOption.hidden
    }
    if (this.miss) {
      this.miss = initOption.miss
    }
  }
  protected _getItem (list: D[], value: any, prop: keyof D): undefined | D {
    return list.find(item => this.check(value, item[prop]))
  }
  protected _getIndex (list: D[], value: any, prop: keyof D): number {
    return list.findIndex(item => this.check(value, item[prop]))
  }
  protected _filterList(filter: checkItem<D>, list: D[]) {
    return list.filter(filter)
  }
  setList(list: D[]) {
    this.list = list || []
  }
  // hidden为真时显示hidden数据，否则不显示
  getList(filter?: checkItem<D> | filterType, hidden?: boolean) {
    if (!filter && (!this.hidden || hidden)) {
      // 无过滤条件且(不存在hidden属性/存在hidden属性且hidden为真)，直接返回list
      return [...this.list]
    } else {
      return this._filterList(getFilter(filter, 'filter', hidden, this.hidden)!, this.list)
    }
  }
  // 获取匹配数据，cascader为真则说明检索子类
  getItem(value: any, prop: keyof D = 'value') {
    return this._getItem(this.list, value, prop) || this.miss
  }
  getIndex(value: any, prop: keyof D = 'value') {
    return this._getIndex(this.list, value, prop)
  }
  getItemByIndex(index: number): undefined | D {
    return this.list[index]
  }
  getItemByOffset(value: any, offset = 1, prop: keyof D = 'value') {
    return this.getItemByIndex(this.getIndex(value, prop) + offset)
  }
  check(value: any, itemValue: any) {
    if (!this.equal) {
      // eslint-disable-next-line eqeqeq
      return value == itemValue
    } else {
      return value === itemValue
    }
  }
}

export default SelectValue
