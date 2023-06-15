import { getProp, isPromise } from 'complex-utils'
import DefaultData, { DefaultDataInitOption } from "./DefaultData"
import ModuleData, { ModuleDataInitOption, moduleResetOptionType } from './../lib/ModuleData'
import UpdateData from '../lib/UpdateData'
import PromiseData, { PromiseOptionType } from '../lib/PromiseData'
import StatusData from '../lib/StatusData'
import { loadValueType, operateValueType, triggerCallBackType, valueType } from '../lib/StatusItem'
import { cascadeType } from './Data'
import config from '../../config'
import { formatInitOption } from '../utils'

export interface forceObjectType {
  correct?: PromiseOptionType['correct']
  [prop: string]: undefined | boolean | string
}
export type forceType = boolean | forceObjectType

export type bindType = (target: BaseData<any>, origin: BaseData<any>, life: 'success' | 'fail') => any
export interface bindOption {
  life?: 'load' | 'update',
  once?: boolean,
  update?: boolean,
  active?: boolean,
  fail?: boolean
}

export type promiseFunction = (...args: any[]) => Promise<any>

export interface ReloadOptionType {
  [prop: string]: undefined | boolean
}
export type ReloadOption = undefined | boolean | ReloadOptionType

export interface resetOptionType extends moduleResetOptionType {
  [prop: string]: cascadeType<undefined | cascadeType<undefined | boolean>>
}
export type BaseDataActive = 'actived' | 'inactived'
// type MethodExtract<T, U, M extends keyof T> = M extends (T[M] extends U ? M : never ) ? M : never

export interface BaseDataActiveType {
  data: BaseDataActive,
  auto: boolean
}

export interface BaseDataInitOption<P extends undefined | DefaultData<any> = undefined> extends DefaultDataInitOption<P> {
  active?: BaseDataActiveType
  module?: ModuleDataInitOption
  $getData?: promiseFunction
  $updateData?: promiseFunction
}

