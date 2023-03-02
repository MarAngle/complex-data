import PaginationData from '../lib/PaginationData'
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
  $setPromise(prop: string, promisedata: Promise<any>) {
    return this.$module.promise!.setData(prop, promisedata)
  }
  $getPromise(prop: string) {
    return this.$module.promise!.getData(prop)
  }
  $triggerPromise(prop: string, option = {}) {
    return this.$module.promise!.triggerData(prop, option)
  }
  /* --- promise end --- */
  /* --- update start --- */
  /* --- update end --- */
  /* --- dictionary start --- */
  /* --- dictionary end --- */
  /* --- pagination start --- */
  $getPageData (prop?: Parameters<PaginationData['getData']>[0]) {
    let data
    if (this.$module.pagination) {
      if (prop) {
        data = this.$module.pagination.getData(prop)
      } else {
        data = this.$module.pagination.getData()
      }
    }
    return data
  }
  $resetPagination () {
    if (this.$module.pagination) {
      this.$module.pagination.reset()
    }
  }
  $setPageData(data: number, prop?: 'page' | 'size' | 'num', unTriggerLife?: boolean) {
    if (this.$module.pagination) {
      if (prop == 'page') {
        this.$module.pagination.setPage(data as number, unTriggerLife)
      } else if (prop == 'size') {
        this.$module.pagination.setSize(data as number, unTriggerLife) // { size, page }
      } else if (prop == 'num') {
        this.$module.pagination.setTotal(data as number)
      }
    }
  }
  $setPageSize
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
      this.$setModule('status')
    }
    if (!this.$module.promise) {
      this.$setModule('promise')
    }
  }
}

export default BaseData
