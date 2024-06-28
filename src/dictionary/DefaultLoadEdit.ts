import { loadFunctionType } from "../data/BaseData"
import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"
import { DataWithSimpleLoad, StatusItem, StatusValue } from "../module/StatusData"

export interface DefaultLoadEditInitOption extends DefaultEditInitOption {
  reload?: boolean
  getData?: loadFunctionType
}

class DefaultLoadEdit extends DefaultEdit implements Partial<DataWithSimpleLoad>{
  static $name = 'DefaultLoadEdit'
  $load?: StatusItem
  $reload?: boolean
  $getData?: loadFunctionType
  constructor(initOption: DefaultLoadEditInitOption, parent?: DictionaryValue, modName?: string) {
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
        return new Promise((resolve, reject) => {
          this.setLoad(StatusValue.ing)
          this.$getData!(...args).then(res => {
            this.setLoad(StatusValue.success)
            resolve(res)
          }).catch(err => {
            this.setLoad(StatusValue.fail)
            reject(err)
          })
        })
      } else {
        return Promise.resolve({ status: this.getLoad() })
      }
    } else {
      return Promise.resolve({ status: 'success' })
    }
  }
}

export default DefaultLoadEdit
