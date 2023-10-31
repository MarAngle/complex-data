import { getProp, isPromise, upperCaseFirstChar } from 'complex-utils-next'
import DefaultData, { DefaultDataInitOption } from './DefaultData'
import StatusData, { StatusDataInitOption, StatusDataLoadValueType, StatusDataOperateValueType, StatusDataValueType, StatusDataTriggerCallBackType } from '../lib/StatusData'
import PromiseData, { PromiseDataInitData, PromiseOptionType } from '../lib/PromiseData'
import config from '../../config'
import ModuleData, { ModuleDataInitOption } from '../lib/ModuleData'

export type BaseDataBindType = (target: BaseData, origin: BaseData, life: 'success' | 'fail') => void
export interface BaseDataBindOption {
  life?: 'load' | 'update'
  once?: boolean
  update?: boolean
  active?: boolean
  fail?: boolean
}

export type BaseDataActive = 'actived' | 'inactived'
// type MethodExtract<T, U, M extends keyof T> = M extends (T[M] extends U ? M : never ) ? M : never

export interface BaseDataActiveType {
  data: BaseDataActive
  auto: boolean
}

export type loadFunctionType = (...args: unknown[]) => Promise<unknown>

export interface BaseDataInitOption extends DefaultDataInitOption {
  status?: StatusDataInitOption
  promise?: PromiseDataInitData
  module?: ModuleDataInitOption
  active?: BaseDataActiveType
  getData?: loadFunctionType
}

export interface resetOptionType {
  [prop: string]: undefined | boolean | Record<string, unknown>
}

export const parseResetOption = function(resetOption: resetOptionType, prop: string) {
  return getProp(resetOption, prop)
}

export interface ForceInitOption {
  data?: boolean
  ing?: boolean
  sync?: boolean
  promise?: PromiseOptionType
  module?: {
    [prop: string]: undefined | boolean | Record<string, unknown>
  }
}

export class Force {
  data: undefined | boolean
  ing?: boolean
  sync?: boolean
  promise?: PromiseOptionType
  module!: {
    [prop: string]: undefined | boolean | Record<string, unknown>
  }
  constructor(initOption?: boolean | ForceInitOption | Force) {
    if (!initOption || initOption === true) {
      this.data = initOption
      this.module = {}
    } else if (initOption.constructor !== Force) {
      this.data = initOption.data
      this.ing = initOption.ing
      this.sync = initOption.sync
      this.promise = initOption.promise
      this.module = initOption.module || {}
    } else {
      return initOption
    }
  }
}

class BaseData extends DefaultData {
  static $name = 'BaseData'
  $status: StatusData
  $promise: PromiseData
  $module: ModuleData
  $active: BaseDataActiveType
  $getData?: loadFunctionType
  constructor(initOption: BaseDataInitOption) {
    super(initOption)
    this._triggerCreateLife('BaseData', 'beforeCreate', initOption)
    this.$status = new StatusData(initOption.status)
    this.$promise = new PromiseData(initOption.promise)
    this.$module = new ModuleData(initOption.module, this)
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

  /* --- bind&active start --- */
  $bindLifeByActive(target: BaseData, bind: BaseDataBindType, from: 'success' | 'fail', active?: boolean, next?: () => void) {
    let sync = true
    if (active && !this.$isActive()) {
      // 需要判断激活状态且当前状态为未激活时不同步触发
      sync = false
    }
    if (sync) {
      bind(target, this, from)
      if (next) {
        next()
      }
    } else {
      // 设置主数据被激活时触发bind函数
      // 设置相同id,使用replace模式，需要注意的是当函数变化后开始的函数可能还未被触发
      this.$onLife('actived', {
        id: target.$getId('BindLife' + upperCaseFirstChar(from)),
        once: true,
        replace: true,
        data: () => {
          bind(target, this, from)
          if (next) {
            next()
          }
        }
      })
    }
  }
  $bindLife(target: BaseData, bind: BaseDataBindType, {
    life, // 生命周期名称
    once, // 成功后解除绑定
    active, // 是否只在激活状态下触发
    fail // 失败是否触发bind
  }: BaseDataBindOption = {}) {
    if (!life) {
      life = 'load'
    }
    if (active === undefined && this.$active.auto) {
      // 自动激活模式下，默认进行激活的判断
      active = true
    }
    const currentStatus = target.$getStatus(life)
    if (currentStatus === 'success') {
      this.$bindLifeByActive(target, bind, 'success', active)
      if (once) {
        return
      }
    } else if (fail && currentStatus === 'fail') {
      this.$bindLifeByActive(target, bind, 'fail', active)
    }
    const failLifeName = life === 'load' ? 'loadFail' : 'updateFail'
    const failLifeId = fail ? target.$onLife(failLifeName, {
      once: once,
      data: () => {
        this.$bindLifeByActive(target, bind, 'fail', active)
      }
    }) as PropertyKey : undefined
    const successLifeName = life === 'load' ? 'loaded' : 'updated'
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
  /* --- bind&active end --- */

  /* --- status start --- */
  $getStatusItem(...args: Parameters<StatusData['getItem']>) {
    return this.$status.getItem(...args)
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
  protected $setPromise(...args: Parameters<PromiseData['setData']>) {
    return this.$promise.setData(...args)
  }
  protected $getPromise(...args: Parameters<PromiseData['getData']>) {
    return this.$promise.getData(...args)
  }
  protected $triggerPromise(...args: Parameters<PromiseData['triggerData']>) {
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
    const statusItem = this.$getStatusItem(statusProp)
    if (statusItem) {
      if (statusItem.triggerChange('start', strict, triggerCallBack)) {
        const next = this.$triggerMethodByStatusNext(method, args)
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
  protected $triggerMethodByStatusNext(method: string, args: unknown[]) {
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
        next.msg = `${method}不是函数，$triggerMethodByStatusNext函数触发失败！`
        next.code = 'type error'
      }
    } else {
      next.msg = `method参数接受string，当前值为${method}，$triggerMethodByStatusNext函数触发失败！`
      next.code = 'method error'
    }
    if (next.promise && !isPromise(next.promise)) {
      next.promise = null
      next.msg = `${method}未返回Promise，$triggerMethodByStatusNext函数触发失败！`
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
  protected $triggerLoadData(...args: unknown[]) {
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
    return this.$setPromise('load', promise)
  }
  $loadData(forceInitOption?: boolean | ForceInitOption | Force, ...args: unknown[]) {
    const force = new Force(forceInitOption)
    const loadStatus = this.$getStatus('load')
    if (loadStatus === 'un' || loadStatus === 'fail') {
      this.$triggerLoadData(...args)
    } else if (loadStatus === 'ing') {
      // 直接then
      if (force.data && force.ing) {
        this.$triggerLoadData(...args)
      }
    } else if (loadStatus === 'success') {
      if (force.data) {
        this.$triggerLoadData(...args)
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
    return this.$triggerPromise('load', force.promise)
  }
  $reloadData(forceInitOption: boolean | ForceInitOption | Force = true, ...args: unknown[]) {
    const force = new Force(forceInitOption)
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
    this.$module.$reset(resetOption, ...args)
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
    // 额外数据不存在destroy，因此不做销毁
    // if (parseResetOption(destroyOption, 'extra') === true) {
    //   this.$clearExtra()
    // }
    this.$module.$destroy(destroyOption, ...args)
    this.$triggerLife('destroyed', this, destroyOption, ...args)
  }
  /* --- reset end --- */
}

export default BaseData
