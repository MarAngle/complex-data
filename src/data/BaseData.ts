import { getProp, isPromise } from 'complex-utils'
import PaginationData from '../lib/PaginationData'
import PromiseData, { PromiseOptionType } from '../lib/PromiseData'
import StatusData from '../lib/StatusData'
import { triggerCallBackType } from '../lib/StatusItem'
import { formatInitOption } from '../utils'
import ModuleData, { ModuleDataInitOption } from './../lib/ModuleData'
import DefaultData, { DefaultDataInitOption } from "./DefaultData"

export interface forceObjectType {
  correct?: PromiseOptionType['correct']
  [prop: string]: undefined | boolean | string
}

export type forceType = boolean | forceObjectType

type promiseFunction = (...args: any[]) => Promise<any>

export interface ReloadOptionType {
  [prop: string]: undefined | boolean
}
export type ReloadOption = undefined | boolean | ReloadOptionType

export interface BaseDataInitOption extends DefaultDataInitOption {
  module?: ModuleDataInitOption,
  $getData?: promiseFunction
}

// type MethodExtract<T, U, M extends keyof T> = M extends (T[M] extends U ? M : never ) ? M : never

class BaseData extends DefaultData {
  static $name = 'BaseData'
  static $promiseList = ['$getData']
  $module: ModuleData
  $getData?: promiseFunction
  constructor(initOption: BaseDataInitOption) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('BaseData', 'beforeCreate', initOption)
    this.$module = new ModuleData(initOption.module, this)
    this.$getData = initOption.$getData
    if (this.$getData) {
      this.$initLoadDepend()
    }
    this.$triggerCreateLife('BaseData', 'created', initOption)
  }
  /**
   * 将第一个传参的第一个参数无值时转换为空对象
   * @param {*[]} args 参数列表
   */
  static formatResetOption(args: any[]) {
    if (!args[0]) {
      args[0] = {}
    }
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
  $getStatusItem(...args: Parameters<StatusData['getItem']>) {
    return this.$module.status!.getItem(...args)
  }
  $setStatus(...args: Parameters<StatusData['setData']>) {
    this.$module.status!.setData(...args)
  }
  $getStatus(...args: Parameters<StatusData['getCurrent']>) {
    return this.$module.status!.getCurrent(...args)
  }
  $getStatusData(...args: Parameters<StatusData['getData']>) {
    return this.$module.status!.getData(...args)
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
  $getPageData(prop?: Parameters<PaginationData['getData']>[0]) {
    if (this.$module.pagination) {
      return this.$module.pagination.getData(prop)
    }
  }
  $getPageObject(propList?: Parameters<PaginationData['getDataObject']>[0]) {
    if (this.$module.pagination) {
      return this.$module.pagination.getDataObject(propList)
    }
  }
  $setPageCurrentAndSize(...args: Parameters<PaginationData['setCurrentAndSize']>) {
    if (this.$module.pagination) {
      this.$module.pagination.setCurrentAndSize(...args)
    }
  }
  $resetPagination() {
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

  /* --- choice start --- */
  /* --- choice end --- */

  /* --- search start --- */
  /* --- search end --- */

  /* --- load start --- */
  $initLoadDepend() {
    if (!this.$module.status) {
      this.$setModule('status', true)
    }
    if (!this.$module.promise) {
      this.$setModule('promise', true)
    }
  }
  $triggerGetData(...args: any[]) {
    const promise = this.$triggerMethodByStatusWidthOperate(['$getData', args, 'load', false, (target, res) => {
      if (target == 'start') {
        this.$triggerLife('beforeLoad', this, ...args)
      } else if (target == 'success') {
        this.$triggerLife('loaded', this, {
          res: res,
          args: args
        })
      } else {
        this.$triggerLife('loadFail', this, {
          res: res,
          args: args
        })
      }
    }])
    return this.$setPromise('load', promise)
  }
  $loadData(force?: forceType, ...args: any[]) {
    if (force === true) {
      force = {}
    }
    const loadStatus = this.$getStatus('load')
    if (loadStatus == 'un' || loadStatus == 'fail') {
      this.$triggerGetData(...args)
    } else if (loadStatus == 'ing') {
      // 直接then
      if (force && force.ing) {
        this.$triggerGetData(...args)
      }
    } else if (loadStatus == 'end') {
      if (force) {
        this.$triggerGetData(...args)
      }
    }
    return this.$triggerPromise('load', {
      errmsg: this.$createMsg(`promise模块无load数据(load状态:${loadStatus})`),
      correct: force ? force.correct : undefined
    })
  }
  $reloadData(option: ReloadOption, ...args: any[]) {
    switch (typeof option) {
      case 'boolean':
        option = {
          force: option
        }
        break;
      case 'object':
        break;
      default:
        option = {}
        break;
    }
    this.$triggerLife('beforeReload', this, option, ...args)
    // 同步判断值
    const sync = option.sync
    const force = option.force === undefined ? {} : option.force
    const promise = this.$loadData(force, ...args)
    if (sync) {
      promise.then((res: any) => {
        // 触发生命周期重载完成事件
        this.$triggerLife('reloaded', this, {
          res: res,
          args: args
        })
      }, (err: any) => {
        console.error(err)
        // 触发生命周期重载失败事件
        this.$triggerLife('reloadFail', this, {
          res: err,
          args: args
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        promise.then((res: any) => {
          // 触发生命周期重载完成事件
          this.$triggerLife('reloaded', this, {
            res: res,
            args: args
          })
          resolve(res)
        }, (err: any) => {
          console.error(err)
          // 触发生命周期重载失败事件
          this.$triggerLife('reloadFail', this, {
            res: err,
            args: args
          })
          reject(err)
        })
      })
    }
  }
  $triggerMethodByStatus(method: string, args: any[] = [], statusProp: string, strict?: boolean, triggerCallBack?: triggerCallBackType) {
    const statusItem = this.$getStatusItem(statusProp)
    if (statusItem) {
      if (statusItem.triggerChange('start', strict, triggerCallBack)) {
        const next = this.$runMethod(method, args)
        if (next.promise) {
          return new Promise((resolve, reject) => {
            next.promise!.then((res: unknown) => {
              statusItem.triggerChange('success', false, triggerCallBack, [res])
              resolve(res)
            }).catch(error => {
              statusItem.triggerChange('fail', false, triggerCallBack, [error])
              reject(error)
            })
          })
        } else {
          this.$exportMsg(next.msg)
          return Promise.reject({ status: 'fail', code: next.code })
        }
      } else {
        this.$exportMsg(`当前${statusProp}状态为:${statusItem.getCurrent()}，$triggerPromiseByStatus函数在严格校验下不允许被触发！`)
        return Promise.reject({ status: 'fail', code: 'status clash' })
      }
    } else {
      this.$exportMsg(`${statusProp}状态不存在，$triggerPromiseByStatus函数失败！`)
      return Promise.reject({ status: 'fail', code: 'no status' })
    }
  }
  $runMethod(method: string, args: any[]) {
    const next: {
      promise: null | Promise<any>,
      msg: string,
      code: string
    } = {
      promise: null,
      msg: '',
      code: ''
    }
    switch (typeof method) {
      case 'string':
        if ((this as unknown as any)[method]) {
          if (typeof ((this as unknown as any)[method]) === 'function') {
            next.promise = (this as unknown as any)[method](...args)
          } else {
            next.msg = `${method}属性非函数类型，$runMethod函数触发失败！`
            next.code = 'not function'
          }
        } else {
          next.msg = `不存在${method}函数，$runMethod函数触发失败！`
          next.code = 'no method'
        }
        break;
      // case 'function':
      //   next.promise = method(...args)
      //   break;
      default:
        next.msg = `method参数接受string，当前值为${method}，$runMethod函数触发失败！`
        next.code = 'not string'
        break;
    }
    if (next.promise && !isPromise(next.promise)) {
      next.promise = null
      next.msg = `${method}需要返回promise，当前返回${next.promise}，$runMethod函数触发失败！`
      next.code = 'not promise'
    }
    return next
  }
  $triggerMethod(method: string, args: any[] = [], strict?: boolean, triggerCallBack?: triggerCallBackType) {
    return this.$triggerMethodByStatus(method, args, 'operate', strict, triggerCallBack)
  }
  $triggerMethodByStatusWidthOperate(args: Parameters<BaseData['$triggerMethodByStatus']>, strict?: boolean, triggerCallBack?: triggerCallBackType) {
    return this.$triggerMethod('$triggerMethodByStatus', args, strict, triggerCallBack)
  }
  /* --- load end --- */
  /* --- reset start --- */
  /**
   * 获取reset操作对应prop时机时的重置操作判断
   * @param {object} [resetOption]
   * @param {*} [prop] 当前的reset操作的时机
   * @returns {boolean}
   */
  $parseResetOption(resetOption = {}, prop: string) {
    return getProp(resetOption, prop)
  }
  /**
   * 重置回调操作=>不清除额外数据以及生命周期函数
   * @param  {...any} args 参数
   */
  $reset(...args: any[]) {
    BaseData.formatResetOption(args)
    this.$triggerLife('beforeReset', this, ...args)
    this.$triggerLife('reseted', this, ...args)
  }
  /**
   * 销毁回调操作
   * @param  {...any} args 参数
   */
  $destroy(...args: any[]) {
    BaseData.formatResetOption(args)
    this.$triggerLife('beforeDestroy', this, ...args)
    this.$reset(...args)
    this.$triggerLife('destroyed', this, ...args)
  }
  /* --- reset end --- */
}

export default BaseData
