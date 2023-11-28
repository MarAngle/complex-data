import Data from "../data/Data"

type filterType = string | number

export interface SelectValueType<V = unknown> {
  label: string
  value: V
  $filter?: filterType[]
  [prop: PropertyKey]: unknown
}

export interface SelectValueInitOption<D extends SelectValueType = SelectValueType> {
  list?: D[]
  equal?: boolean
  miss?: Record<PropertyKey, unknown>
}

class SelectValue<D extends SelectValueType = SelectValueType> extends Data {
  list: D[]
  equal?: boolean
  miss: Record<PropertyKey, unknown>
  constructor(initOption: SelectValueInitOption<D>) {
    super()
    this.list = initOption.list || []
    this.equal = initOption.equal
    this.miss = initOption.miss || {}
  }
  setList(list: D[]) {
    this.list = list || []
  }
  getList(filter?: ((item: D) => boolean) | filterType) {
    if (!filter) {
      return this.list
    } else {
      const list: D[] = []
      if (typeof filter === 'function') {
        this.list.forEach(item => {
          if (filter(item)) {
            list.push(item)
          }
        })
      } else {
        this.list.forEach(item => {
          if (item.$filter && item.$filter.indexOf(filter) > -1) {
            list.push(item)
          }
        })
      }
      return list
    }
  }
  get(value: unknown, prop: keyof D = 'value') {
    for (let n = 0; n < this.list.length; n++) {
      const item = this.list[n]
      if (this.check(value, item[prop])) {
        return item
      }
    }
    return this.miss
  }
  check(value: unknown, itemValue: unknown) {
    if (!this.equal) {
      // eslint-disable-next-line eqeqeq
      return value == itemValue
    } else {
      return value === itemValue
    }
  }
}

export default SelectValue
