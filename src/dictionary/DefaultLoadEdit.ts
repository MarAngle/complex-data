import { loadFunctionType } from "../data/BaseData"
import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "./DictionaryValue"

export interface DefaultLoadEditInitOption extends DefaultEditInitOption {
  reload?: boolean
  getData?: loadFunctionType
}

class DefaultLoadEdit extends DefaultEdit{
  static $name = 'DefaultLoadEdit'
  $load?: {
    status: 'un' | 'ing' | 'success' | 'fail'
    reload?: boolean
  }
  $getData?: loadFunctionType
  constructor(initOption: DefaultLoadEditInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    if (initOption.getData) {
      this.$getData = initOption.getData
      this.$load = {
        status: 'un',
        reload: initOption.reload
      }
    }
  }
  $loadData(force?: boolean, ...args: unknown[]) {
    if (this.$getData) {
      if (force === undefined) {
        force = this.$load!.reload
      }
      if (this.$load!.status !== 'success' || force) {
        return new Promise((resolve, reject) => {
          this.$load!.status = 'ing'
          this.$getData!(...args).then(res => {
            this.$load!.status = 'success'
            resolve(res)
          }).catch(err => {
            this.$load!.status = 'fail'
            reject(err)
          })
        })
      } else {
        return Promise.resolve({ status: this.$load!.status })
      }
    } else {
      return Promise.reject({ status: 'fail', code: 'getData is not exist', msg: '未定义getData函数！' })
    }
  }
}

export default DefaultLoadEdit
