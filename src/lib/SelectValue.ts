import Data from "../data/Data"

export type filterType = string | number

export type checkItem<D extends SelectValueType> = (item: D) => boolean

export interface SelectValueType {
  [prop: PropertyKey]: unknown
}

export interface DefaultSelectValueType<V = any> extends SelectValueType {
  label: string
  value: V
  disabled?: boolean
  color?: string
  filter?: filterType[]
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
        if(item[filterProp] && (item[filterProp] as filterType[]).indexOf(filterValue) > -1) {
          return true
        } else {
          return false
        }
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
    for (let n = 0; n < list.length; n++) {
      const item = list[n]
      if (this.check(value, item[prop])) {
        return item
      }
    }
  }
  protected _filterList(filter: checkItem<D>, list: D[]) {
    const currentList: D[] = []
    list.forEach(item => {
      if (filter(item)) {
        currentList.push(item)
      }
    })
    return currentList
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
  // 获取匹配数据，cascade为真则说明检索子类
  getItem(value: any, prop?: keyof D) {
    if (!prop) {
      prop = 'value'
    }
    return this._getItem(this.list, value, prop) || this.miss
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
