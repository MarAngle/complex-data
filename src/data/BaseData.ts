import $func from 'complex-func'
import DefaultData, { DefaultDataInitOption } from './DefaultData'
import ModuleData, { ModuleDataInitOption, moduleKeys } from './../mod/ModuleData'
import { formatInitOption } from '../utils'
import { LifeDataInitOption } from '../mod/LifeData'
import { anyFunction, anyPromiseFunction, objectAny } from '../../ts'


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
        // if (this.$module.pagination && resetOption.page) {
        //   if (resetOption.page === true) {
        //     this.setPageData(1, 'page', true)
        //   } else {
        //     this.setPageData(resetOption.page.data, resetOption.page.prop, true)
        //   }
        // }
        // if (this.$module.choice) {
        //   // 根据设置和传值自动进行当前选项的重置操作
        //   this.autoChoiceReset(resetOption.choice)
        // }
      }
    })
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
   * 获取reset操作对应prop时机时的重置操作判断
   * @param {object} [resetOption]
   * @param {*} [prop] 当前的reset操作的时机
   * @returns {boolean}
   */
  $parseResetOption(resetOption = {}, prop: string): undefined | boolean | objectAny {
    return $func.getProp(resetOption, prop)
  }
}


BaseData.$name = 'BaseData'

export default BaseData
