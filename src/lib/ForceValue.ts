import { PromiseOptionType } from "../module/PromiseData"

export interface ForceValueInitOption {
  data?: boolean
  ing?: boolean
  sync?: boolean
  promise?: PromiseOptionType
  trigger?: {
    from: string
    action?: string
  }
  module?: {
    [prop: string]: undefined | boolean | Record<string, any>
  }
}

class ForceValue {
  data: undefined | boolean
  ing?: boolean
  sync?: boolean
  promise?: PromiseOptionType
  trigger?: {
    from: string
    action?: string
  }
  module!: {
    pagination?: boolean | { data: number, prop: 'page' | 'size', untriggerLife?: boolean } | { data: { page: number, size: number }, prop: 'pageAndSize', untriggerLife?: boolean }
    choice?: boolean
    [prop: string]: undefined | boolean | string | Record<string, any>
  }
  constructor(initOption?: boolean | ForceValueInitOption | ForceValue) {
    if (!initOption || initOption === true) {
      this.data = initOption
      this.module = {}
    } else if (initOption instanceof ForceValue) {
      return initOption
    } else {
      this.data = initOption.data
      this.ing = initOption.ing
      this.sync = initOption.sync
      this.promise = initOption.promise
      if (initOption.trigger) {
        this.trigger = initOption.trigger
      }
      this.module = initOption.module || {}
    }
  }
}

export default ForceValue
