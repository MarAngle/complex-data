import { getComplexProp, isPromise } from 'complex-utils'
import DefaultData, { DefaultBufferType, DefaultDataInitOption } from './DefaultData'
import StatusData, { DataWithLoad, StatusDataInitOption, StatusDataLoadValueType, StatusDataOperateValueType, StatusDataValueType, StatusValue, triggerChangeOption } from '../module/StatusData'
import PromiseData, { PromiseDataInitData } from '../module/PromiseData'
import DependData, { DependDataInitOption } from '../module/DependData'
import ModuleData, { ModuleDataInitOption } from '../module/ModuleData'
import ForceValue, { ForceValueInitOption } from '../lib/ForceValue'
import Data from './Data'

export interface triggerMethodOption extends triggerChangeOption {
  throttle?: {
    value: number // 节流时间：毫秒
    fail?: boolean // 失败是否节流（失败仅指调用函数的失败，校验失败可能不做处理）
    start?: boolean // 节流时间从开始计算
  }
}

function getThrottleOffset(throttle: NonNullable<triggerMethodOption['throttle']>, startTime: number) {
  if (throttle.start) {
    // 从开始计时则计算开始到现在的插值
    let offset = throttle.value - (Date.now() - startTime)
    if (offset < 0) {
      offset = 0
    }
    return offset
  } else {
    return throttle.value
  }
}

export interface triggerMethodWithStatusOption extends triggerMethodOption {
  status: string
}

export type BaseDataActive = 'actived' | 'inactived'

export interface BaseDataActiveType {
  data: BaseDataActive
  auto: boolean
}

export type loadFunctionType = (...args: any[]) => Promise<any>

export interface BaseDataInitOption extends DefaultDataInitOption {
  status?: StatusDataInitOption
  promise?: PromiseDataInitData
  depend?: DependDataInitOption
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
  $depend?: DependData
  $module?: ModuleData
  $active: BaseDataActiveType
  constructor(initOption: BaseDataInitOption) {
    super(initOption)
    this._triggerCreateLife('BaseData', false, initOption)
    this.$status = new StatusData(initOption.status)
    this.$promise = new PromiseData(initOption.promise)
    const dependInitOption = initOption.depend
    if (dependInitOption) {
      // 存在依赖则加载依赖
      Object.defineProperty(this, '$depend', {
        enumerable: false,
        configurable: false,
        writable: true,
        value: new DependData(dependInitOption, this)
      })
      // // 添加依赖状态，因依赖的加载理论上是成功一次即可，避免重复触发，暂不加载状态
      // this.$status.addData('depend', 'operate')
      if (dependInitOption.created === true || (dependInitOption.created === undefined && DependData.$created)) {
        this.$onCreatedLife('created', (lifeValue) => {
          this.$loadDepend()
          lifeValue.destroy()
        })
      }
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

  $setParent(parent?: Data) {
    super.$setParent(parent)
    this.triggerLife('parentChange', this, parent)
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
  $triggerMethodWithStatus(method: string, args: any[] = [], option: triggerMethodWithStatusOption) {
    const statusItem = this.getStatusValue(option.status)
    if (statusItem) {
      if (statusItem.triggerChange('start', [], option)) {
        return new Promise((resolve, reject) => {
          const throttle = option.throttle
          const startTime = Date.now()
          this._runMethod(method, args)!.then((res: any) => {
            if (!throttle) {
              // 不存在节流直接成功
              statusItem.triggerChange('success', [res], option)
              resolve(res)
            } else {
              setTimeout(() => {
                statusItem.triggerChange('success', [res], option)
                resolve(res)
              }, getThrottleOffset(throttle, startTime))
            }
          }).catch(err => {
            if (!throttle || !throttle.fail) {
              // 不存在节流或者存在节流但是失败不节流则直接失败
              statusItem.triggerChange('fail', [err], option)
              reject(err)
            } else {
              setTimeout(() => {
                statusItem.triggerChange('fail', [err], option)
                reject(err)
              }, getThrottleOffset(throttle, startTime))
            }
          })
        })
      } else {
        statusItem.triggerChange('fail', [], option)
        this.$exportMsg(`当前${option.status}状态为:${statusItem.getCurrent()}，$triggerMethodWithStatus函数在严格校验下不允许被触发！`)
        return Promise.reject({ status: 'fail', code: 'status clash' })
      }
    } else {
      this.$exportMsg(`${option.status}状态不存在，$triggerMethodWithStatus函数失败！`)
      return Promise.reject({ status: 'fail', code: 'status empty' })
    }
  }
  // 触发函数联动operate
  triggerMethod(method: string, args: any[] = [], option: triggerMethodOption = {}) {
    (option as triggerMethodWithStatusOption).status = 'operate'
    return this.$triggerMethodWithStatus(method, args, option as triggerMethodWithStatusOption)
  }
  // 触发函数并联动目标status，再联动operate
  triggerMethodWithOperateAndStatus(method: string, args: any[] = [], option: triggerMethodWithStatusOption, operateOption: triggerMethodOption = {}) {
    return this.triggerMethod('$triggerMethodWithStatus', [method, args, option] as Parameters<BaseData['$triggerMethodWithStatus']>, operateOption)
  }
  $getData(..._args: any[]): Promise<any> {
    return Promise.reject({ status: 'fail', code: '$getData absent', msg: '$getData函数未定义' })
  }
  protected _triggerLoadData(...args: any[]) {
    if (this.$active.auto) {
      // 自动激活模式下主动触发激活操作
      this.changeActive('actived', 'loadData')
    }
    return this.triggerMethodWithOperateAndStatus('$getData', args, {
      status: 'load',
      strict: false,
      trigger: (target, res) => {
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
      }
    })
  }
  // 依赖加完成触发，因依赖不一定存在，因此需要特殊处理
  $onDependLoaded(next: () => void) {
    if (!this.$depend) {
      next()
    } else {
      this.onLife('dependLoaded', {
        handler: next
      })
    }
  }
  $loadDepend() {
    const depend = this.$depend!
    const promise = depend.loadDepend()
    if (!depend.$init) {
      promise.finally(() => {
        this.triggerLife('dependLoaded', this)
      })
    }
    return promise
  }
  $triggerLoadData(...args: any[]) {
    return this._setPromise('load', !this.$depend ? this._triggerLoadData(...args) : new Promise((resolve, reject) => {
      this.$loadDepend().finally(() => {
        this._triggerLoadData(...args).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }))
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
    if (parseResetOption(destroyOption, 'depend') === true && this.$depend) {
      this.$depend.destroy(true)
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
