import _func from 'complex-func'
import Data from '../data/Data'

let ModuleDictionaryMap = new Map()

class ModuleData extends Data {
  constructor (initOption, parent) {
    super()
    this.$setParent(parent)
    this.$initModule(initOption)
  }
  static setDictionary(modName, ModuleClassData) {
    ModuleDictionaryMap.set(modName, ModuleClassData)
  }
  static getDictionary(modName) {
    if (modName) {
      return ModuleDictionaryMap.get(modName)
    } else {
      return ModuleDictionaryMap
    }
  }
  $initModule(initOption) {
    if (initOption && _func.getType(initOption) == 'object') {
      for (let modName in initOption) {
        this.$setData(modName, initOption[modName])
      }
    }
  }
  $formatData(modName, modData) {
    let ModuleClassData = ModuleData.getDictionary(modName)
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
   * @param {object} data 模块实例
   */
  $setData(modName, modData, format = true) {
    this.$uninstallData(modName)
    if (format) {
      modData = this.$formatData(modName, modData)
    }
    this.$installData(modName, modData)
  }
  /**
   * 卸载模块
   * @param {string} modName 模块名
   * @returns {object | undefined} 卸载的模块
   */
  $uninstallData(modName) {
    let modData = this[modName]
    if (modData) {
      // 存在旧数据时需要对旧数据进行卸载操作
      if (modData.uninstall) {
        modData.uninstall(this.$getParent())
      }
      this[modName] = undefined
    }
    return modData
  }
  /**
   * 加载模块
   * @param {string} modName 模块名
   * @param {object} data 模块实例
   */
  $installData(modName, modData) {
    this[modName] = modData
    if (modData && modData.install) {
      modData.install(this.$getParent())
    }
  }
  /**
   * 设置父数据,需要设置为不可枚举避免循环递归：主要针对微信小程序环境
   * @param {object} parent 父数据
   */
  $setParent (parent) {
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
  $triggerMethod(modName, method, args) {
    let mod = this[modName]
    if (mod) {
      let type = typeof mod[method]
      if (type === 'function') {
        return mod[method](...args)
      } else {
        this.$exportMsg(`${modName}模块${method}属性为${type}，函数触发失败！`)
      }
    } else {
      this.$exportMsg(`不存在${modName}模块`)
    }
  }
}

ModuleData.$name = 'ModuleData'

export default ModuleData
