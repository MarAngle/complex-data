import SimpleData, { SimpleDataInitOption } from "./SimpleData"

type filterItemType = string | number

export interface SelectListValueType<V = unknown> {
  label: string
  value: V
  $filter?: filterItemType[]
}

export interface SelectListInitOption<D extends SelectListValueType = SelectListValueType<unknown>> extends SimpleDataInitOption {
  list: D[]
  equal?: boolean
  miss?: D | Record<PropertyKey, unknown>
}

export type getListOptionFilterFunction<D> = (item: D) => boolean

export type getListOption<D> = {
  filter?: filterItemType | getListOptionFilterFunction<D>
}

class SelectList<D extends SelectListValueType = SelectListValueType<unknown>> extends SimpleData {
  static $name = 'SelectList'
  list!: D[]
  equal?: boolean
  miss: D | Record<PropertyKey, unknown>
  constructor(initOption: SelectListInitOption<D>) {
    super(initOption)
    this.equal = initOption.equal
    this.miss = initOption.miss ? initOption.miss : {}
    this.setList(initOption.list)
  }
  setList(list: D[]) {
    this.list = list
  }
  getList(option?: getListOption<D>) {
    if (!option) {
      return this.list
    } else {
      const filter = option.filter
      if (!filter) {
        return this.list
      } else {
        const list: D[] = []
        const type = typeof filter
        if (type === 'function') {
          this.list.forEach(item => {
            if ((filter as getListOptionFilterFunction<D>)(item)) {
              list.push(item)
            }
          })
        } else {
          this.list.forEach(item => {
            if (item.$filter && item.$filter.indexOf(filter as filterItemType) > -1) {
              list.push(item)
            }
          })
        }
        return list
      }
    }
  }
  getItem(value: unknown, prop: keyof D = 'value') {
    for (let n = 0; n < this.list.length; n++) {
      const item = this.list[n]
      if (this.check(value, item[prop])) {
        return item
      }
    }
    return this.miss
  }
  check(value: unknown, itemValue: unknown) {
    if (this.equal) {
      return value === itemValue
    } else {
      // eslint-disable-next-line eqeqeq
      return value == itemValue
    }
  }
}

export default SelectList
