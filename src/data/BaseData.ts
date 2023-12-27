import { getProp, isPromise } from 'complex-utils'
import DefaultData, { DefaultDataInitOption } from './DefaultData'
import StatusData, { StatusDataInitOption, StatusDataLoadValueType, StatusDataOperateValueType, StatusDataValueType, StatusDataTriggerCallBackType } from '../module/StatusData'
import PromiseData, { PromiseDataInitData } from '../module/PromiseData'
import RelationData, { RelationDataInitOption } from '../module/RelationData'
import ModuleData, { ModuleDataInitOption } from '../module/ModuleData'
import ForceValue, { ForceValueInitOption } from '../lib/ForceValue'
import config from '../../config'

export type BaseDataActive = 'actived' | 'inactived'

export interface BaseDataActiveType {
  data: BaseDataActive
  auto: boolean
}

export type loadFunctionType = (...args: unknown[]) => Promise<unknown>

export interface BaseDataInitOption extends DefaultDataInitOption {
  status?: StatusDataInitOption
  promise?: PromiseDataInitData
  relation?: RelationDataInitOption
  module?: ModuleDataInitOption
  active?: BaseDataActiveType
  getData?: loadFunctionType
}

export interface resetOptionType {
  [prop: string | symbol]: undefined | boolean | Record<string | symbol, unknown>
}

export const parseResetOption = function(resetOption: resetOptionType, prop: string) {
  return getProp(resetOption, prop)
}

class BaseData extends DefaultData {
  static $name = 'BaseData'
  static $formatConfig = { name: 'Data:BaseData', level: 80, recommend: true }
  $status: StatusData
  $promise: PromiseData
  $relation?: RelationData
  $module?: ModuleData
  $active: BaseDataActiveType
  $getData?: loadFunctionType
  constructor(initOption: BaseDataInitOption) {
    super(initOption)
    this._triggerCreateLife('BaseData', 'beforeCreate', initOption)
    this.$status = new StatusData(initOption.status)
    this.$promise = new PromiseData(initOption.promise)
    if (initOption.relation) {
      Object.defineProperty(this, '$relation', {
        enumerable: false,
        configurable: false,
        writable: true,
        value: new RelationData(initOption.relation, this)
      })
    }
    if (initOption.module) {
      this.$module = new ModuleData(initOption.module, this)
    }
    if (initOption.getData) {
      this.$getData = initOption.getData
    }
    if (initOption.active) {
      this.$active = {
        data: initOption.active.data || config.active.data,
        auto: initOption.active.auto === undefined ? config.active.auto : initOption.active.auto
      }
    } else {
      this.$active = {
        data: 'actived',
        auto: true
      }
    }
    this._triggerCreateLife('BaseData', 'created', initOption)
  }

  /* --- active start --- */
  $getActive() {
    return this.$active.data
  }
  $isActive() {
    return this.$getActive() === 'actived'
  }
  $changeActive(current?: 'actived' | 'inactived', from?: string) {
    let realChange = true
    if (current) {
      if (this.$getActive() === current) {
        realChange = false
      } else {
        this.$active.data = current
      }
    } else if (this.$getActive() === 'actived') {
      this.$active.data = 'inactived'
    } else {
      this.$active.data = 'actived'
    }
    this.$syncData(true, '$changeActive')
    // 触发生命周期
    this.$triggerLife(this.$getActive(), this, realChange, from)
  }
  /* --- active end --- */

  /* --- status start --- */
  $getStatusValue(...args: Parameters<StatusData['getValue']>) {
    return this.$status.getValue(...args)
  }
  $setStatus(...args: Parameters<StatusData['setData']>) {
    this.$status.setData(...args)
  }
  $getStatus(target: 'load' | 'update'): StatusDataLoadValueType
  $getStatus(target: 'operate'): StatusDataOperateValueType
  $getStatus(target: string): StatusDataValueType
  $getStatus(...args: Parameters<StatusData['getCurrent']>) {
    return this.$status.getCurrent(...args)
  }
  $resetStatus() {
    this.$status.reset()
  }
  /* --- status end --- */
  
