import { loadFunctionType } from "../data/BaseData"
import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"
import { DataWithSimpleLoad, StatusItem, StatusValue } from "../module/StatusData"

export interface DefaultLoadEditInitOption<M extends boolean = boolean> extends DefaultEditInitOption<M> {
  reload?: boolean
  getData?: loadFunctionType
}

class DefaultLoadEdit<M extends boolean = boolean> extends DefaultEdit<M> implements Partial<DataWithSimpleLoad>{
  static $name = 'DefaultLoadEdit'
  $load?: StatusItem
  $reload?: boolean
  $getData?: loadFunctionType
  constructor(initOption: DefaultLoadEditInitOption<M>, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    if (initOption.getData) {
      this.$load = new StatusItem('load')
      this.$reload = initOption.reload
      this.$getData = initOption.getData
    }
  }
  /* --- status start --- */
  getLoad() {
    return this.$load!.getCurrent()
  }
  setLoad(...args: Parameters<StatusItem['setCurrent']>) {
    return this.$load!.setCurrent(...args)
  }
  /* --- status end --- */
  loadData(force?: boolean, ...args: unknown[]) {
    if (this.$getData) {
      if (force == undefined) {
        force = this.$reload
      }
      if (this.getLoad() !== StatusValue.success || force) {
        this.setLoad(StatusValue.ing)
        const promise = this.$getData(...args)
        promise.then(() => {
          this.setLoad(StatusValue.success)
        }).catch(() => {
          this.setLoad(StatusValue.fail)
        })
        return promise
      } else {
        return Promise.resolve({ status: this.getLoad() })
      }
    } else {
      return Promise.resolve({ status: 'success' })
    }
  }
}

export default DefaultLoadEdit
