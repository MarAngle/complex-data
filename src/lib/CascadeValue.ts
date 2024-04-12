import SelectValue, { DefaultSelectValueType, SelectValueInitOption, SelectValueType } from "./SelectValue"

export type CascadeValueType<C extends PropertyKey = 'children'> = SelectValueType & {
  [prop in C]?: CascadeValueType<C>[]
}

export type DefaultCascadeValueType<V = any, C extends PropertyKey = 'children'> = DefaultSelectValueType<V> & {
  [prop in C]?: DefaultCascadeValueType<V, C>[]
}

export interface CascadeValueInitOption<C extends PropertyKey = 'children', V extends CascadeValueType<C> = DefaultCascadeValueType<C>> extends SelectValueInitOption<V> {
  cascade: C
}

class CascadeValue<C extends PropertyKey = 'children', D extends CascadeValueType<C> = DefaultCascadeValueType<C>> extends SelectValue<D> {
  static $name = 'CascadeValue'
  cascade: C
  constructor(initOption: CascadeValueInitOption<C, D>) {
    super(initOption)
    this.cascade = initOption.cascade
  }
  // 重构：实现
  protected _getCascadeItem(list: D[], prop: keyof D, value: any, result: D[]): D[] {
    for (let n = 0; n < list.length; n++) {
      const item = list[n]
      if (this.check(value, item[prop])) {
        result.push(item)
        break
      } else if (item[this.cascade]) {
        const child = this._getCascadeItem(item[this.cascade] as D[], prop, value, result)
        if (child) {
          // 函数内部已经push，此时不需要做额外操作
          break
        }
      }
    }
    return result
  }
  getCascadeItem(value: any, prop?: keyof D) {
    if (!prop) {
      prop = this.$dict.value
    }
    return this._getCascadeItem(this.list, prop, value, []) || this.miss
  }
}

export default CascadeValue
