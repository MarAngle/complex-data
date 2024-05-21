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

export type CascadeValueType<C extends PropertyKey = 'children'> = SelectValueType & {
  [prop in C]?: CascadeValueType<C>[]
}

export type DefaultCascadeValueType<C extends PropertyKey = 'children', V = any> = DefaultSelectValueType<V> & {
  [prop in C]?: DefaultCascadeValueType<C, V>[]
}

export interface SelectValueInitOption<C extends PropertyKey | undefined = undefined, D extends (C extends PropertyKey ? CascadeValueType<C> : SelectValueType) = (C extends PropertyKey ? DefaultCascadeValueType<C> : DefaultSelectValueType)> {
  cascade: C
  list?: D[]
  hidden?: string
  equal?: boolean
  miss?: D
}

function checkItemHidden<D extends SelectValueType>(item: D, hiddenProp: string) {
  return !item[hiddenProp]
}

function getFilter<D extends SelectValueType>(filter: undefined | checkItem<D> | filterType, filterProp: string, hidden: undefined | boolean, hiddenProp: undefined | string) {
  const filterHidden = hiddenProp && !hidden
  if (filter) {
    if (typeof filter !== 'function') {
      const filterValue = filter
      filter = function(item: D) {
        if(item[filterProp] && (item[filterProp] as filterType[]).indexOf(filterValue)) {
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
        return checkItemHidden(item, hiddenProp) && (filter as checkItem<D>)(item)
      }
    }
  } else if (filterHidden) {
    return function(item: D) {
      return checkItemHidden(item, hiddenProp)
    }
  }
}

class SelectValue<C extends PropertyKey | undefined = undefined, D extends (C extends PropertyKey ? CascadeValueType<C> : SelectValueType) = (C extends PropertyKey ? DefaultCascadeValueType<C> : DefaultSelectValueType)> extends Data {
  static $name = 'SelectValue'
  static $formatConfig = { name: 'SelectValue', level: 50, recommend: true }
  cascade: C
  list: D[]
  hidden?: string
  equal?: boolean
  miss?: D
  constructor(initOption: SelectValueInitOption<C, D>) {
    super()
    this.cascade = initOption.cascade
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
  protected _getItem (list: D[], value: any, prop: keyof D, cascade?: boolean): undefined | D {
    for (let n = 0; n < list.length; n++) {
      const item = list[n]
      if (this.check(value, item[prop])) {
        return item
      } else if (cascade && this.cascade && item[this.cascade]) {
        const child = this._getItem(item[this.cascade] as D[], value, prop)
        if (child) {
          // 函数内部已经push，此时不需要做额外操作
          return child
        }
      }
    }
  }
  protected _getCascadeItemList(list: D[], valueList: any[], prop: keyof D, result: D[] = [], deep = 0): D[] {
    // 当前深度>=数组长度时，说明此时已经超过需要检索的深度，直接返回
    if (this.cascade && deep < valueList.length) {
      const currentValue = valueList[deep]
      const item = this._getItem(list, currentValue, prop)
      if (item) {
        result.push(item)
        if (item[this.cascade]) {
          this._getCascadeItemList(item[this.cascade] as D[], valueList, prop, result, deep + 1)
        }
      }
    }
    return result
  }
  protected _getCascadeList(list: D[], value: any[], prop: keyof D, index = 0, result: D[] = []): D[] {
    if (this.cascade) {
      const currentValue = value[index]
      for (let n = 0; n < list.length; n++) {
        const item = list[n]
        if (this.check(currentValue, item[prop])) {
          result.push(item)
          if (item[this.cascade] && index < value.length - 1) {
            this._getCascadeList(item[this.cascade] as D[], value, prop, index + 1, result)
          }
          break
        }
      }
    }
    return result
  }
  setList(list: D[]) {
    this.list = list || []
  }
  getList({ filter, hidden }: { filter?: checkItem<D> | filterType, hidden?: boolean } = {}) {
    if (!filter && (!this.hidden || hidden)) {
      return [...this.list]
    } else {
      const mainFilter = getFilter(filter, 'filter', hidden, this.hidden)!
      const list: D[] = []
      this.list.forEach(item => {
        if (mainFilter(item)) {
          list.push(item)
        }
      })
      return list
    }
  }
  // 获取匹配数据，cascade为真则说明检索子类
  getItem(value: any, prop?: keyof D, cascade?: boolean) {
    if (!prop) {
      prop = 'value'
    }
    return this._getItem(this.list, value, prop, cascade) || this.miss
  }
  // 获取匹配数据且检索子类
  getCascadeItem(value: any, prop?: keyof D) {
    if (!prop) {
      prop = 'value'
    }
    return this._getItem(this.list, value, prop, true) || this.miss
  }
  // 根据值数组获取匹配数组
  getCascadeItemList(valueList: any[], prop?: keyof D) {
    if (!prop) {
      prop = 'value'
    }
    return this._getCascadeItemList(this.list, valueList, prop, [])
  }
  // 根据值获取匹配相关数组
  getCascadeList(value: any, prop?: keyof D) {
    if (!prop) {
      prop = 'value'
    }
    return this._getCascadeList(this.list, value, prop)
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
