import SelectValue, { DefaultSelectValueType, SelectValueInitOption, SelectValueType, checkItem, filterType, getFilter } from "./SelectValue"

export type CascadeValueType<C extends PropertyKey = 'children'> = SelectValueType & {
  [prop in C]?: CascadeValueType<C>[]
}

export type DefaultCascadeValueType<C extends PropertyKey = 'children', V = any> = DefaultSelectValueType<V> & {
  [prop in C]?: DefaultCascadeValueType<C, V>[]
}

export interface CascadeValueInitOption<C extends PropertyKey = 'children', D extends CascadeValueType<C> = DefaultCascadeValueType<C>> extends SelectValueInitOption<D> {
  cascade: C
}

class CascadeValue<C extends PropertyKey = 'children', D extends CascadeValueType<C> = DefaultCascadeValueType<C>> extends SelectValue<D> {
  static $name = 'CascadeValue'
  static $formatConfig = { name: 'CascadeValue', level: 50, recommend: true }
  cascade: C
  constructor(initOption: CascadeValueInitOption<C, D>) {
    super(initOption)
    this.cascade = initOption.cascade
  }
  protected _findItem (list: D[], value: any, prop: keyof D): undefined | D {
    for (let n = 0; n < list.length; n++) {
      const item = list[n]
      if (this.check(value, item[prop])) {
        return item
      } else if (item[this.cascade]) {
        const child = this._findItem(item[this.cascade] as D[], value, prop)
        if (child) {
          return child
        }
      }
    }
  }
  protected _findItemList(list: D[], valueList: any[], prop: keyof D, result: D[] = [], deep = 0): D[] {
    // 当前深度>=数组长度时，说明此时已经超过需要检索的深度，直接返回
    if (deep < valueList.length) {
      const currentValue = valueList[deep]
      const item = this._getItem(list, currentValue, prop)
      if (item) {
        result.push(item)
        if (item[this.cascade]) {
          this._findItemList(item[this.cascade] as D[], valueList, prop, result, deep + 1)
        }
      }
    }
    return result
  }
  protected _findList(list: D[], value: any[], prop: keyof D, index = 0, result: D[] = []): D[] {
    const currentValue = value[index]
    for (let n = 0; n < list.length; n++) {
      const item = list[n]
      if (this.check(currentValue, item[prop])) {
        result.push(item)
        if (item[this.cascade] && index < value.length - 1) {
          this._findList(item[this.cascade] as D[], value, prop, index + 1, result)
        }
        break
      }
    }
    return result
  }
  protected _filterCascadeList(filter: checkItem<D>, list: D[]) {
    const currentList: D[] = []
    list.forEach(item => {
      if (filter(item)) {
        const children = item[this.cascade]
        if (children && children.length > 0) {
          const currentItem = { ...item }
          currentItem[this.cascade] = this._filterCascadeList(filter, children as D[]) as unknown as D[C]
        } else {
          currentList.push(item)
        }
      }
    })
    return currentList
  }
  getCascadeList(filter?: checkItem<D> | filterType, hidden?: boolean) {
    if (!filter && (!this.hidden || hidden)) {
      return [...this.list]
    } else {
      return this._filterCascadeList(getFilter(filter, 'filter', hidden, this.hidden)!, this.list)
    }
  }
  // 获取匹配数据且检索子类
  findItem(value: any, prop?: keyof D) {
    if (!prop) {
      prop = 'value'
    }
    return this._findItem(this.list, value, prop) || this.miss
  }
  // 根据值数组获取匹配数组
  findItemList(valueList: any[], prop?: keyof D) {
    if (!prop) {
      prop = 'value'
    }
    return this._findItemList(this.list, valueList, prop, [])
  }
  // 根据值获取匹配相关数组
  findList(value: any, prop?: keyof D) {
    if (!prop) {
      prop = 'value'
    }
    return this._findList(this.list, value, prop)
  }
}

export default CascadeValue