  /* --- promise start --- */
  protected _setPromise(...args: Parameters<PromiseData['setData']>) {
    return this.$promise.setData(...args)
  }
  protected _getPromise(...args: Parameters<PromiseData['getData']>) {
    return this.$promise.getData(...args)
  }
  protected _triggerPromise(...args: Parameters<PromiseData['triggerData']>) {
    return this.$promise.triggerData(...args)
  }
  /* --- promise end --- */

  /* --- load start --- */
  /**
   * 触发指定Promise函数，指定状态跟随Promise状态变化
   * @param method 需要触发的Promise函数
   * @param args 函数参数
   * @param statusProp 需要跟随变化的状态
   * @param strict 是否启用严格模式，开启后当前状态不在目标周期的来源时，严格校验失败打断（un=>ing=>end）
   * @param triggerCallBack 状态变化的回调函数，可在此处进行状态切换的回调
   * @returns 
   */
  $triggerMethodByStatus(method: string, args: unknown[] = [], statusProp: string, strict?: boolean, triggerCallBack?: StatusDataTriggerCallBackType) {
    const statusItem = this.$getStatusValue(statusProp)
    if (statusItem) {
      if (statusItem.triggerChange('start', strict, triggerCallBack)) {
        const next = this._triggerMethodByStatusNext(method, args)
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
        this.$exportMsg(`当前${statusProp}状态为:${statusItem.getCurrent()}，$triggerMethodByStatus函数在严格校验下不允许被触发！`)
        return Promise.reject({ status: 'fail', code: 'status clash' })
      }
    } else {
      this.$exportMsg(`${statusProp}状态不存在，$triggerMethodByStatus函数失败！`)
      return Promise.reject({ status: 'fail', code: 'status empty' })
    }
  }
  protected _triggerMethodByStatusNext(method: string, args: unknown[]) {
    const next: {
      promise: null | Promise<unknown>,
      msg: string,
      code: string
    } = {
      promise: null,
      msg: '',
      code: ''
    }
    if (typeof method === 'string') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof ((this as unknown as any)[method]) === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next.promise = (this as unknown as any)[method](...args)
      } else {
        next.msg = `${method}不是函数，$triggerMethodByStatus函数触发失败！`
        next.code = 'type error'
      }
    } else {
      next.msg = `method参数接受string，当前值为${method}，$triggerMethodByStatus函数触发失败！`
      next.code = 'method error'
    }
    if (next.promise && !isPromise(next.promise)) {
      next.promise = null
      next.msg = `${method}未返回Promise，$triggerMethodByStatus函数触发失败！`
      next.code = 'return error'
    }
    return next
  }
  $triggerMethod(method: string, args: unknown[] = [], strict?: boolean, triggerCallBack?: StatusDataTriggerCallBackType) {
    return this.$triggerMethodByStatus(method, args, 'operate', strict, triggerCallBack)
  }
  $triggerMethodByOperate(args: Parameters<BaseData['$triggerMethodByStatus']>, strict?: boolean, triggerCallBack?: StatusDataTriggerCallBackType) {
    return this.$triggerMethod('$triggerMethodByStatus', args, strict, triggerCallBack)
  }
  protected _triggerLoadData(...args: unknown[]) {
    if (this.$active.auto) {
      // 自动激活模式下主动触发激活操作
      this.$changeActive('actived', 'loadData')
    }
    const promise = this.$triggerMethodByOperate(['$getData', args, 'load', false, (target, res) => {
      if (target === 'start') {
        this.$triggerLife('beforeLoad', this, ...args)
      } else if (target === 'success') {
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
    if (this.$relation) {
      return this._setPromise('load', new Promise((resolve, reject) => {
        this.$relation!.$loadDepend().finally(() => {
          promise.then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      }))
    } else {
      return this._setPromise('load', promise)
    }
  }
  $loadData(forceInitOption?: boolean | ForceValueInitOption | ForceValue, ...args: unknown[]) {
    const force = new ForceValue(forceInitOption)
    const loadStatus = this.$getStatus('load')
    if (['un', 'fail'].indexOf(loadStatus) > -1) {
      this._triggerLoadData(...args)
    } else if (loadStatus === 'ing') {
      // 直接then
      if (force.data && force.ing) {
        this._triggerLoadData(...args)
      }
    } else if (loadStatus === 'success') {
      if (force.data) {
        this._triggerLoadData(...args)
      }
    }
    const emptyMsg = this.$createMsg(`promise模块无load数据(load状态:${loadStatus})`)
    if (!force.promise) {
      force.promise = {
        emptyMsg: emptyMsg
      }
    } else if (force.promise.emptyMsg === undefined) {
      force.promise.emptyMsg = emptyMsg
    }
    return this._triggerPromise('load', force.promise)
  }
  $reloadData(forceInitOption: boolean | ForceValueInitOption | ForceValue = true, ...args: unknown[]) {
    const force = new ForceValue(forceInitOption)
    this.$triggerLife('beforeReload', this, force, ...args)
    // 同步判断值
    const promise = this.$loadData(force, ...args)
    if (force.sync) {
      promise.then((res: unknown) => {
        // 触发生命周期重载完成事件
        this.$triggerLife('reloaded', this, {
          res: res,
          args: args
        })
      }).catch(err => {
        // eslint-disable-next-line no-console
        console.error(err)
        // 触发生命周期重载失败事件
        this.$triggerLife('reloadFail', this, {
          res: err,
          args: args
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        promise.then((res: unknown) => {
          // 触发生命周期重载完成事件
          this.$triggerLife('reloaded', this, {
            res: res,
            args: args
          })
          resolve(res)
        }).catch(err => {
          // eslint-disable-next-line no-console
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
  /* --- load end --- */

  /* --- reset start --- */
  /**
   * 重置回调操作=>不清除额外数据以及生命周期函数
   * @param  {...unknown} args 参数
   */
  $reset(resetOption: resetOptionType = {}, ...args: unknown[]) {
    this.$triggerLife('beforeReset', this, resetOption, ...args)
    if (parseResetOption(resetOption, 'status') !== false) {
      this.$status.$reset()
    }
    if (parseResetOption(resetOption, 'promise') === true) {
      this.$promise.$reset()
    }
    if (parseResetOption(resetOption, 'life') === true) {
      this.$resetLife()
    }
    if (parseResetOption(resetOption, 'extra') === true) {
      this.$clearExtra()
    }
    if (this.$module) {
      this.$module.$reset(resetOption, ...args)
    }
    this.$triggerLife('reseted', this, resetOption, ...args)
  }
  /**
   * 销毁回调操作
   * @param  {...unknown} args 参数
   */
  $destroy(destroyOption: resetOptionType = {}, ...args: unknown[]) {
    this.$triggerLife('beforeDestroy', this, destroyOption, ...args)
    this.$reset(destroyOption, ...args)
    if (parseResetOption(destroyOption, 'status') !== false) {
      this.$status.$destroy()
    }
    if (parseResetOption(destroyOption, 'promise') === true) {
      this.$promise.$destroy()
    }
    if (parseResetOption(destroyOption, 'life') === true) {
      this.$destroyLife()
    }
    if (parseResetOption(destroyOption, 'depend') === true && this.$relation) {
      this.$relation.$destroy(true)
    }
    // 额外数据不存在destroy，因此不做销毁
    // if (parseResetOption(destroyOption, 'extra') === true) {
    //   this.$clearExtra()
    // }
    if (this.$module) {
      this.$module.$destroy(destroyOption, ...args)
    }
    this.$triggerLife('destroyed', this, destroyOption, ...args)
  }
  /* --- reset end --- */
}

export default BaseData
