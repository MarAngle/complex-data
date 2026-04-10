import type { PromiseOptionType } from "../module/PromiseData"

export interface ForceValueTriggerType {
  from: string
  action: string
}

export interface ForceValueInitOption {
  data?: boolean
  ing?: boolean
  sync?: boolean
  promise?: PromiseOptionType
  trigger?: ForceValueTriggerType
  module?: {
    pagination?: boolean | { data: number, prop: 'page' | 'size', untriggerLife?: boolean } | { data: { page: number, size: number }, prop: 'pageAndSize', untriggerLife?: boolean }
    choice?: boolean
    sort?: boolean
    [prop: string]: undefined | boolean | string | Record<string, any>
  }
}

class ForceValue {
  data: undefined | boolean
  ing?: boolean
  sync?: boolean
  promise?: PromiseOptionType
  trigger!: ForceValueTriggerType
  module!: {
    pagination?: boolean | { data: number, prop: 'page' | 'size', untriggerLife?: boolean } | { data: { page: number, size: number }, prop: 'pageAndSize', untriggerLife?: boolean }
    choice?: boolean
    sort?: boolean
    [prop: string]: undefined | boolean | string | Record<string, any>
  }
  constructor(initOption: undefined | boolean | ForceValueInitOption | ForceValue, trigger: ForceValueTriggerType) {
    if (!initOption || initOption === true) {
      this.data = initOption
      this.trigger = trigger
      this.module = {}
    } else if (initOption instanceof ForceValue) {
      return initOption
    } else {
      this.data = initOption.data
      this.ing = initOption.ing
      if (this.ing && this.data === undefined) {
        this.data = true
      }
      this.sync = initOption.sync
      this.promise = initOption.promise
      if (initOption.trigger) {
        this.trigger = initOption.trigger
      } else {
        this.trigger = trigger
      }
      this.module = initOption.module || {}
    }
  }
}

export default ForceValue
