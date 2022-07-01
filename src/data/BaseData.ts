import _func from 'complex-func'
import DefaultData, { DefaultDataInitOption } from './DefaultData'
import ModuleData from './../mod/ModuleData'
import { offsetType } from '../mod/UpdateData'
import { formatInitOption } from '../utils'
import { anyFunction } from '../../ts'

export interface BaseDataInitOption extends DefaultDataInitOption {
  life?: LifeDataInitOption,
  data?: objectAny
}

class BaseData extends DefaultData {
  $module: ModuleData
  $getData?: anyFunction
  constructor(initOption: BaseDataInitOption) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('BaseData', 'beforeCreate', initOption)
    this.$module = new ModuleData(initOption.module, this)
    if (this.$getData) {
      this.$initLoadDepend()
    }
    this.$initBaseDataLife()
    this.$triggerCreateLife('BaseData', 'created', initOption)
  }
  /**
   * 加载生命周期函数
   */
   $initBaseDataLife() {
    // 添加重载开始生命周期回调，此时通过设置项对分页器和选项进行操作
    this.onLife('beforeReload', {
      id: 'AutoBaseDataBeforeReload',
      data: (instantiater, resetOption) => {
        if (this.$module.pagination && resetOption.page) {
          if (resetOption.page === true) {
            this.setPageData(1, 'page', true)
          } else {
            this.setPageData(resetOption.page.data, resetOption.page.prop, true)
          }
        }
        if (this.$module.choice) {
          // 根据设置和传值自动进行当前选项的重置操作
          this.autoChoiceReset(resetOption.choice)
        }
      }
    })
  }

  /* --- module start --- */
  /**
   * 设置模块
   * @param {string} modName 模块名
   * @param {object} data 模块实例
   */
  setModule(modName: string, data?: any) {
    this.$module.$setData(modName, data)
  }
  /**
   * 加载模块
   * @param {string} modName 模块名
   * @param {object} data 模块实例
   */
  installModule(modName, data) {
    return this.$module.$installData(modName, data)
  }
  /**
   * 卸载模块
   * @param {string} modName 模块名
   * @returns {object | undefined} 卸载的模块
   */
  uninstallModule(modName) {
    return this.$module.$uninstallData(modName)
  }
  /**
   * 触发指定模块的指定函数
   * @param {string} modName 模块名
   * @param {string} method 函数名
   * @param {*[]} args 参数
   * @returns {*}
   */
  triggerModuleMethod(modName, method, args) {
    this.$module.$triggerMethod(modName, method, args)
  }
  /* --- module end --- */

  /* --- Status start --- */
  /**
   * 设置状态
   * @param {*} data 状态value值
   * @param {*} prop 需要设置的状态
   * @param {*} act 操作判断值 count模式下启用，可选不传/init/reset，基本不用传
   */
  setStatus(data: PropertyKey, prop: string = 'operate', act?: 'init' | 'reset') {
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
   * 恢复状态
   */
  resetStatus() {
    this.$module.status.reset()
  }
  /* --- status end --- */

  /* --- option start --- */
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
  /* --- option end --- */

  /* --- promise start --- */
  setPromise(prop, promisedata) {
    return this.$module.promise.setData(prop, promisedata)
  }
  getPromise(prop) {
    return this.$module.promise.getData(prop)
  }
  triggerPromise(prop, option = {}) {
    return this.$module.promise.triggerData(prop, option)
  }
  /* --- promise end --- */

  /* --- update start --- */
  setUpdateOffset (offset: offsetType) {
    this.$module.update.setOffset(offset)
  }
  /**
   * 开始更新
   */
  startUpdate (offset?: number) {
    this.$module.update.start(offset)
  }
  /**
   * 立即更新
   */
  updateImmerdiate () {
    this.$module.update.updateImmerdiate()
  }
  /**
   * 自动更新
   */
  autoStartUpdate (offset?: number) {
    this.$module.update.autoStart(offset)
  }
  // /**
  //  * 触发下一次定时
  //  */
  // nextUpdate (...args) {
  //   this.$module.update.next(...args)
  // }
  /**
   * 清除更新
   */
  clearUpdate (next?: boolean) {
    this.$module.update.clear(next)
  }
  /**
   * 重置更新
   */
  resetUpdate () {
    this.$module.update.reset()
  }
  /* --- update end --- */

  /* --- dictionary start --- */
  /**
   * 重新构建字典列表
   * @param {*} dictionary 字典列表构建参数
   * @param {*} type :type 字典构建类型
   */
  rebuildDictionary (dictionaryOption, type) {
    this.$module.dictionary.rebuildData(dictionaryOption, type)
  }
  /**
   * 获取字典对象
   * @param {*} data 值
   * @param {'prop' | 'id'} from 获取类型
   * @returns {DictionaryData}
   */
  getDictionaryItem(data, from) {
    return this.$module.dictionary.getItem(data, from)
  }
  /**
   * 设置字典值
   * @param {*} data 值
   * @param {'data' | 'prop'} [target = 'data'] 目标属性
   * @param {'id' | 'parentId' | 'children'} [prop = 'id'] 目标
   */
  setDictionaryPropData (data, target, prop) {
    this.$module.dictionary.setPropData(data, target, prop)
  }
  /**
   * 获取字典值
   * @param {'data' | 'prop'} [target = 'data'] 目标属性
   * @param {'id' | 'parentId' | 'children'} [prop = 'id'] 目标
   * @returns {*}
   */
  getDictionaryPropData (target, prop) {
    return this.$module.dictionary.getPropData(target, prop)
  }
  /**
   * 获取符合模块要求的字典列表
   * @param {string} mod 模块名称
   * @returns {DictionaryData[]}
   */
  getDictionaryModList (mod) {
    return this.$module.dictionary.getModList(mod)
  }
  /**
   * 获取符合模块要求的字典page列表
   * @param {string} modType 模块名称
   * @param {object} [payload] 参数
   * @returns {*[]}
   */
  getDictionaryPageList (modType, payload) {
    return this.$module.dictionary.getPageList(modType, payload)
  }
  /**
   * 将模块列表根据payload转换为页面需要数据的列表
   * @param {string} modType 模块名称
   * @param {DictionaryData[]} modList 模块列表
   * @param {object} [payload] 参数
   * @returns {*[]}
   */
  getDictionaryPageListByModList (modType, modList, payload) {
    return this.$module.dictionary.getPageListByModList(modType, modList, payload)
  }
  /**
   * 根据模块列表生成对应的form对象
   * @param {DictionaryData[]} modList 模块列表
   * @param {string} modType 模块名称
   * @param {*} originData 初始化数据
   * @param {object} option 设置项
   * @param {object} [option.form] 目标form数据
   * @param {string} [option.from] 调用来源
   * @param {string[]} [option.limit] 限制重置字段=>被限制字段不会进行重新赋值操作
   * @returns {object}
   */
  buildDictionaryFormData (modList, modType, originData, option) {
    return this.$module.dictionary.buildFormData(modList, modType, originData, option)
  }
  /**
   * 根据源数据格式化生成对象
   * @param {object} originData 源数据
   * @param {string} [originFrom] 来源originFrom
   * @param {object} [option] 设置项
   * @returns {object}
   */
  buildData (originData, originFrom = 'list', option) {
    return this.$module.dictionary.buildData(originData, originFrom, option)
  }
  /**
   * 根据源数据更新数据
   * @param {object} targetData 目标数据
   * @param {object} originData 源数据
   * @param {string} [originFrom] 来源originFrom
   * @param {object} [option] 设置项
   * @returns {object}
   */
  updateData (targetData, originData, originFrom = 'info', option) {
    return this.$module.dictionary.updateData(targetData, originData, originFrom, option)
  }
  /**
   * 格式化列表数据
   * @param {object[]} targetList 目标列表
   * @param {object[]} originList 源数据列表
   * @param {string} [originFrom] 来源originFrom
   * @param {object} [option] 设置项
   */
  formatListData (targetList, originList, originFrom, option) {
    this.$module.dictionary.formatListData(targetList, originList, originFrom, option)
  }
  // /**
  //  * 根据源数据格式化生成对象并更新到targetData中
  //  * @param {object} targetData 目标数据
  //  * @param {object} originData 源数据
  //  * @param {string} [originFrom] 来源originFrom
  //  * @param {object} [option] 更新设置项
  //  */
  // formatItemData (targetData, originData, originFrom, option = {}) {
  //   if (!option.type) {
  //     option.type = 'add'
  //   }
  //   let item = this.formatItem(originData, originFrom)
  //   _func.updateData(targetData, item, option)
  // }
  /**
   * 基于formdata和模块列表返回编辑完成的数据
   * @param {object} formData form数据
   * @param {DictionaryData[]} modList 模块列表
   * @param {string} modType modType
   * @returns {object}
   */
  getEditData (formData, modList, modType) {
    return this.$module.dictionary.getEditData(formData, modList, modType)
  }
  /* --- dictionary end --- */

  /* --- pagination start --- */
  /**
   * 获取分页器数据
   * @param {'page' | 'size' | 'num'} [prop] 获取'page' | 'size' | 'num'数据或者current{page,size}数据
   * @returns {number | { page, size }}
   */
   getPageData (prop) {
    let data
    if (this.$module.pagination) {
      data = this.$module.pagination.getData(prop)
    }
    return data
  }
  /**
   * 重置分页器
   */
  resetPageData () {
    if (this.$module.pagination) {
      this.$module.pagination.reset()
    }
  }
  /**
   * 设置分页器数据
   * @param {number} data 需要设置的属性值
   * @param {'page' | 'size' | 'num'} [prop = 'page'] 需要设置的参数'page' | 'size' | 'num'
   */
  setPageData (data, prop = 'page', unTriggerLife) {
    if (this.$module.pagination) {
      if (prop == 'page') {
        this.$module.pagination.setPage(data, unTriggerLife)
      } else if (prop == 'size') {
        this.$module.pagination.setSizeAndPage(data, unTriggerLife) // { size, page }
      } else if (prop == 'num') {
        this.$module.pagination.setTotal(data)
      }
    }
  }
  /* --- pagination end --- */

  /* --- choice start --- */
  /**
   * 根据option, defaultOption自动判断重置与否
   * @param {object | string} [option] 参数
   * @param {object | string} [defaultOption] 默认参数
   */
  autoChoiceReset(data) {
    if (this.$module.choice) {
      this.$module.choice.autoReset(data)
    }
  }
  /**
   * 数据变更=>id作为唯一基准
   * @param {string[]} idList ID列表
   * @param {object[]} currentList ITEM列表
   * @param {'auto' | 'force'} [check = 'auto'] 检查判断值,auto在长度相等时直接认为格式符合，否则进行格式化判断
   * @param {string} [idProp] id的属性,不存在时自动从DL中获取
   */
  changeChoice(idList, currentList, check, idProp) {
    if (this.$module.choice) {
      if (!idProp) {
        idProp = this.getDictionaryPropData('prop', 'id')
      }
      this.$module.choice.changeData(idList, currentList, check, idProp)
    }
  }
  /**
   * 重置操作
   * @param {boolean} force 重置判断值
   */
  resetChoice(force) {
    if (this.$module.choice) {
      this.$module.choice.reset(force)
    }
  }
  /**
   * 获取选项数据
   * @param {'id' | 'list'} [prop] 存在prop获取data[prop]，否则获取{id, list}
   * @returns {string[] | object[] | {id, list}}
   */
  getChoiceData (prop) {
    if (this.$module.choice) {
      return this.$module.choice.getData(prop)
    }
  }
  /* --- choice end --- */

  /* --- search start --- */
  /**
   * 设置数据
   */
  setSearch () {
    this.$module.search.setData()
  }
  /**
   * 重置检索值
   * @param {'init' | 'reset'} from 请求来源
   * @param {object} option 设置项
   * @param {string[]} [option.limit] 限制重置字段=>被限制字段不会进行重新赋值操作
   * @param {boolean} syncToData 同步到data中
   */
  resetSearch (from: 'init' | 'reset' = 'reset', option, syncToData) {
    this.$module.search.resetFormData(from, option, syncToData)
  }
  /**
   * 获取当前检索数据
   * @param {boolean | object} [deep = true] 是否深拷贝
   * @returns {object}
   */
  getSearch (deep) {
    return this.$module.search.getData(deep)
  }
  /* --- search end --- */

  /* --- load start --- */
  $initLoadDepend() {
    if (!this.$module.status) {
      this.setModule('status')
    }
    if (!this.$module.promise) {
      this.setModule('promise')
    }
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
      this.$triggerGetData(...args)
    } else if (loadStatus.value == 'loading') {
      // 直接then
      if (force && force.ing) {
        this.$triggerGetData(...args)
      }
    } else if (loadStatus.value == 'loaded') {
      if (force) {
        this.$triggerGetData(...args)
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
  triggerMethod (target: string | anyFunction, ...args: any[]) {
    let next = {
      data: false,
      promise: null,
      msg: '',
      code: ''
    }
    let type = _func.getType(target)
    if (type === 'string') {
      if (this[(target as string)]) {
        if (_func.getType(this[(target as string)]) === 'function') {
          next.promise = this[(target as string)](...args)
        } else {
          next.msg = `${target}属性非函数类型，triggerMethod函数触发失败！`
          next.code = 'not function'
        }
      } else {
        next.msg = `不存在${target}函数，triggerMethod函数触发失败！`
        next.code = 'no method'
      }
    } else if (type === 'function') {
      next.promise = (target as anyFunction)(...args)
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
  $triggerGetData (...args) {
    return this.setPromise('load', new Promise((resolve, reject) => {
      // 触发生命周期加载前事件
      this.triggerLife('beforeLoad', this, ...args)
      this.setStatus('loading', 'load')
      args.unshift('$getData')
      this.triggerMethod(...(args as [string, ...any])).then(res => {
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
  /* --- load end --- */

  /* --- reset start --- */

  /**
   * 清空数组
   * @param {array} list 数组
   */
  resetArray(list = []) {
    _func.clearArray(list)
  }
  /**
   * 清空对象
   * @param {object} data 对象
   */
  resetObject(data = {}) {
    for (let prop in data) {
      delete data[prop]
    }
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
  parseResetOption(resetOption = {}, prop: string) {
    return _func.getProp(resetOption, prop)
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
      this.resetStatus()
    }
    this.triggerLife('reseted', this, ...args)
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
  /* --- reset end --- */
}

BaseData.$name = 'BaseData'

export default BaseData
