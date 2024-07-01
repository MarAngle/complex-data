import { getComplexProp, isPromise } from 'complex-utils'
import DefaultData, { DefaultBufferType, DefaultDataInitOption } from './DefaultData'
import StatusData, { DataWithLoad, StatusDataInitOption, StatusDataLoadValueType, StatusDataOperateValueType, StatusDataValueType, StatusTriggerCallBackType, StatusValue } from '../module/StatusData'
import PromiseData, { PromiseDataInitData } from '../module/PromiseData'
import RelationData, { RelationDataInitOption, bindParentOption } from '../module/RelationData'
import ModuleData, { ModuleDataInitOption } from '../module/ModuleData'
import ForceValue, { ForceValueInitOption } from '../lib/ForceValue'

export type BaseDataActive = 'actived' | 'inactived'

export interface BaseDataActiveType {
  data: BaseDataActive
  auto: boolean
}

export type loadFunctionType = (...args: any[]) => Promise<any>

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
  return getComplexProp(resetOption, prop)
}

class BaseData<Buffer extends DefaultBufferType = DefaultBufferType> extends DefaultData<Buffer> implements DataWithLoad {
  static $name = 'BaseData'
  static $formatConfig = { name: 'BaseData', level: 80, recommend: true }
  static $active = {
    data: 'actived',
    auto: true
  }
  $status: StatusData
  $promise: PromiseData
  $relation?: RelationData
  $module?: ModuleData
  $active: BaseDataActiveType
  constructor(initOption: BaseDataInitOption) {
    super(initOption)
    this._triggerCreateLife('BaseData', false, initOption)
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
        data: initOption.active.data || BaseData.$active.data,
        auto: initOption.active.auto == undefined ? BaseData.$active.auto : initOption.active.auto
      }
    } else {
      this.$active = {
        data: 'actived',
        auto: true
      }
    }
    this._triggerCreateLife('BaseData', true, initOption)
  }

  /* --- active start --- */
  getActive() {
    return this.$active.data
  }
  isActive() {
    return this.getActive() === 'actived'
  }
  changeActive(current?: 'actived' | 'inactived', from?: string) {
    let realChange = true
    if (current) {
      if (this.getActive() === current) {
        realChange = false
      } else {
        this.$active.data = current
      }
    } else if (this.getActive() === 'actived') {
      this.$active.data = 'inactived'
    } else {
      this.$active.data = 'actived'
    }
    this._syncData(true, 'changeActive')
    // 触发生命周期
    this.triggerLife(this.getActive(), this, realChange, from)
  }
  /* --- active end --- */

  /* --- status start --- */
  getStatusValue(...args: Parameters<StatusData['getValue']>) {
    return this.$status.getValue(...args)
  }
  setStatus(...args: Parameters<StatusData['setData']>) {
    this.$status.setData(...args)
  }
  getStatus(target: 'load' | 'update'): StatusDataLoadValueType
  getStatus(target: 'operate'): StatusDataOperateValueType
  getStatus(target?: string): StatusDataValueType
  getStatus(target?: string) {
    return this.$status.getCurrent(target)
  }
  resetStatus() {
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
  protected _runMethod(method: string, args: any[]) {
    if (typeof method === 'string') {
      if (typeof ((this as unknown as any)[method]) === 'function') {
        const promise = (this as unknown as any)[method](...args)
        if (!promise || !isPromise(promise)) {
          this.$exportMsg(`${method}未返回Promise，$triggerMethodWithStatus函数触发失败！`)
          return Promise.reject({ status: 'fail', code: 'return error' })
        } else {
          return promise
        }
      } else if ((this as unknown as any)[method] !== undefined) {
        this.$exportMsg(`${method}不是函数，$triggerMethodWithStatus函数触发失败！`)
        return Promise.reject({ status: 'fail', code: 'type error' })
      } else {
        this.$exportMsg(`${method}不存在，$triggerMethodWithStatus函数触发失败！`)
        return Promise.reject({ status: 'fail', code: 'method absent' })
      }
    } else {
      this.$exportMsg(`method参数接受string，当前值为${method}，$triggerMethodWithStatus函数触发失败！`)
      return Promise.reject({ status: 'fail', code: 'method error' })
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
  $triggerMethodWithStatus(method: string, args: any[] = [], statusProp: string, strict?: boolean, triggerCallBack?: StatusTriggerCallBackType) {
    const statusItem = this.getStatusValue(statusProp)
    if (statusItem) {
      if (statusItem.triggerChange('start', [], strict, triggerCallBack)) {
        return new Promise((resolve, reject) => {
          this._runMethod(method, args)!.then((res: any) => {
            statusItem.triggerChange('success', [res], strict, triggerCallBack)
            resolve(res)
          }).catch(err => {
            statusItem.triggerChange('fail', [err], strict, triggerCallBack)
            reject(err)
          })
        })
      } else {
        statusItem.triggerChange('fail', [], strict, triggerCallBack)
        this.$exportMsg(`当前${statusProp}状态为:${statusItem.getCurrent()}，$triggerMethodWithStatus函数在严格校验下不允许被触发！`)
        return Promise.reject({ status: 'fail', code: 'status clash' })
      }
    } else {
      this.$exportMsg(`${statusProp}状态不存在，$triggerMethodWithStatus函数失败！`)
      return Promise.reject({ status: 'fail', code: 'status empty' })
    }
  }
  // 触发函数联动operate
  triggerMethod(method: string, args: any[] = [], strict?: boolean, triggerCallBack?: StatusTriggerCallBackType) {
    return this.$triggerMethodWithStatus(method, args, 'operate', strict, triggerCallBack)
  }
  // 触发函数并联动目标status，再联动operate
  triggerMethodWithOperate(method: string, args: any[] = [], statusProp: string, strict?: boolean, triggerCallBack?: StatusTriggerCallBackType, operateStrict?: boolean, OperateTriggerCallBack?: StatusTriggerCallBackType) {
    return this.triggerMethod('$triggerMethodWithStatus', [method, args, statusProp, strict, triggerCallBack] as Parameters<BaseData['$triggerMethodWithStatus']>, operateStrict, OperateTriggerCallBack)
  }
  $getData(..._args: any[]): Promise<any> {
    return Promise.reject({ status: 'fail', code: '$getData absent', msg: '$getData函数未定义' })
  }
  protected _triggerLoadData(...args: any[]) {
    if (this.$active.auto) {
      // 自动激活模式下主动触发激活操作
      this.changeActive('actived', 'loadData')
    }
    return this.triggerMethodWithOperate('$getData', args, 'load', false, (target, res) => {
      if (target === 'start') {
        this.triggerLife('beforeLoad', this, ...args)
      } else if (target === 'success') {
        this.triggerLife('loaded', this, {
          res: res,
          args: args
        })
      } else {
        this.triggerLife('loadFail', this, {
          res: res,
          args: args
        })
      }
    })
  }
  $triggerLoadData(...args: any[]) {
    if (this.$relation) {
      return this._setPromise('load', new Promise((resolve, reject) => {
        this.$relation!.loadDepend().finally(() => {
          this._triggerLoadData(...args).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      }))
    } else {
      return this._setPromise('load', this._triggerLoadData(...args))
    }
  }
  loadData(forceInitOption?: boolean | ForceValueInitOption | ForceValue, ...args: unknown[]) {
    const force = new ForceValue(forceInitOption)
    const loadStatus = this.getStatus('load')
    if ([StatusValue.un, StatusValue.fail].indexOf(loadStatus) > -1) {
      this.$triggerLoadData(...args)
    } else if (loadStatus === StatusValue.ing) {
      // 直接then
      if (force.data && force.ing) {
        this.$triggerLoadData(...args)
      }
    } else if (loadStatus === StatusValue.success) {
      if (force.data) {
        this.$triggerLoadData(...args)
      }
    }
    const emptyMsg = this._createMsg(`promise模块无load数据(load状态:${loadStatus})`)
    if (!force.promise) {
      force.promise = {
        emptyMsg: emptyMsg
      }
    } else if (force.promise.emptyMsg == undefined) {
      force.promise.emptyMsg = emptyMsg
    }
    return this._triggerPromise('load', force.promise)
  }
  reloadData(forceInitOption: boolean | ForceValueInitOption | ForceValue = true, ...args: unknown[]) {
    const force = new ForceValue(forceInitOption)
    this.triggerLife('beforeReload', this, force, ...args)
    // 同步判断值
    const promise = this.loadData(force, ...args)
    if (force.sync) {
      promise.then((res: unknown) => {
        // 触发生命周期重载完成事件
        this.triggerLife('reloaded', this, {
          res: res,
          args: args
        })
      }).catch(err => {
        // eslint-disable-next-line no-console
        console.error(err)
        // 触发生命周期重载失败事件
        this.triggerLife('reloadFail', this, {
          res: err,
          args: args
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        promise.then((res: unknown) => {
          // 触发生命周期重载完成事件
          this.triggerLife('reloaded', this, {
            res: res,
            args: args
          })
          resolve(res)
        }).catch(err => {
          // eslint-disable-next-line no-console
          console.error(err)
          // 触发生命周期重载失败事件
          this.triggerLife('reloadFail', this, {
            res: err,
            args: args
          })
          reject(err)
        })
      })
    }
  }
  /* --- load end --- */
  
  /* --- relation start --- */
  bindParent(parent: bindParentOption) {
    if (!this.$relation) {
      Object.defineProperty(this, '$relation', {
        enumerable: false,
        configurable: false,
        writable: true,
        value: new RelationData({
          parent: parent
        }, this)
      })
    } else {
      this.$relation.bindParent(parent, this)
    }
  }
  /* --- relation end --- */
  
  /* --- reset start --- */
  /**
   * 重置回调操作=>不清除额外数据以及生命周期函数
   * @param  {...unknown} args 参数
   */
  reset(resetOption: resetOptionType = {}, ...args: unknown[]) {
    this.triggerLife('beforeReset', this, resetOption, ...args)
    if (parseResetOption(resetOption, 'status') !== false) {
      this.$status.reset()
    }
    if (parseResetOption(resetOption, 'promise') === true) {
      this.$promise.reset()
    }
    if (parseResetOption(resetOption, 'life') === true) {
      this.resetLife()
    }
    if (parseResetOption(resetOption, 'extra') === true) {
      this.clearExtra()
    }
    if (this.$module) {
      this.$module.reset(resetOption, ...args)
    }
    this.triggerLife('reseted', this, resetOption, ...args)
  }
  /**
   * 销毁回调操作
   * @param  {...unknown} args 参数
   */
  destroy(destroyOption: resetOptionType = {}, ...args: unknown[]) {
    this.triggerLife('beforeDestroy', this, destroyOption, ...args)
    this.reset(destroyOption, ...args)
    if (parseResetOption(destroyOption, 'status') !== false) {
      this.$status.destroy()
    }
    if (parseResetOption(destroyOption, 'promise') !== false) {
      this.$promise.destroy()
    }
    if (parseResetOption(destroyOption, 'life') === true) {
      this.destroyLife()
    }
    if (parseResetOption(destroyOption, 'depend') === true && this.$relation) {
      this.$relation.destroy(true)
    }
    // 额外数据不存在destroy，因此不做销毁,在reset中可能存在清空操作
    if (this.$module) {
      this.$module.destroy(destroyOption, ...args)
    }
    this.triggerLife('destroyed', this, destroyOption, ...args)
  }
  /* --- reset end --- */
}

export default BaseData
