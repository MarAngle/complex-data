import $func from 'complex-func'
import DefaultData, { DefaultDataInitOption } from './DefaultData'
import ModuleData, { ModuleDataInitOption, moduleKeys } from './../mod/ModuleData'
import { formatInitOption } from '../utils'
import { LifeDataInitOption } from '../mod/LifeData'
import { anyFunction, anyPromiseFunction, objectAny } from '../../ts'
import { offsetType } from '../mod/UpdateData'
import DictionaryItem, { DictionaryItemInitOption } from '../mod/DictionaryItem'
import { formatOption, formatOptionBuild, formDataOption } from '../mod/DictionaryList'


export interface forceObjectType {
  [prop: string]: boolean | string
}

export type forceType = boolean | forceObjectType

export interface BaseDataInitOption extends DefaultDataInitOption {
  life?: LifeDataInitOption,
  module?: ModuleDataInitOption
}


export interface BaseDataReloadOptionType {
  [prop: string]: undefined | boolean
}
export type BaseDataReloadOption = undefined | boolean | BaseDataReloadOptionType


class BaseData extends DefaultData {
  $module: ModuleData
  $getData?: anyPromiseFunction
  constructor(initOption: BaseDataInitOption) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('BaseData', 'beforeCreate', initOption)
    this.$module = new ModuleData(initOption.module, this)
    if (this.$getData) {
      this.$initLoadDepend()
    }
    this.$triggerCreateLife('BaseData', 'created', initOption)
  }
  /* --- module start --- */
  /**
   * 设置模块
   * @param {string} modName 模块名
   * @param {object} data 模块实例
   */
  $setModule(modName: moduleKeys, data?: any) {
    this.$module.$setData(modName, data)
  }
  /**
   * 加载模块
   * @param {string} modName 模块名
   * @param {object} data 模块实例
   */
  $installModule(modName: moduleKeys, data: any) {
    return this.$module.$installData(modName, data)
  }
  /**
   * 卸载模块
   * @param {string} modName 模块名
   * @returns {object | undefined} 卸载的模块
   */
  $uninstallModule(modName: moduleKeys) {
    return this.$module.$uninstallData(modName)
  }
  /* --- module end --- */

  /* --- Status start --- */
  /**
   * 设置状态
   * @param {*} data 状态value值
   * @param {*} prop 需要设置的状态
   * @param {*} act 操作判断值 count模式下启用，可选不传/init/reset，基本不用传
   */
  $setStatus(data: string, prop = 'operate', act?: 'init' | 'reset') {
    this.$module.status!.setData(prop, data, act)
  }
  /**
   * 获取对应状态的值
   * @param {string} prop 对应状态
   * @returns {*}
   */
  $getStatus(prop = 'operate') {
    return this.$module.status!.getData(prop)
  }
  /**
   * 恢复状态
   */
  $resetStatus() {
    this.$module.status!.reset()
  }
  /* --- status end --- */

  /* --- option start --- */
  /**
   * 设置option
   * @param {string} prop 指定属性名
   * @param {*} optiondata 指定属性的设置参数数据
   * @param {string} type 操作来源
   */
  $setOption(prop: string, optiondata: unknown, type: string) {
    this.$module.option!.setData(prop, optiondata, type)
  }
  /**
   * 获取设置
   * @param {string} prop 属性
   * @returns {*}
   */
  $getOption(prop?: string) {
    if (prop) {
      return this.$module.option!.getData(prop)
    } else {
      return this.$module.option!.getData()
    }
  }
  /* --- option end --- */

  /* --- promise start --- */
  $setPromise(prop: string, promisedata: Promise<any>) {
    return this.$module.promise!.setData(prop, promisedata)
  }
  $getPromise(prop: string) {
    return this.$module.promise!.getData(prop)
  }
  $triggerPromise(prop: string, option = {}) {
    return this.$module.promise!.triggerData(prop, option)
  }
  /* --- promise end --- */


  /* --- update start --- */
  $setUpdateOffset (offset: offsetType) {
    this.$module.update!.setOffset(offset)
  }
  /**
   * 开始更新
   */
  $startUpdate (offset?: number) {
    this.$module.update!.start(offset)
  }
  /**
   * 立即更新
   */
  $updateImmerdiate () {
    this.$module.update!.updateImmerdiate()
  }
  /**
   * 自动更新
   */
  $autoStartUpdate (offset?: number) {
    this.$module.update!.autoStart(offset)
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
  $clearUpdate (next?: boolean) {
    this.$module.update!.clear(next)
  }
  /**
   * 重置更新
   */
  $resetUpdate () {
    this.$module.update!.reset()
  }
  /* --- update end --- */


  /* --- dictionary start --- */
  /**
   * 重新构建字典列表
   * @param {*} dictionary 字典列表构建参数
   * @param {*} type :type 字典构建类型
   */
  $rebuildDictionary (dictionaryOption: DictionaryItemInitOption[], type: string) {
    this.$module.dictionary!.rebuildData(dictionaryOption, type)
    this.$syncData('rebuildDictionary')
  }
  /**
   * 获取字典对象
   * @param {*} data 值
   * @param {string} [prop] 判断的属性
   * @returns {DictionaryData}
   */
  $getDictionaryItem (data: string): undefined | DictionaryItem
  $getDictionaryItem (data: any, prop: string): undefined | DictionaryItem
  $getDictionaryItem (data: string | any, prop?: string) {
    if (!prop) {
      return this.$module.dictionary!.getItem(data)
    } else {
      return this.$module.dictionary!.getItem(data, prop)
    }
  }
  /**
   * 设置字典值
   * @param {*} data 值
   * @param {'data' | 'prop'} [target = 'data'] 目标属性
   * @param {'id' | 'parentId' | 'children'} [prop = 'id'] 目标
   */
  $setDictionaryPropData (data: any, target:'data' | 'prop' = 'data', prop: 'id' | 'parentId' | 'children' = 'id') {
    this.$module.dictionary!.$setPropData(data, target, prop)
    this.$syncData('setDictionaryPropData')
  }
  /**
   * 获取字典值
   * @param {'data' | 'prop'} [target = 'data'] 目标属性
   * @param {'id' | 'parentId' | 'children'} [prop = 'id'] 目标
   * @returns {*}
   */
  $getDictionaryPropData (target:'data' | 'prop' = 'data', prop: 'id' | 'parentId' | 'children' = 'id') {
    return this.$module.dictionary!.$getPropData(target, prop)
  }
  /**
   * 获取符合模块要求的字典列表
   * @param {string} modType 模块名称
   * @param {object} [payload] 参数
   * @returns {DictionaryItem[]}
   */
  $getDictionaryList (modType: string, dataMap?: Map<string, DictionaryItem>) {
    return this.$module.dictionary!.$getList(modType, dataMap)
  }
  /**
   * 获取符合模块要求的字典PageList列表
   * @param {string} modType 模块名称
   * @param {object} [payload] 参数
   * @returns {DictionaryItem[]}
   */
  $getDictionaryPageList (modType: string, payload?: objectAny) {
    return this.$module.dictionary!.$getPageList(modType, payload)
  }
  /**
   * 获取符合模块要求的字典PageList列表
   * @param {string} modType 模块名称
   * @param {object} [payload] 参数
   * @returns {DictionaryItem[]}
   */
   $buildDictionaryPageList (modType: string, list: DictionaryItem[], payload?: objectAny) {
    return this.$module.dictionary!.$buildPageList(modType, list, payload)
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
   $buildDictionaryFormData (modList: DictionaryItem[], modType: string, originData: any, option:formDataOption = {}) {
    return this.$module.dictionary!.$buildFormData(modList, modType, originData, option)
  }
  /**
   * 根据源数据格式化生成对象
   * @param {object} originData 源数据
   * @param {string} [originFrom] 来源originFrom
   * @param {object} [option] 设置项
   * @returns {object}
   */
   $buildData (originData:objectAny, originFrom?: string, option?: formatOptionBuild) {
    return this.$module.dictionary!.buildData(originData, originFrom, option)
  }
  /**
   * 根据源数据更新数据
   * @param {object} targetData 目标数据
   * @param {object} originData 源数据
   * @param {string} [originFrom] 来源originFrom
   * @param {object} [option] 设置项
   * @returns {object}
   */
   $updateData (targetData: objectAny, originData: formatOptionBuild, originFrom?: string, option?: formatOptionBuild) {
    return this.$module.dictionary!.updateData(targetData, originData, originFrom, option)
  }
  /**
   * 格式化列表数据
   * @param {object[]} targetList 目标列表
   * @param {object[]} originList 源数据列表
   * @param {string} [originFrom] 来源originFrom
   * @param {object} [option] 设置项
   */
   $formatListData (targetList: objectAny[], originList: objectAny[], originFrom = 'list', option:formatOption = {}) {
    this.$module.dictionary!.formatListData(targetList, originList, originFrom, option)
    this.$syncData('formatListData')
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
  $buildEditData (formData: objectAny, modList: DictionaryItem[], modType: string) {
    return this.$module.dictionary!.$buildEditData(formData, modList, modType)
  }
  /* --- dictionary end --- */



  /* --- pagination start --- */
  /**
   * 获取分页器数据
   * @param {'page' | 'size' | 'num'} [prop] 获取'page' | 'size' | 'num'数据或者current{page,size}数据
   * @returns {number | { page, size }}
   */
  $getPageData (prop?: 'page' | 'size' | 'num' | 'totalPage') {
    let data
    if (this.$module.pagination) {
      if (prop) {
        data = this.$module.pagination.getData(prop)
      } else {
        data = this.$module.pagination.getData()
      }
    }
    return data
  }
  /**
   * 重置分页器
   */
  $resetPagination () {
    if (this.$module.pagination) {
      this.$module.pagination.reset()
    }
  }
  /**
   * 设置分页器数据
   * @param {number} data 需要设置的属性值
   * @param {'page' | 'size' | 'num'} [prop = 'page'] 需要设置的参数'page' | 'size' | 'num'
   */
  $setPageData (data: number, prop?: 'page' | 'size', unTriggerLife?: boolean): void
  $setPageData (data: number, prop: 'num', unTriggerLife?: boolean): void
  $setPageData (data: { page: number, size: number }, prop: 'sizeAndPage', unTriggerLife?: boolean): void
  $setPageData (data: number | { page: number, size: number }, prop: 'page' | 'size' | 'num' | 'sizeAndPage' = 'page', unTriggerLife?: boolean) {
    if (this.$module.pagination) {
      if (prop == 'page') {
        this.$module.pagination.setPage(data as number, unTriggerLife)
      } else if (prop == 'size') {
        this.$module.pagination.setSize(data as number, unTriggerLife) // { size, page }
      } else if (prop == 'sizeAndPage') {
        this.$module.pagination.setSizeAndPage(data as { page: number, size: number }, unTriggerLife) // { size, page }
      } else if (prop == 'num') {
        this.$module.pagination.setTotal(data as number)
      }
    }
  }
  /* --- pagination end --- */


  /* --- choice start --- */
  // /**
  //  * 根据option, defaultOption自动判断重置与否
  //  * @param {object | string} [option] 参数
  //  * @param {object | string} [defaultOption] 默认参数
  //  */
  //  autoChoiceReset(data) {
  //   if (this.$module.choice) {
  //     this.$module.choice.autoReset(data)
  //   }
  // }
  // /**
  //  * 数据变更=>id作为唯一基准
  //  * @param {string[]} idList ID列表
  //  * @param {object[]} currentList ITEM列表
  //  * @param {'auto' | 'force'} [check = 'auto'] 检查判断值,auto在长度相等时直接认为格式符合，否则进行格式化判断
  //  * @param {string} [idProp] id的属性,不存在时自动从DL中获取
  //  */
  // changeChoice(idList, currentList, check, idProp) {
  //   if (this.$module.choice) {
  //     if (!idProp) {
  //       idProp = this.getDictionaryPropData('prop', 'id')
  //     }
  //     this.$module.choice.changeData(idList, currentList, check, idProp)
  //   }
  // }
  // /**
  //  * 重置操作
  //  * @param {boolean} force 重置判断值
  //  */
  // resetChoice(force) {
  //   if (this.$module.choice) {
  //     this.$module.choice.reset(force)
  //   }
  // }
  // /**
  //  * 获取选项数据
  //  * @param {'id' | 'list'} [prop] 存在prop获取data[prop]，否则获取{id, list}
  //  * @returns {string[] | object[] | {id, list}}
  //  */
  // getChoiceData (prop) {
  //   if (this.$module.choice) {
  //     return this.$module.choice.getData(prop)
  //   }
  // }
  /* --- choice end --- */

  
  /* --- search start --- */
  // /**
  //  * 设置数据
  //  */
  // setSearch () {
  //   this.$module.search!.setData()
  // }
  // /**
  //  * 重置检索值
  //  * @param {'init' | 'reset'} from 请求来源
  //  * @param {object} option 设置项
  //  * @param {string[]} [option.limit] 限制重置字段=>被限制字段不会进行重新赋值操作
  //  * @param {boolean} syncToData 同步到data中
  //  */
  // resetSearch (from: 'init' | 'reset' = 'reset', option: any, syncToData: any) {
  //   this.$module.search!.resetFormData(from, option, syncToData)
  // }
  // /**
  //  * 获取当前检索数据
  //  * @param {boolean | object} [deep = true] 是否深拷贝
  //  * @returns {object}
  //  */
  // getSearch (deep: any) {
  //   return this.$module.search!.getData(deep)
  // }
  /* --- search end --- */


 /* --- load start --- */
  $initLoadDepend() {
    if (!this.$module.status) {
      this.$setModule('status')
    }
    if (!this.$module.promise) {
      this.$setModule('promise')
    }
  }
/**
 * 数据相关函数定义
 * 加载判断load是否加载成功和强制判断值
 * @param {boolean | object} [force] 强制加载判断值，ing属性为ing强制更新判断值
 * @param  {...any} args getData参数列表
 * @returns {Promise}
 */
 $loadData(force?: forceType, ...args: any[]) {
  if (force === true) {
    force = {}
  }
  const loadStatus = this.$getStatus('load')
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
  return this.$triggerPromise('load', {
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
$reloadData (option: BaseDataReloadOption, ...args: any[]) {
  const optionType = $func.getType(option)
  if (optionType === 'boolean') {
    option = {
      force: option as boolean
    }
  } else if (optionType !== 'object') {
    option = {}
  }
  option = option as BaseDataReloadOptionType
  this.$triggerLife('beforeReload', this, option, ...args)
  // 同步判断值
  const sync = option.sync
  const force = option.force === undefined ? {} : option.force
  const promise = this.$loadData(force, ...args)
  if (sync) {
    promise.then((res) => {
      // 触发生命周期重载完成事件
      this.$triggerLife('reloaded', this, {
        res: res,
        args: args
      })
    }, err => {
      console.error(err)
      // 触发生命周期重载失败事件
      this.$triggerLife('reloadFail', this, {
        res: err,
        args: args
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      promise.then(res => {
        // 触发生命周期重载完成事件
        this.$triggerLife('reloaded', this, {
          res: res,
          args: args
        })
        resolve(res)
      }, err => {
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
 * 触发目标函数并伴随对应的操作值变动--未发现对应函数时报错
 * @param {string} target 目标函数名称
 * @param  {...any} args 参数
 * @returns {Promise}
 */
$triggerMethod (target: string | anyFunction, ...args: any[]) {
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
  const type = $func.getType(target)
  if (type === 'string') {
    if ((this as any)[(target as string)]) {
      if ($func.getType((this as any)[(target as string)]) === 'function') {
        next.promise = (this as any)[(target as string)](...args)
      } else {
        next.msg = `${target}属性非函数类型，$triggerMethod函数触发失败！`
        next.code = 'not function'
      }
    } else {
      next.msg = `不存在${target}函数，$triggerMethod函数触发失败！`
      next.code = 'no method'
    }
  } else if (type === 'function') {
    next.promise = (target as anyFunction)(...args)
  } else {
    next.msg = `target参数接受string/function[promise]，当前值为${target}，$triggerMethod函数触发失败！`
    next.code = 'not function'
  }
  if (next.promise) {
    if ($func.isPromise(next.promise)) {
      next.data = true
    } else {
      next.msg = `target参数为function时需要返回promise，当前返回${next.promise}，$triggerMethod函数触发失败！`
      next.code = 'not promise'
    }
  }
  return new Promise((resolve, reject) => {
    if (next.data) {
      this.$setStatus('operating')
      next.promise!.then(res => {
        this.$setStatus('operated')
        resolve(res)
      }, err => {
        this.$setStatus('operated')
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
$triggerMethodByOperate (target: string | anyFunction, ...args: any[]) {
  const operate = this.$getStatus()
  if (operate.value == 'operated') {
    return this.$triggerMethod(target, ...args)
  } else {
    this.$exportMsg(`当前操作状态为:${operate.label}，${target}函数操作互斥，$triggerMethodByOperate函数失败！`)
    return Promise.reject({ status: 'fail', code: 'clash' })
  }
}

/**
 * 触发加载数据操作
 * @param  {...any} args 参数
 * @returns {Promise}
 */
$triggerGetData (...args: any[]) {
  return this.$setPromise('load', new Promise((resolve, reject) => {
    // 触发生命周期加载前事件
    this.$triggerLife('beforeLoad', this, ...args)
    this.$setStatus('loading', 'load')
    args.unshift('$getData')
    this.$triggerMethod(...(args as [string, ...any])).then(res => {
      this.$setStatus('loaded', 'load')
      // 触发生命周期加载完成事件
      this.$triggerLife('loaded', this, {
        res: res,
        args: args
      })
      resolve(res)
    }, err => {
      this.$setStatus('unload', 'load')
      // 触发生命周期加载失败事件
      this.$triggerLife('loadFail', this, {
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
  $resetArray(list: any[] = []) {
    $func.clearArray(list)
  }
  /**
   * 清空对象
   * @param {object} data 对象
   */
  $resetObject(data: objectAny = {}) {
    for (const prop in data) {
      delete data[prop]
    }
  }
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
    return $func.getProp(resetOption, prop)
  }
  /**
   * 重置回调操作=>不清除额外数据以及生命周期函数
   * @param  {...any} args 参数
   */
  $reset (...args: any[]) {
    this.$formatResetOption(args)
    this.$triggerLife('beforeReset', this, ...args)
    this.$triggerLife('reseted', this, ...args)
  }
  /**
   * 销毁回调操作
   * @param  {...any} args 参数
   */
  $destroy (...args: any[]) {
    this.$formatResetOption(args)
    this.$triggerLife('beforeDestroy', this, ...args)
    this.$reset(...args)
    this.$triggerLife('destroyed', this, ...args)
  }
  /* --- reset end --- */
}


BaseData.$name = 'BaseData'

export default BaseData
