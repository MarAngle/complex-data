import Data from "../data/Data"

export type filterType = string | number

export type checkItem<D extends SelectValueType> = (item: D) => boolean

export interface SelectValueType {
  [prop: PropertyKey]: unknown
}

export interface DefaultSelectValueType<V = unknown> extends SelectValueType {
  label: string
  value: V
  disabled?: boolean
  filter?: filterType[]
}

export interface SelectValueInitOption<D extends SelectValueType = DefaultSelectValueType> {
  list?: D[]
  dict: {
    value?: string
    label?: string
    disabled?: string
    filter?: string
  }
  hidden?: string
  cascade?: string
  option?: {
    equal?: boolean
  }
  miss?: Record<PropertyKey, unknown>
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

class SelectValue<D extends SelectValueType = DefaultSelectValueType> extends Data {
  static $name = 'SelectValue'
  static dictValue = 'value'
  static dictLabel = 'label'
  static dictDisabled = 'disabled'
  static dictFilter = '$filter'
  list: D[]
  $dict: {
    value: string
    label: string
    disabled: string
    filter: string
  }
  hidden?: string
  cascade?: string
  $option: {
    equal?: boolean
  }
  miss?: Record<PropertyKey, unknown>
  constructor(initOption: SelectValueInitOption<D>) {
    super()
    this.list = initOption.list || []
    const dict = initOption.dict || {}
    const $constructor = (this.constructor as typeof SelectValue)
    this.$dict = {
      value: dict.value || $constructor.dictValue,
      label: dict.label || $constructor.dictLabel,
      disabled: dict.disabled || $constructor.dictDisabled,
      filter: dict.filter || $constructor.dictFilter
    }
    this.$option = initOption.option || {}
    this.hidden = initOption.hidden
    this.cascade = initOption.cascade
    this.miss = initOption.miss
  }
  setList(list: D[]) {
    this.list = list || []
  }
  getList({ filter, hidden }: { filter?: checkItem<D> | filterType, hidden?: boolean } = {}) {
    if (!filter && (!this.hidden || hidden)) {
      return [...this.list]
    } else {
      const mainFilter = getFilter(filter, this.$dict.filter, hidden, this.hidden)!
      const list: D[] = []
      this.list.forEach(item => {
        if (mainFilter(item)) {
          list.push(item)
        }
      })
      return list
    }
  }
  protected _getItem(list: D[], value: unknown, prop: keyof D, cascade?: string): D | undefined {
    for (let n = 0; n < list.length; n++) {
      const item = list[n]
      if (this.check(value, item[prop])) {
        return item
      } else if (cascade && item[cascade]) {
        const child = this._getItem(item[cascade] as D[], value, prop, cascade)
        if (child) {
          return child
        }
      }
    }
  }
  get(value: unknown, prop?: keyof D) {
    if (!prop) {
      prop = this.$dict.value
    }
    return this._getItem(this.list, value, prop, this.cascade) || this.miss
  }
  check(value: unknown, itemValue: unknown) {
    if (!this.$option.equal) {
      // eslint-disable-next-line eqeqeq
      return value == itemValue
    } else {
      return value === itemValue
    }
  }
}

export default SelectValue
