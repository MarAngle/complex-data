import $func from 'complex-func'
import DefaultData, { DefaultDataInitOption } from './DefaultData'
import ModuleData, { ModuleDataInitOption, moduleKeys } from './../mod/ModuleData'
import { formatInitOption } from '../utils'
import { LifeDataInitOption } from '../mod/LifeData'
import { anyPromiseFunction, objectAny } from '../../ts'


export interface forceObjectType {
  [prop: string]: boolean | string
}

export type forceType = boolean | forceObjectType

export interface BaseDataInitOption extends DefaultDataInitOption {
  life?: LifeDataInitOption,
  data?: objectAny,
  module?: ModuleDataInitOption
}

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
  $initLoadDepend() {
    if (!this.$module.status) {
      this.setModule('status')
    }
    if (!this.$module.promise) {
      this.setModule('promise')
    }
  }
  /* --- module start --- */
  /**
   * 设置模块
   * @param {string} modName 模块名
   * @param {object} data 模块实例
   */
   setModule(modName: moduleKeys, data?: any) {
    this.$module.$setData(modName, data)
  }
  /**
   * 加载模块
   * @param {string} modName 模块名
   * @param {object} data 模块实例
   */
  installModule(modName: moduleKeys, data: any) {
    return this.$module.$installData(modName, data)
  }
  /**
   * 卸载模块
   * @param {string} modName 模块名
   * @returns {object | undefined} 卸载的模块
   */
  uninstallModule(modName: moduleKeys) {
    return this.$module.$uninstallData(modName)
  }
  /* --- module end --- */

  /* --- reset start --- */

  /**
   * 清空数组
   * @param {array} list 数组
   */
  resetArray(list = []) {
    $func.clearArray(list)
  }
  /**
   * 清空对象
   * @param {object} data 对象
   */
  resetObject(data: objectAny = {}) {
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
  reset (...args: any[]) {
    this.$formatResetOption(args)
    this.triggerLife('beforeReset', this, ...args)
    // // 重置状态
    // if (this.$parseResetOption(args[0], 'status') !== false) {
    //   this.resetStatus()
    // }
    this.triggerLife('reseted', this, ...args)
  }
  /**
   * 销毁回调操作
   * @param  {...any} args 参数
   */
  destroy (...args: any[]) {
    this.$formatResetOption(args)
    this.triggerLife('beforeDestroy', this, ...args)
    this.reset(...args)
    this.triggerLife('destroyed', this, ...args)
  }
  /* --- reset end --- */
}


BaseData.$name = 'BaseData'

export default BaseData
