import _func from 'complex-func'
import DefaultDataWithLife from './DefaultDataWithLife'
import OptionData from './../mod/OptionData'
import StatusData from './../mod/StatusData'
import UpdateData from './../mod/UpdateData'
import PromiseData from './../mod/PromiseData'

class BaseData extends DefaultDataWithLife {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super(initOption)
    this.triggerCreateLife('BaseData', 'beforeCreate', initOption)
    this.setModule('option', new OptionData())
    this.setModule('status', new StatusData(initOption.status))
    this.setModule('promise', new PromiseData())
    if (initOption.update) {
      this.setModule('update', new UpdateData(initOption.update))
    }
    this.triggerCreateLife('BaseData', 'created')
  }
  /**
   * 设置状态
   * @param {*} data 状态value值
   * @param {*} prop 需要设置的状态
   * @param {*} act 操作判断值 count模式下启用，可选不传/init/reset，基本不用传
   */
  setStatus (data, prop = 'operate', act) {
    this.getModule('status').setData(prop, data, act)
  }
  /**
   * 获取对应状态的值
   * @param {string} prop 对应状态
   * @returns {*}
   */
  getStatus (prop = 'operate') {
    return this.getModule('status').getData(prop)
  }
  /**
   * 恢复状态
   */
  resetStatus () {
    this.getModule('status').reset()
  }
  /* --promise相关函数-- */
  setPromise (prop, promisedata) {
    return this.getModule('promise').setData(prop, promisedata)
  }
  getPromise (prop) {
    return this.getModule('promise').getData(prop)
  }
  triggerPromise (prop, option = {}) {
    return this.getModule('promise').triggerData(prop, option)
  }
  /* --更新相关操作-- */
  setUpdateOffset (...args) {
    this.triggerModuleMethod('update', 'setOffset', args)
  }
  /**
   * 开始更新
   */
  startUpdate (...args) {
    this.triggerModuleMethod('update', 'start', args)
  }
  /**
   * 立即更新
   */
  updateImmerdiate (...args) {
    this.triggerModuleMethod('update', 'updateImmerdiate', args)
  }
  /**
   * 自动更新
   */
  autoStartUpdate (...args) {
    this.triggerModuleMethod('update', 'autoStart', args)
  }
  /**
   * 触发下一次定时
   */
  nextUpdate (...args) {
    this.triggerModuleMethod('update', 'next', args)
  }
  /**
   * 清除更新
   */
  clearUpdate (...args) {
    this.triggerModuleMethod('update', 'clear', args)
  }
  /**
   * 重置更新
   */
  resetUpdate (...args) {
    this.triggerModuleMethod('update', 'reset', args)
  }
  /**
   * 自动加载或者更新数据
   */
  autoLoadData (next, ...args) {
    if (next === undefined || next === true) {
      next = 'auto'
    }
    let target = ''
    if (next == 'auto') {
      let loadStatus = this.getStatus('load')
      let updateStatus = this.getStatus('update')
      if (loadStatus.value == 'unload') {
        next = 'load'
        target = 'load'
      } else if (loadStatus.value == 'loading') {
        next = 'load'
        target = 'load'
      } else if (updateStatus.value == 'updated') { // loadStatus.value == 'loaded'
        next = 'update'
        target = 'update'
      } else if (updateStatus == 'updating') {
        next = 'update'
        target = 'update'
      }
    }
    // auto 保证数据的更新
    if (next == 'load') {
      args.splice(0, 1, true) // 强制获取新数据
      return this.loadData(...args)
    } else if (next == 'update') {
      args.splice(0, 1, false) // update强制换取，此处设置为ing状态不重新拉取
      return this.loadUpdateData(...args)
    } else {
      return Promise.resolve({ next: next, target: target })
    }
  }
 /**
  * 数据相关函数定义
  * 加载判断load是否加载成功和强制判断值
  * @param {boolean | object} [force] 强制加载判断值，ing属性为ing强制更新判断值
  * @param  {...any} args getData参数列表
  * @returns {Promise}
  */
  loadData (force, ...args) {
    if (force === true) {
      force = {}
    }
    let loadStatus = this.getStatus('load')
    if (loadStatus.value == 'unload') {
      this.triggerGetData(...args)
    } else if (loadStatus.value == 'loading') {
      // 直接then
      if (force && force.ing) {
        this.triggerGetData(...args)
      }
    } else if (loadStatus.value == 'loaded') {
      if (force) {
        this.triggerGetData(...args)
      }
    }
    return this.triggerPromise('load', {
      errmsg: this.buildPrintMsg(`promise模块无load数据(load状态:${loadStatus.value})`),
      correct: force ? force.correct : undefined
    })
  }
  /**
   * 重载数据
   * @param {object | boolean} [option] 设置项，布尔值则为force快捷赋值
   * @param {object | boolean} [option.force] 强制重置参数
   * @param {boolean} [option.sync] 同步函数
   * @param {*} [option.prop] 其他参数
   * @param  {...any} [args] getData参数列表
   * @returns {}
   */
  reloadData (option, ...args) {
    let optionType = _func.getType(option)
    if (optionType === 'boolean') {
      option = {
        force: option
      }
    } else if (optionType !== 'object') {
      option = {}
    }
    this.triggerLife('beforeReload', this, option, ...args)
    // 同步判断值
    let sync = option.sync
    let force = option.force === undefined ? {} : option.force
    let promise = this.loadData(force, ...args)
    if (sync) {
      promise.then((res) => {
        // 触发生命周期重载完成事件
        this.triggerLife('reloaded', this, {
          res: res,
          args: args
        })
      }, err => {
        console.error(err)
        // 触发生命周期重载失败事件
        this.triggerLife('reloadFail', this, {
          res: err,
          args: args
        })
      })
    } else {
      return new Promise((resolve, reject) => {
        promise.then(res => {
          // 触发生命周期重载完成事件
          this.triggerLife('reloaded', this, {
            res: res,
            args: args
          })
          resolve(res)
        }, err => {
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
 /**
  * 实现更新函数
  * 加载判断当前更新状态
  * @param {*} force 更新判断值
  * @param  {...any} args 参数
  * @returns {Promise}
  */
  loadUpdateData (force, ...args) {
    if (force === true) {
      force = {}
    }
    let updateStatus = this.getStatus('update')
    if (updateStatus.value == 'updated') {
      this.triggerUpdateData(...args)
    } else { // updating
      // 直接then'
      if (force) {
        this.triggerUpdateData(...args)
      }
    }
    return this.triggerPromise('update', {
      errmsg: this.buildPrintMsg(`promise模块无update数据(update状态:${updateStatus.value})`),
      correct: force ? force.correct : undefined
    })
  }

  /**
   * 触发目标函数并伴随对应的操作值变动--未发现对应函数时报错
   * @param {string} target 目标函数名称
   * @param  {...any} args 参数
   * @returns {Promise}
   */
  triggerMethod (target, ...args) {
    let next = {
      data: false,
      promise: null,
      msg: '',
      code: ''
    }
    let type = _func.getType(target)
    if (type === 'string') {
      if (this[target]) {
        if (_func.getType(this[target]) === 'function') {
          next.promise = this[target](...args)
        } else {
          next.msg = `${target}属性非函数类型，triggerMethod函数触发失败！`
          next.code = 'errMethod'
        }
      } else {
        next.msg = `未定义${target}函数，triggerMethod函数触发失败！`
        next.code = 'noMethod'
      }
    } else if (type === 'function') {
      next.promise = target(...args)
    } else {
      next.msg = `target参数接受string/function[promise]，当前值为${target}，triggerMethod函数触发失败！`
      next.code = 'errArgs'
    }
    if (next.promise) {
      if (_func.isPromise(next.promise)) {
        next.data = true
      } else {
        next.msg = `target参数为function时需要返回promise，当前返回${next.promise}，triggerMethod函数触发失败！`
        next.code = 'notPromise'
      }
    }
    return new Promise((resolve, reject) => {
      if (next.data) {
        this.setStatus('operating')
        next.promise.then(res => {
          this.setStatus('operated')
          resolve(res)
        }, err => {
          this.setStatus('operated')
          console.error(err)
          reject(err)
        })
      } else {
        this.printMsg(next.msg)
        reject({ status: 'fail', code: next.code })
      }
    })
  }

  /**
   * 可操作状态下触发目标函数并伴随对应的操作值变动
   * @param {string} target 目标函数
   * @param  {...any} args 参数
   * @returns {Promise}
   */
  triggerMethodByOperate (target, ...args) {
    let operate = this.getStatus()
    if (operate.value == 'operated') {
      return this.triggerMethod(target, ...args)
    } else {
      this.printMsg(`当前操作状态为:${operate.label}，${target}函数操作互斥，triggerMethodByOperate函数失败！`)
      return Promise.reject({ status: 'fail', code: 'clash' })
    }
  }

  /**
   * 触发加载数据操作
   * @param  {...any} args 参数
   * @returns {Promise}
   */
  triggerGetData (...args) {
    return this.setPromise('load', new Promise((resolve, reject) => {
      // 触发生命周期加载前事件
      this.triggerLife('beforeLoad', this, ...args)
      this.setStatus('loading', 'load')
      args.unshift('getData')
      this.triggerMethod(...args).then(res => {
        this.setStatus('loaded', 'load')
        // 触发生命周期加载完成事件
        this.triggerLife('loaded', this, {
          res: res,
          args: args
        })
        resolve(res)
      }, err => {
        this.setStatus('unload', 'load')
        // 触发生命周期加载失败事件
        this.triggerLife('loadFail', this, {
          res: err,
          args: args
        })
        reject(err)
      })
    }))
  }
  /**
   * 触发更新数据操作
   * @param  {...any} args 参数
   * @returns {Promise}
   */
  triggerUpdateData (...args) {
    return this.setPromise('update', new Promise((resolve, reject) => {
      this.setStatus('updating', 'update')
      // 触发生命周期更新前事件
      this.triggerLife('beforeUpdate', this, ...args)
      args.unshift('updateData')
      this.triggerMethod(...args).then(res => {
        this.setStatus('updated', 'update')
        // 触发生命周期更新完成事件
        this.triggerLife('updated', this, {
          res: res,
          args: args
        })
        resolve(res)
      }, err => {
        this.setStatus('updated', 'update')
        // 触发生命周期加载失败事件
        this.triggerLife('updateFail', this, {
          res: err,
          args: args
        })
        reject(err)
      })
    }))
  }
  /**
   * 将第一个传参的第一个参数无值时转换为空对象
   * @param {*[]} args 参数列表
   */
  formatResetOption(args) {
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
  parseResetOption(resetOption = {}, prop) {
    return _func.getProp(resetOption, prop)
  }
  /**
   * 销毁回调操作
   * @param  {...any} args 参数
   */
  destroy (...args) {
    this.formatResetOption(args)
    this.triggerLife('beforeDestroy', this, ...args)
    this.reset(...args)
    this.triggerLife('destroyed', this, ...args)
  }
  /**
   * 重置回调操作=>不清除额外数据以及生命周期函数
   * @param  {...any} args 参数
   */
  reset (...args) {
    this.formatResetOption(args)
    this.triggerLife('beforeReset', this, ...args)
    // 重置状态
    if (this.parseResetOption(args[0], 'status') !== false) {
      this.resetStatus(args[0])
    }
    this.triggerLife('reseted', this, ...args)
  }
}

BaseData._name = 'BaseData'

export default BaseData
