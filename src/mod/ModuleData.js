import _func from 'complex-func'
import Data from '../data/Data'

let ModuleDictionaryMap = new Map()

class ModuleData extends Data {
  constructor (initOption, parent, moduleOption, defaultModuleOption) {
    super()
    this.setParent(parent)
    this.$initMain(initOption, moduleOption, defaultModuleOption)
  }
  static setDictionary(moduleName, ModuleClassData) {
    ModuleDictionaryMap.set(moduleName, ModuleClassData)
  }
  static getDictionary(moduleName) {
    if (moduleName) {
      return ModuleDictionaryMap.set(moduleName)
    } else {
      return ModuleDictionaryMap
    }
  }
  $initMain(initOption, moduleOption, defaultModuleOption) {
    if (defaultModuleOption) {
      if (_func.getType(initOption) != 'object') {
        this.$exportMsg('加载参数initOption需要object格式！')
      } else {
        // 存在此值则进行自动加载判断
        if (!moduleOption) {
          moduleOption = {}
        }
        for (const moduleName in initOption) {
          let modInitData = initOption[moduleName]
          let build = !!modInitData
          if (!build) {
            build = moduleOption[moduleName]
            if (build === undefined) {
              let defaultBuild = defaultModuleOption[moduleName]
              if (defaultBuild) {
                build = defaultBuild.data
              }
            }
          }
          if (build) {
            this.setData(moduleName, modInitData)
          }
        }
      }
    } else {
      this.$initModule(initOption)
    }
  }
  $initModule(initOption) {
    if (initOption && _func.getType(initOption) == 'object') {
      for (let moduleName in initOption) {
        this.setData(moduleName, initOption[moduleName])
      }
    }
  }
  /**
   * 设置模块
   * @param {string} moduleName 模块名
   * @param {object} data 模块实例
   */
  setData(moduleName, modData) {
    this.uninstallData(moduleName)
    let ModuleClassData = ModuleData.getDictionary(moduleName)
    if (modData instanceof ModuleClassData) {
      this.installData(moduleName, modData)
    } else {
      this.installData(moduleName, new ModuleClassData(modData))
    }
  }
  /**
   * 卸载模块
   * @param {string} moduleName 模块名
   * @returns {object | undefined} 卸载的模块
   */
  uninstallData(moduleName) {
    let modData = this[moduleName]
    if (modData) {
      // 存在旧数据时需要对旧数据进行卸载操作
      if (modData.uninstall) {
        modData.uninstall(this.getParent())
      }
      this[moduleName] = undefined
    }
    return modData
  }
  /**
   * 加载模块
   * @param {string} moduleName 模块名
   * @param {object} data 模块实例
   */
  installData(moduleName, modData) {
    this[moduleName] = modData
    if (modData && modData.install) {
      modData.install(this.getParent())
    }
  }
  /**
   * 设置父数据,需要设置为不可枚举避免循环递归：主要针对微信小程序环境
   * @param {object} parent 父数据
   */
  setParent (parent) {
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
  getParent() {
    return this.$parent
  }
  /**
   * 触发指定模块的指定函数
   * @param {string} moduleName 模块名
   * @param {string} method 函数名
   * @param {*[]} args 参数
   * @returns {*}
   */
  triggerMethod(moduleName, method, args) {
    let mod = this[moduleName]
    if (mod) {
      let type = typeof mod[method]
      if (type === 'function') {
        return mod[method](...args)
      } else {
        this.$exportMsg(`${moduleName}模块${method}属性为${type}，函数触发失败！`)
      }
    } else {
      this.$exportMsg(`不存在${moduleName}模块`)
    }
  }
}

ModuleData.$name = 'ModuleData'

export default ModuleData