class BaseData<P extends undefined | DefaultData<any> = undefined> extends DefaultData<P> {
  static $name = 'BaseData'
  $module: ModuleData
  $active: BaseDataActiveType
  $getData?: promiseFunction
  $updateData?: promiseFunction
  constructor(initOption: BaseDataInitOption<P>) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('BaseData', 'beforeCreate', initOption)
    if (initOption.active) {
      this.$active = {
        data: initOption.active.data || config.BaseData.active.data,
        auto: initOption.active.auto === undefined ? config.BaseData.active.auto : initOption.active.auto
      }
    } else {
      this.$active = {
        data: 'actived',
        auto: true
      }
    }
    this.$module = new ModuleData(initOption.module, this)
    if (initOption.$getData) {
      this.$getData = initOption.$getData
      this.$initLoadDepend()
    }
    this.$updateData = initOption.$updateData
    this.$triggerCreateLife('BaseData', 'created', initOption)
  }
  $bindLifeByActive(target: BaseData, bind: bindType, from: 'success' | 'fail', active?: boolean, bindNext?: () => void) {
    let next = true
    if (active && !this.$isActive()) {
      // 需要判断激活状态且当前状态为未激活时不直接触发
      next = false
    }
    if (next) {
      bind(target, this, from)
      if (bindNext) {
        bindNext()
      }
    } else {
      // 设置主数据被激活时触发bind函数
      // 设置相同id,使用replace模式，需要注意的是当函数变化后开始的函数可能还未被触发
      this.$onLife('actived', {
        id: target.$getId('BindLife' + from),
        once: true,
        replace: true,
        data: () => {
          bind(target, this, from)
          if (bindNext) {
            bindNext()
          }
        }
      })
    }
  }
  $bindLife(target: BaseData, bind: bindType, {
    life, // 生命周期名称
    once, // 成功后解除绑定
    active, // 是否只在激活状态下触发
    fail // 失败是否触发bind
  }: bindOption = {}) {
    if (!life) {
      life = 'load'
    }
    if (active === undefined && this.$active.auto) {
      // 自动激活模式下，默认进行激活的判断
      active = true
    }
    const currentStatus = target.$getStatus(life)
    if (currentStatus == 'success') {
      this.$bindLifeByActive(target, bind, 'success', active)
      if (once) {
        return
      }
    } else if (fail && currentStatus == 'fail') {
      this.$bindLifeByActive(target, bind, 'fail', active)
    }
    const failLifeName = life == 'load' ? 'loadFail' : 'updateFail'
    const failLifeId = fail ? target.$onLife(failLifeName, {
      once: once,
      data: () => {
        this.$bindLifeByActive(target, bind, 'fail', active)
      }
    }) as string : undefined
    const successLifeName = life == 'load' ? 'loaded' : 'updated'
    target.$onLife(successLifeName, {
      once: once,
      data: () => {
        this.$bindLifeByActive(target, bind, 'success', active, (once && failLifeId) ? () => {
          // once成功后且存在失败周期时解除失败回调
          target.$offLife(failLifeName, failLifeId)
        } : undefined)
      }
    })
  }
  $getActive() {
    return this.$active.data
  }
  $isActive() {
    return this.$getActive() == 'actived'
  }
  $changeActive(current?: 'actived' | 'inactived', from?: string) {
    let realChange = true
    if (current) {
      if (this.$getActive() == current) {
        realChange = false
      } else {
        this.$active.data = current
      }
    } else if (this.$getActive() == 'actived') {
      this.$active.data = 'inactived'
    } else {
      this.$active.data = 'actived'
    }
    this.$syncData(true, '$changeActive')
    // 触发生命周期
    this.$triggerLife(this.$getActive(), this, realChange, from)
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
  $getStatus(target: 'load' | 'update'): loadValueType
  $getStatus(target: 'operate'): operateValueType
  $getStatus(target: string): valueType
  $getStatus(...args: Parameters<StatusData['getCurrent']>) {
    return this.$module.status!.getCurrent(...args)
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

  /* --- load start --- */
  $initLoadDepend() {
    if (!this.$module.status) {
      this.$setModule('status', true)
    }
    if (!this.$module.promise) {
      this.$setModule('promise', true)
    }
  }
  $loadDataWithDepend(...args: Parameters<BaseData['$loadData']>) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.$module.depend!.$loadData().then(resList => {
        this.$loadData(...args).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    })
  }
  $autoLoadData(...args: any[]) {
    let next: string
    const loadStatus = this.$getStatus('load')
    if (loadStatus != 'success') {
      next = 'load'
    } else {
      next = 'update'
    }
    if (next == 'load') {
      return this.$loadData(true, ...args)
    } else {
      return this.$loadUpdateData(true, ...args)
    }
  }
  $triggerGetData(...args: any[]) {
    if (this.$active.auto) {
      // 自动激活模式下主动触发激活操作
      this.$changeActive('actived', 'getData')
    }
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
    } else if (loadStatus == 'success') {
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
      }).catch(err => {
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
        }).catch(err => {
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
  /**
   * 触发指定Promise函数，指定状态跟随Promise状态变化
   * @param method 需要触发的Promise函数
   * @param args 函数参数
   * @param statusProp 需要跟随变化的状态
   * @param strict 是否启用严格模式，开启后当前状态不在目标周期的来源时，严格校验失败打断（un=>ing=>end）
   * @param triggerCallBack 状态变化的回调函数，可在此处进行状态切换的回调
   * @returns 
   */
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
            }).catch(err => {
              statusItem.triggerChange('fail', false, triggerCallBack, [err])
              reject(err)
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
  /* --- update start --- */
  $startUpdate(...args: Parameters<UpdateData['start']>) {
    return this.$module.update!.start(...args)
  }
  $updateImmerdiate(...args: Parameters<UpdateData['updateImmerdiate']>) {
    return this.$module.update!.updateImmerdiate(...args)
  }
  $resetUpdateNum(...args: Parameters<UpdateData['resetNum']>) {
    return this.$module.update!.resetNum(...args)
  }
  $clearUpdate(...args: Parameters<UpdateData['clear']>) {
    return this.$module.update!.clear(...args)
  }
  $resetUpdate(...args: Parameters<UpdateData['reset']>) {
    return this.$module.update!.reset(...args)
  }
  $triggerUpdateData (...args: any[]) {
    if (this.$active.auto) {
      // 自动激活模式下主动触发激活操作
      this.$changeActive('actived', 'updateData')
    }
    const promise = this.$triggerMethodByStatusWidthOperate(['$updateData', args, 'update', false, (target, res) => {
      if (target == 'start') {
        this.$triggerLife('beforeUpdate', this, ...args)
      } else if (target == 'success') {
        this.$triggerLife('updated', this, {
          res: res,
          args: args
        })
      } else {
        this.$triggerLife('updateFail', this, {
          res: res,
          args: args
        })
      }
    }])
    return this.$setPromise('update', promise)
  }
  $loadUpdateData (force?: forceType, ...args: any[]) {
    if (force === true) {
      force = {}
    }
    const updateStatus = this.$getStatus('update')
    if (updateStatus == 'un' || updateStatus == 'success' || updateStatus == 'fail') {
      this.$triggerUpdateData(...args)
    } else { // ing
      // 直接then'
      if (force) {
        this.$triggerUpdateData(...args)
      }
    }
    return this.$triggerPromise('update', {
      errmsg: this.$createMsg(`promise模块无update数据(update状态:${updateStatus})`),
      correct: force ? force.correct : undefined
    })
  }
  /* --- update end --- */
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
  $reset(resetOption: resetOptionType = {}, ...args: any[]) {
    this.$triggerLife('beforeReset', this, ...args)
    this.$module.$reset(resetOption, ...args)
    this.$triggerLife('reseted', this, ...args)
  }
  /**
   * 销毁回调操作
   * @param  {...any} args 参数
   */
  $destroy(destroyOption: resetOptionType = {}, ...args: any[]) {
    this.$triggerLife('beforeDestroy', this, ...args)
    this.$module.$destroy(destroyOption, ...args)
    this.$reset(destroyOption, ...args)
    this.$triggerLife('destroyed', this, ...args)
  }
  /* --- reset end --- */
}

export default BaseData
