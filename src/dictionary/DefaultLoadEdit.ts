import { DataWithLoad, loadFunctionType } from "../data/BaseData"
import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"
import { StatusItem, StatusValue } from "../module/StatusData"

export interface DefaultLoadEditInitOption extends DefaultEditInitOption {
  reload?: boolean
  getData?: loadFunctionType
}

class DefaultLoadEdit extends DefaultEdit implements Partial<DataWithLoad>{
  static $name = 'DefaultLoadEdit'
  $status?: StatusItem
  $reload?: boolean
  $getData?: loadFunctionType
  constructor(initOption: DefaultLoadEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    if (initOption.getData) {
      this.$status = new StatusItem('load')
      this.$reload = initOption.reload
      this.$getData = initOption.getData
    }
  }
  /* --- status start --- */
  getStatus() {
    return this.$status!.getCurrent()
  }
  setStatus(...args: Parameters<StatusItem['setCurrent']>) {
    return this.$status!.setCurrent(...args)
  }
  /* --- status end --- */
  loadData(force?: boolean, ...args: unknown[]) {
    if (this.$getData) {
      if (force === undefined) {
        force = this.$reload
      }
      if (this.getStatus() !== StatusValue.success || force) {
        return new Promise((resolve, reject) => {
          this.setStatus(StatusValue.ing)
          this.$getData!(...args).then(res => {
            this.setStatus(StatusValue.success)
            resolve(res)
          }).catch(err => {
            this.setStatus(StatusValue.fail)
            reject(err)
          })
        })
      } else {
        return Promise.resolve({ status: this.getStatus() })
      }
    } else {
      return Promise.resolve({ status: 'success' })
    }
  }
}

export default DefaultLoadEdit
