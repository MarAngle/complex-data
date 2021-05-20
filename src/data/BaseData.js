import _func from 'complex-func'
import DefaultData from './DefaultData'
import OptionData from './../mod/OptionData'
import StatusData from './../mod/StatusData'
import UpdateData from './../mod/UpdateData'
import PromiseData from './../mod/PromiseData'

class BaseData extends DefaultData {
  constructor (initdata) {
    if (!initdata) {
      initdata = {}
    }
    super(initdata)
    this.triggerCreateLife('BaseData', 'beforeCreate', initdata)
    this.setModule('option', new OptionData())
    this._initBaseData(initdata)
    this.triggerCreateLife('BaseData', 'created')
  }
  _initBaseData ({
    status,
    update
  }) {
    this.setModule('status', new StatusData(status))
    this.setModule('promise', new PromiseData())
    if (update) {
      this.setModule('update', new UpdateData(update))
    }
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
  // 获取对应状态的值
  getStatus (prop = 'operate') {
    return this.getModule('status').getData(prop)
  }
  // 恢复状态
  resetStatus () {
    this.getModule('status').reset()
  }
  // promise相关函数
  setPromise (prop, promisedata) {
    return this.getModule('promise').setData(prop, promisedata)
  }
  getPromise (prop) {
    return this.getModule('promise').getData(prop)
  }
  triggerPromise (prop, option = {}) {
    return this.getModule('promise').triggerData(prop, option)
  }

  // 更新相关操作
  setUpdateOffset (offset) {
    this.triggerUpdateMethod('setOffset', offset)
  }
  // 开始更新
  startUpdate (payload) {
    this.triggerUpdateMethod('start', payload)
  }
  // 自动更新
  autoStartUpdate (payload) {
    this.triggerUpdateMethod('autoStart', payload)
  }
  // 触发下一次定时
  nextUpdate (payload) {
    this.triggerUpdateMethod('next', payload)
  }
  // 清除更新
  clearUpdate (payload) {
    this.triggerUpdateMethod('clear', payload)
  }
  // 重置更新
  resetUpdate (payload) {
    this.triggerUpdateMethod('reset', payload)
  }
  triggerUpdateMethod (method, payload, hideError) {
    if (this.getModule('update')) {
      if (this.getModule('update')[method]) {
        this.getModule('update')[method](payload)
      } else {
        this.printMsg(`更新模块不存在${method}方法`)
      }
    } else if (!hideError) {
      this.printMsg(`未定义更新模块`)
    }
  }
  // 自动加载或者更新数据
  autoLoadData (next, ...args) {
    return new Promise((resolve, reject) => {
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
        this.loadData(...args).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      } else if (next == 'update') {
        args.splice(0, 1, false) // update强制换取，此处设置为ing状态不重新拉取
        this.loadUpdateData(...args).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      } else {
        resolve({ next: next, target: target })
      }
    })
  }
  /*
  数据相关函数定义
  加载判断load是否加载成功和强制判断值
  */
  loadData (force, ...args) {
    return new Promise((resolve, reject) => {
      let loadStatus = this.getStatus('load')
      if (loadStatus.value == 'unload') {
        this.triggerGetData(...args)
      } else if (loadStatus.value == 'loading') {
        // 直接then
        if (force) {
          // force = { ing: true }
          if (typeof force == 'object' && force.ing) {
            this.triggerGetData(...args)
          }
        }
      } else if (loadStatus.value == 'loaded') {
        if (force) {
          this.triggerGetData(...args)
        }
      }
      this.triggerPromise('load', {
        errmsg: this.buildPrintMsg(`promise模块无load数据(load状态:${loadStatus.value})`)
      }).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  }
  /*
  实现更新函数
  加载判断当前更新状态
  */
  loadUpdateData (force, ...args) {
    return new Promise((resolve, reject) => {
      let updateStatus = this.getStatus('update')
      if (updateStatus.value == 'updated') {
        this.triggerUpdateData(...args)
      } else { // updating
        // 直接then'
        if (force) {
          this.triggerUpdateData(...args)
        }
      }
      this.triggerPromise('update', {
        errmsg: this.buildPrintMsg(`promise模块无update数据(update状态:${updateStatus.value})`)
      }).then(res => {
        resolve(res)
      }, err => {
        reject(err)
      })
    })
  }

  // 触发目标函数并伴随对应的操作值变动--未发现对应函数时报错
  triggerMethod (target, ...args) {
    return new Promise((resolve, reject) => {
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

  // 触发目标函数并伴随对应的操作值变动--未发现对应函数时报错
  triggerMethodByOperate (target, ...args) {
    return new Promise((resolve, reject) => {
      let operate = this.getStatus()
      if (operate.value == 'operated') {
        this.triggerMethod(target, ...args).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      } else {
        this.printMsg(`当前操作状态为:${operate.label}，${target}函数操作互斥，triggerMethodByOperate函数失败！`)
        reject({ status: 'fail', code: 'clash' })
      }
    })
  }

  // 触发加载数据操作
  triggerGetData (...args) {
    return this.setPromise('load', new Promise((resolve, reject) => {
      // 触发生命周期加载前事件
      this.triggerLife('beforeLoad', ...args)
      this.setStatus('loading', 'load')
      args.unshift('getData')
      this.triggerMethod(...args).then(res => {
        this.setStatus('loaded', 'load')
        // 触发生命周期加载完成事件
        this.triggerLife('loaded', ...args)
        resolve(res)
      }, err => {
        this.setStatus('unload', 'load')
        // 触发生命周期加载失败事件
        this.triggerLife('loadFail', ...args)
        reject(err)
      })
    }))
  }
  // 触发更新数据操作
  triggerUpdateData (...args) {
    return this.setPromise('update', new Promise((resolve, reject) => {
      this.setStatus('updating', 'update')
      // 触发生命周期更新前事件
      this.triggerLife('beforeUpdate', ...args)
      args.unshift('updateData')
      this.triggerMethod(...args).then(res => {
        this.setStatus('updated', 'update')
        // 触发生命周期更新完成事件
        this.triggerLife('updated', ...args)
        resolve(res)
      }, err => {
        this.setStatus('updated', 'update')
        // 触发生命周期加载失败事件
        this.triggerLife('updateFail', ...args)
        reject(err)
      })
    }))
  }
  // 将第一个传参的第一个参数无值时转换为空对象
  formatResetModule(args) {
    if (!args[0]) {
      args[0] = {}
    }
  }
  parseResetModule(resetModule = {}, prop) {
    return _func.getProp(resetModule, prop)
  }
  // 销毁回调操作
  destroy (...args) {
    this.formatResetModule(args)
    this.triggerLife('beforeDestroy', ...args)
    this.reset(...args)
    this.triggerLife('destroyed', ...args)
  }
  // 重置回调操作=>不清楚额外数据以及生命周期函数
  reset (...args) {
    this.formatResetModule(args)
    this.triggerLife('beforeReset', ...args)
    // 重置状态
    if (this.parseResetModule(args[0], 'status') !== false) {
      this.resetStatus(args[0])
    }
    this.triggerLife('reseted', ...args)
  }
}

export default BaseData
