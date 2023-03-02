import { getProp, getType, isPromise } from 'complex-utils'
import PaginationData from '../lib/PaginationData'
import PromiseData, { PromiseOptionType } from '../lib/PromiseData'
import StatusData from '../lib/StatusData'
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
    return this.$setPromise('load', new Promise((resolve, reject) => {
      // 触发生命周期加载前事件
      this.$triggerLife('beforeLoad', this, ...args)
      this.$setStatus('ing', 'load')
      args.unshift('$getData')
      this.$triggerMethod(...(args as [string, ...any])).then(res => {
        this.$setStatus('end', 'load')
        // 触发生命周期加载完成事件
        this.$triggerLife('loaded', this, {
          res: res,
          args: args
        })
        resolve(res)
      }, err => {
        this.$setStatus('fail', 'load')
        // 触发生命周期加载失败事件
        this.$triggerLife('loadFail', this, {
          res: err,
          args: args
        })
        reject(err)
      })
    }))
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
  $triggerMethodByOperate (target: string | ((...args: any[]) => any), ...args: any[]) {
    const operate = this.$getStatus()
    if (operate == 'wait') {
      return this.$triggerMethod(target, ...args)
    } else {
      this.$exportMsg(`当前操作状态为:${operate}，${target}函数操作互斥，$triggerMethodByOperate函数失败！`)
      return Promise.reject({ status: 'fail', code: 'clash' })
    }
  }
  $triggerMethod(target: string | ((...args: any[]) => any), ...args: any[]) {
    const next: {
      data: boolean,
      promise: null | Promise<any>,
      msg: string,
      code: string
    } = {
      data: false,
      promise: null,
      msg: '',
      code: ''
    }
    switch (typeof target) {
      case 'string':
        if ((this as any)[target]) {
          if (typeof ((this as any)[target]) === 'function') {
            next.promise = (this as any)[target](...args)
          } else {
            next.msg = `${target}属性非函数类型，$triggerMethod函数触发失败！`
            next.code = 'not function'
          }
        } else {
          next.msg = `不存在${target}函数，$triggerMethod函数触发失败！`
          next.code = 'no method'
        }
        break;
      case 'function':
        next.promise = target(...args)
        break;
      default:
        next.msg = `target参数接受string/function[promise]，当前值为${target}，$triggerMethod函数触发失败！`
        next.code = 'not function'
        break;
    }
    if (next.promise) {
      if (isPromise(next.promise)) {
        next.data = true
      } else {
        next.msg = `target参数为function时需要返回promise，当前返回${next.promise}，$triggerMethod函数触发失败！`
        next.code = 'not promise'
      }
    }
    return new Promise((resolve, reject) => {
      if (next.data) {
        this.$setStatus('ing')
        next.promise!.then(res => {
          this.$setStatus('wait')
          resolve(res)
        }, err => {
          this.$setStatus('wait')
          console.error(err)
          reject(err)
        })
      } else {
        this.$exportMsg(next.msg)
        reject({ status: 'fail', code: next.code })
      }
    })
  }
  /* --- load end --- */


  /**
   * 将第一个传参的第一个参数无值时转换为空对象
   * @param {*[]} args 参数列表
   */
  $formatResetOption(args: any[]) {
    if (!args[0]) {
      args[0] = {}
    }
  }
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
    this.$formatResetOption(args)
    this.$triggerLife('beforeReset', this, ...args)
    this.$triggerLife('reseted', this, ...args)
  }
  /**
   * 销毁回调操作
   * @param  {...any} args 参数
   */
  $destroy(...args: any[]) {
    this.$formatResetOption(args)
    this.$triggerLife('beforeDestroy', this, ...args)
    this.$reset(...args)
    this.$triggerLife('destroyed', this, ...args)
  }

}

export default BaseData
