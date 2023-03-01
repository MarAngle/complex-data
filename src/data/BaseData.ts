import { formatInitOption } from '../utils'
import ModuleData from './../lib/ModuleData'
import DefaultData, { DefaultDataInitOption } from "./DefaultData"

type promiseFunction = (...args:any[]) => Promise<any>

export interface BaseDataInitOption extends DefaultDataInitOption {
  module?: ModuleDataInitOption,
  getData?: promiseFunction
}

class BaseData extends DefaultData {
  static $name = 'BaseData'
  $module: ModuleData
  $getData?: promiseFunction
  constructor(initOption: BaseDataInitOption) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('BaseData', 'beforeCreate', initOption)
    this.$module = new ModuleData(initOption.module, this)
    this.$getData = initOption.getData
    if (this.$getData) {
      this.$initLoadDepend()
    }
    this.$triggerCreateLife('BaseData', 'created', initOption)
  }
  $setModule(modName: moduleKeys, data?: any) {
    this.$module.$setData(modName, data)
  }
  $getModule(modName: moduleKeys) {
    return this.$module.$getData(modName)
  }
  $installModule(modName: moduleKeys, data: any) {
    return this.$module.$installData(modName, data)
  }
  $uninstallModule(modName: moduleKeys) {
    return this.$module.$uninstallData(modName)
  }
  $initLoadDepend() {
    if (!this.$module.status) {
      this.$setModule('status')
    }
    if (!this.$module.promise) {
      this.$setModule('promise')
    }
  }
}

export default BaseData
