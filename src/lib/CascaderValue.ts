import SelectValue, { DefaultSelectValueType, SelectValueInitOption, SelectValueType, checkItem, filterType, getFilter } from "./SelectValue"

export type CascaderValueType<C extends PropertyKey = 'children'> = SelectValueType & {
  [prop in C]?: CascaderValueType<C>[]
}

export type DefaultCascaderValueType<C extends PropertyKey = 'children', V = any> = DefaultSelectValueType<V> & {
  [prop in C]?: DefaultCascaderValueType<C, V>[]
}

export interface CascaderValueInitOption<C extends PropertyKey | undefined = 'children', D extends (C extends PropertyKey ? CascaderValueType<C> : SelectValueType) = (C extends PropertyKey ? DefaultCascaderValueType<C> : DefaultSelectValueType)> extends SelectValueInitOption<D> {
  cascader: C
}

class CascaderValue<C extends PropertyKey | undefined = 'children', D extends (C extends PropertyKey ? CascaderValueType<C> : SelectValueType) = (C extends PropertyKey ? DefaultCascaderValueType<C> : DefaultSelectValueType)> extends SelectValue<D> {
  static $name = 'CascaderValue'
  static $formatConfig = { name: 'CascaderValue', level: 50, recommend: true }
  cascader: C
  constructor(initOption: CascaderValueInitOption<C, D>) {
    super(initOption)
    this.cascader = initOption.cascader
  }
  protected _findItem (list: D[], value: any, prop: keyof D): undefined | D {
    for (let n = 0; n < list.length; n++) {
      const item = list[n]
      if (this.check(value, item[prop])) {
        return item
      } else if (item[this.cascader!]) {
        const child = this._findItem(item[this.cascader!] as D[], value, prop)
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
        if (item[this.cascader!]) {
          this._findItemList(item[this.cascader!] as D[], valueList, prop, result, deep + 1)
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
        if (item[this.cascader!] && index < value.length - 1) {
          this._findList(item[this.cascader!] as D[], value, prop, index + 1, result)
        }
        break
      }
    }
    return result
  }
  protected _filterCascaderList(filter: checkItem<D>, list: D[]) {
    const currentList: D[] = []
    if (this.cascader) {
      list.forEach(item => {
        if (filter(item)) {
          const children = item[this.cascader!] as undefined | D[]
          if (children && children.length > 0) {
            const currentItem = { ...item } as CascaderValueType<NonNullable<C>>
            currentItem[this.cascader as NonNullable<C>] = this._filterCascaderList(filter, children as D[]) as CascaderValueType<NonNullable<C>>[]
          } else {
            currentList.push(item)
          }
        }
      })
    }
    return currentList
  }
  getCascaderList(filter?: checkItem<D> | filterType, hidden?: boolean) {
    if (!filter && (!this.hidden || hidden)) {
      return [...this.list]
    } else {
      return this._filterCascaderList(getFilter(filter, 'filter', hidden, this.hidden)!, this.list)
    }
  }
  // 获取匹配数据且检索子类
  findItem(value: any, prop: keyof D = 'value') {
    return this._findItem(this.list, value, prop) || this.miss
  }
  // 根据值数组获取匹配数组
  findItemList(valueList: any[], prop: keyof D = 'value') {
    return this._findItemList(this.list, valueList, prop, [])
  }
  // 根据值获取匹配相关数组
  findList(value: any, prop: keyof D = 'value') {
    return this._findList(this.list, value, prop)
  }
}

export default CascaderValue
