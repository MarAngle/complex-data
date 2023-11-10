import { resetFromOption } from "../module/ChoiceData"
import { PromiseOptionType } from "../module/PromiseData"

export interface ForceValueInitOption {
  data?: boolean
  ing?: boolean
  sync?: boolean
  promise?: PromiseOptionType
  module?: {
    [prop: string]: undefined | boolean | Record<string, unknown>
  }
}

class ForceValue {
  data: undefined | boolean
  ing?: boolean
  sync?: boolean
  promise?: PromiseOptionType
  module!: {
    pagination?: boolean | { data: number, prop: 'page' | 'size', untriggerLife?: boolean } | { data: { page: number, size: number }, prop: 'pageAndSize', untriggerLife?: boolean }
    choice?: boolean | string | resetFromOption
    [prop: string]: undefined | boolean | string | Record<string, unknown>
  }
  constructor(initOption?: boolean | ForceValueInitOption | ForceValue) {
    if (!initOption || initOption === true) {
      this.data = initOption
      this.module = {}
    } else if (initOption.constructor !== ForceValue) {
      this.data = initOption.data
      this.ing = initOption.ing
      this.sync = initOption.sync
      this.promise = initOption.promise
      this.module = initOption.module || {}
    } else {
      return initOption
    }
  }
}

export default ForceValue
