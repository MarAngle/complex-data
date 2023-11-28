import Data from "../data/Data"

export type filterType = string | number

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
  option?: {
    cascade?: boolean
    equal?: boolean
  }
  miss?: Record<PropertyKey, unknown>
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
  $option: {
    cascade?: boolean
    equal?: boolean
  }
  miss: Record<PropertyKey, unknown>
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
          if (item[this.$dict.filter] && (item[this.$dict.filter] as filterType[]).indexOf(filter) > -1) {
            list.push(item)
          }
        })
      }
      return list
    }
  }
  get(value: unknown, prop?: keyof D) {
    if (!prop) {
      prop = this.$dict.value
    }
    for (let n = 0; n < this.list.length; n++) {
      const item = this.list[n]
      if (this.check(value, item[prop])) {
        return item
      }
    }
    return this.miss
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
