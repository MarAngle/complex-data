import PaginationData from '../lib/PaginationData'
import PromiseData from '../lib/PromiseData'
import { formatInitOption } from '../utils'
import ModuleData, { ModuleDataInitOption, moduleKeys } from './../lib/ModuleData'
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
  /* --- module start --- */
  $setModule(...args: Parameters<ModuleData['$setData']>) {
    this.$module.$setData(...args)
  }
  $getModule(...args: Parameters<ModuleData['$getData']>) {
    return this.$module.$getData(...args)
  }
  $installModule(...args: Parameters<ModuleData['$installData']>) {
    return this.$module.$installData(...args)
  }
  $uninstallModule(...args: Parameters<ModuleData['$uninstallData']>) {
    return this.$module.$uninstallData(...args)
  }
  /* --- module end --- */
  /* --- status start --- */
  $setStatus(data: string, prop = 'operate', act?: 'init' | 'reset') {
    this.$module.status!.setData(prop, data, act)
  }
  $getStatus(prop = 'operate') {
    return this.$module.status!.getData(prop)
  }
  $resetStatus() {
    this.$module.status!.reset()
  }
  /* --- status end --- */
  /* --- promise start --- */
  $setPromise(...args: Parameters<PromiseData['setData']>) {
    return this.$module.promise!.setData(...args)
  }
  $getPromise(...args: Parameters<PromiseData['getData']>) {
    return this.$module.promise!.getData(...args)
  }
  $triggerPromise(...args: Parameters<PromiseData['triggerData']>) {
    return this.$module.promise!.triggerData(...args)
  }
  /* --- promise end --- */
  /* --- update start --- */
  /* --- update end --- */
  /* --- dictionary start --- */
  /* --- dictionary end --- */
  /* --- pagination start --- */
  $setPageData(data: number, prop?: 'current' | 'size' | 'num', unTriggerLife?: boolean) {
    if (this.$module.pagination) {
      if (prop == 'current') {
        this.$module.pagination.setCurrent(data, unTriggerLife)
      } else if (prop == 'size') {
        this.$module.pagination.setSize(data, unTriggerLife) // { size, page }
      } else if (prop == 'num') {
        this.$module.pagination.setNum(data)
      }
    }
  }
  $getPageData (prop?: Parameters<PaginationData['getData']>[0]) {
    if (this.$module.pagination) {
      return this.$module.pagination.getData(prop)
    }
  }
  $getPageObject (propList?: Parameters<PaginationData['getDataObject']>[0]) {
    if (this.$module.pagination) {
      return this.$module.pagination.getDataObject(propList)
    }
  }
  $setPageCurrentAndSize(...args: Parameters<PaginationData['setCurrentAndSize']>) {
    if (this.$module.pagination) {
      this.$module.pagination.setCurrentAndSize(...args)
    }
  }
  $resetPagination () {
    if (this.$module.pagination) {
      this.$module.pagination.reset()
    }
  }
  /**
   * 设置分页器数据
   * @param {number} data 需要设置的属性值
   * @param {'page' | 'size' | 'num'} [prop = 'page'] 需要设置的参数'page' | 'size' | 'num'
   */
  // $setPageData (data: number, prop?: 'page' | 'size', unTriggerLife?: boolean): void
  // $setPageData (data: number, prop: 'num', unTriggerLife?: boolean): void
  // $setPageData (data: { page: number, size: number }, prop: 'sizeAndPage', unTriggerLife?: boolean): void
  // $setPageData (data: number | { page: number, size: number }, prop: 'page' | 'size' | 'num' | 'sizeAndPage' = 'page', unTriggerLife?: boolean) {
  //   if (this.$module.pagination) {
  //     if (prop == 'page') {
  //       this.$module.pagination.setPage(data as number, unTriggerLife)
  //     } else if (prop == 'size') {
  //       this.$module.pagination.setSize(data as number, unTriggerLife) // { size, page }
  //     } else if (prop == 'sizeAndPage') {
  //       this.$module.pagination.setSizeAndPage(data, unTriggerLife) // { size, page }
  //     } else if (prop == 'num') {
  //       this.$module.pagination.setTotal(data as number)
  //     }
  //   }
  // }
  /* --- pagination end --- */


  $initLoadDepend() {
    if (!this.$module.status) {
      this.$setModule('status', true)
    }
    if (!this.$module.promise) {
      this.$setModule('promise', true)
    }
  }
}

export default BaseData
