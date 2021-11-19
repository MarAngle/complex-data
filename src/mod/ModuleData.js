import _func from 'complex-func'

class ModuleData {
  constructor (initOption, parent) {
    this.$initMain(initOption)
    this.setParent(parent)
  }
  $initMain(initOption) {
    if (initOption && _func.getType(initOption) == 'object') {
      for (let n in initOption) {
        this.setData(n, initOption[n])
      }
    }
  }
  /**
   * 设置模块
   * @param {string} modName 模块名
   * @param {object} data 模块实例
   */
  setData(modName, modData) {
    this.uninstallData(modName)
    this.installData(modName, modData)
  }
  /**
   * 卸载模块
   * @param {string} modName 模块名
   * @returns {object | undefined} 卸载的模块
   */
  uninstallData(modName) {
    let modData = this[modName]
    if (modData) {
      // 存在旧数据时需要对旧数据进行卸载操作
      if (modData.uninstall) {
        modData.uninstall(this.getParent())
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
  installData(modName, modData) {
    this[modName] = modData
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
}

ModuleData.$name = 'ModuleData'

export default ModuleData
