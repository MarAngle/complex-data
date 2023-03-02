import { exportMsg, getType } from 'complex-utils'
import Data from '../data/Data'
import BaseData from '../data/BaseData'
import StatusData, { StatusDataInitOption } from './StatusData'
import PromiseData, { PromiseDataInitData } from './PromiseData'
import UpdateData, { UpdateDataInitOption } from './UpdateData'
import PaginationData, { PaginationDataInitOption } from './PaginationData'
import ChoiceData, { ChoiceDataInitOption } from './ChoiceData'
import DictionaryList, { DictionaryListInitOption } from './DictionaryList'
// import SearchData, { SearchDataInitOption } from './../data/SearchData'

const ModuleDictionaryMap: Map<string, any> = new Map()

export interface ModuleDataInitOption {
  // option?: OptionDataInitOption
  status?: StatusDataInitOption
  promise?: PromiseDataInitData
  update?: UpdateDataInitOption
  pagination?: PaginationDataInitOption
  choice?: ChoiceDataInitOption
  dictionary?: DictionaryListInitOption
  // search?: SearchDataInitOption
}

export type moduleKeys = keyof ModuleDataInitOption

class ModuleData extends Data {
  static $name = 'ModuleData'
  $parent!: BaseData
  // option?: OptionData
  status?: StatusData
  promise?: PromiseData
  update?: UpdateData
  pagination?: PaginationData
  choice?: ChoiceData
  dictionary?: DictionaryList
  // search?: SearchData
  constructor (initOption: undefined | ModuleDataInitOption, parent: BaseData) {
    super()
    this.setParent(parent)
    if (initOption && getType(initOption) == 'object') {
      let modName: moduleKeys
      for (modName in initOption) {
        this.$setData(modName, initOption[modName])
      }
    }
  }
  static setDictionary(modName: moduleKeys, ModuleClassData: any, replace?: boolean) {
    if (ModuleData.getDictionary(modName) && !replace) {
      exportMsg(`${modName}模块类已存在，无法进行替换操作！`, 'error', {
        data: ModuleClassData,
        type: 'warn'
      })
      return
    }
    if (!ModuleClassData.$name) {
      exportMsg(`${modName}对应的模块类不存在$name属性，可能会导致判断错误！`, 'error', {
        data: ModuleClassData,
        type: 'warn'
      })
    }
    ModuleDictionaryMap.set(modName, ModuleClassData)
  }
  static getDictionaryMap() {
    return ModuleDictionaryMap
  }
  static getDictionary(modName: moduleKeys) {
    return ModuleDictionaryMap.get(modName)
  }
  $buildModuleData(modName: moduleKeys, modData?: any) {
    const ModuleClassData = ModuleData.getDictionary(modName)
    if (ModuleClassData) {
      if (modData === true) {
        return new ModuleClassData()
      } else if (modData && !(modData instanceof ModuleClassData)) {
        return new ModuleClassData(modData)
      }
    }
    return modData
  }
  /**
   * 设置模块
   * @param {string} modName 模块名
   * @param {object} modData 模块实例
   * @param {boolean} [build] 自动构建判断值，默认为真
   */
  $setData(modName: moduleKeys, modData?: any, build = true) {
    this.$uninstallData(modName)
    if (build) {
      modData = this.$buildModuleData(modName, modData)
    }
    this.$installData(modName, modData)
  }
  $getData(modName: moduleKeys) {
    return this[modName]
  }
  /**
   * 卸载模块
   * @param {string} modName 模块名
   * @returns {object | undefined} 卸载的模块
   */
  $uninstallData(modName: moduleKeys) {
    const modData = this[modName]
    if (modData) {
      // 存在旧数据时需要对旧数据进行卸载操作
      if (modData.$uninstall) {
        modData.$uninstall(this.$getParent()!)
      }
      this[modName] = undefined
    }
    return modData
  }
  /**
   * 加载模块
   * @param {string} modName 模块名
   * @param {object} modData 模块实例
   */
  $installData(modName: moduleKeys, modData: Data) {
    this[modName] = modData
    if (modData && modData.$install) {
      modData.$install(this.$getParent())
    }
  }
  /**
   * 设置父数据,需要设置为不可枚举避免循环递归：主要针对微信小程序环境
   * @param {object} parent 父数据
   */
  setParent (parent: BaseData) {
    Object.defineProperty(this, '$parent', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: parent
    })
  }
  /**
   * 获取父数据
   * @returns {object | undefined}
   */
  $getParent() {
    return this.$parent
  }
  /**
   * 触发指定模块的指定函数
   * @param {string} modName 模块名
   * @param {string} method 函数名
   * @param {*[]} args 参数
   * @returns {*}
   */
  $triggerMethod(modName: moduleKeys, method: string, args: any[]) {
    const mod = this[modName]
    if (mod) {
      const type = typeof (mod as any)[method]
      if (type === 'function') {
        return (mod as any)[method](...args)
      } else {
        this.$exportMsg(`${modName}模块${method}属性为${type}，函数触发失败！`)
      }
    } else {
      this.$exportMsg(`不存在${modName}模块`)
    }
  }
  $selfName() {
    let selfName = super.$selfName()
    if (this.$parent) {
      selfName = `[${this.$parent.$selfName()}=>${selfName}]`
    }
    return selfName
  }
}

ModuleData.setDictionary('status', StatusData)
ModuleData.setDictionary('promise', PromiseData)
ModuleData.setDictionary('pagination', PaginationData)
ModuleData.setDictionary('choice', ChoiceData)
ModuleData.setDictionary('update', UpdateData)
ModuleData.setDictionary('dictionary', DictionaryList)
// ModuleData.setDictionary('search', SearchData)

export default ModuleData
