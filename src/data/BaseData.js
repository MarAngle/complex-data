import _func from 'complex-func'
import DefaultData from './DefaultData'
import ModuleData from './../mod/ModuleData'

let defaultModuleOption = {
  status: {
    data: false
  },
  promise: {
    data: false
  },
  option: {
    data: false
  },
  update: {
    data: {
      data: false
    }
  },
  dictionary: {
    data: false
  },
  choice: {
    data: false
  },
  pagination: {
    data: false
  },
  search: {
    data: false
  }
}

class BaseData extends DefaultData {
  constructor(initOption, moduleOption) {
    if (!initOption) {
      initOption = {}
    }
    super(initOption)
    this.triggerCreateLife('BaseData', 'beforeCreate', initOption)
    this.$module = new ModuleData({
      status: initOption.status,
      promise: initOption.promise,
      option: initOption.option,
      update: initOption.update,
      dictionary: initOption.dictionary,
      choice: initOption.choice,
      pagination: initOption.pagination,
      search: initOption.search
    }, this, moduleOption, defaultModuleOption)
    this.$module.$initModule(initOption.module)
    this.triggerCreateLife('BaseData', 'created', initOption)
  }
  /**
   * 设置模块
   * @param {string} modName 模块名
   * @param {object} data 模块实例
   */
  setModule(modName, data) {
    this.$module.setData(modName, data)
  }
  /**
   * 加载模块
   * @param {string} modName 模块名
   * @param {object} data 模块实例
   */
  installModule(modName, data) {
    return this.$module.installData(modName, data)
  }
  triggerModuleMethod(modName, method, args) {
    this.$module.triggerMethod(modName, method, args)
  }
  /**
   * 卸载模块
   * @param {string} modName 模块名
   * @returns {object | undefined} 卸载的模块
   */
  uninstallModule(modName) {
    return this.$module.uninstallData(modName)
  }
  /**
   * 设置状态
   * @param {*} data 状态value值
   * @param {*} prop 需要设置的状态
   * @param {*} act 操作判断值 count模式下启用，可选不传/init/reset，基本不用传
   */
  setStatus(data, prop = 'operate', act) {
    this.$module.status.setData(prop, data, act)
  }
  /**
   * 获取对应状态的值
   * @param {string} prop 对应状态
   * @returns {*}
   */
  getStatus(prop = 'operate') {
    return this.$module.status.getData(prop)
  }
  /**
   * 设置option
   * @param {string} prop 指定属性名
   * @param {*} optiondata 指定属性的设置参数数据
   * @param {string} type 操作来源
   */
  setOption(prop, optiondata, type) {
    this.$module.option.setData(prop, optiondata, type)
  }
  /**
   * 获取设置
   * @param {string} prop 属性
   * @returns {*}
   */
  getOption(prop) {
    return this.$module.option.getData(prop)
  }
  /**
   * 恢复状态
   */
  resetStatus() {
    this.$module.status.reset()
  }
  setPromise(prop, promisedata) {
    return this.$module.promise.setData(prop, promisedata)
  }
  getPromise(prop) {
    return this.$module.promise.getData(prop)
  }
  triggerPromise(prop, option = {}) {
    return this.$module.promise.triggerData(prop, option)
  }
  setUpdateOffset (...args) {
    this.$module.upate.setOffset(...args)
  }
  /**
   * 开始更新
   */
  startUpdate (...args) {
    this.$module.upate.start(...args)
  }
  /**
   * 立即更新
   */
  updateImmerdiate (...args) {
    this.$module.upate.updateImmerdiate(...args)
  }
  /**
   * 自动更新
   */
  autoStartUpdate (...args) {
    this.$module.upate.autoStart(...args)
  }
  /**
   * 触发下一次定时
   */
  nextUpdate (...args) {
    this.$module.upate.next(...args)
  }
  /**
   * 清除更新
   */
  clearUpdate (...args) {
    this.$module.upate.clear(...args)
  }
  /**
   * 重置更新
   */
  resetUpdate (...args) {
    this.$module.upate.reset(...args)
  }
  /**
   * 数据相关函数定义
   * 加载判断load是否加载成功和强制判断值
   * @param {boolean | object} [force] 强制加载判断值，ing属性为ing强制更新判断值
   * @param  {...any} args getData参数列表
   * @returns {Promise}
   */
  loadData(force, ...args) {
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
      errmsg: this.$createMsg(`promise模块无load数据(load状态:${loadStatus.value})`),
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
          next.code = 'not function'
        }
      } else {
        next.msg = `不存在${target}函数，triggerMethod函数触发失败！`
        next.code = 'no method'
      }
    } else if (type === 'function') {
      next.promise = target(...args)
    } else {
      next.msg = `target参数接受string/function[promise]，当前值为${target}，triggerMethod函数触发失败！`
      next.code = 'not function'
    }
    if (next.promise) {
      if (_func.isPromise(next.promise)) {
        next.data = true
      } else {
        next.msg = `target参数为function时需要返回promise，当前返回${next.promise}，triggerMethod函数触发失败！`
        next.code = 'not promise'
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
        this.$exportMsg(next.msg)
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
      this.$exportMsg(`当前操作状态为:${operate.label}，${target}函数操作互斥，triggerMethodByOperate函数失败！`)
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

BaseData.$name = 'BaseData'

export default BaseData
