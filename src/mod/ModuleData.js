import _func from 'complex-func'
import SimpleData from './../data/SimpleData'

class ModuleData extends SimpleData {
  constructor (initdata, parent) {
    super()
    this.data = {}
    this.initData(initdata)
    this.setParent(parent)
  }
  /**
   * 设置父对象
   * @param {object} parent 父对象
   */
  setParent(parent) {
    this.parent = parent
  }
  /**
   * 获取父对象
   * @returns {object}
   */
  getParent() {
    return this.parent
  }
  /**
   * 加载
   * @param {object} initdata 参数
   */
  initData(initdata) {
    if (initdata && _func.getType(initdata) == 'object') {
      for (let n in initdata) {
        this.setData(n, initdata[n])
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
   */
  uninstallData(modName) {
    let modData = this.getData(modName)
    if (modData) {
      // 存在旧数据时需要对旧数据进行卸载操作
      if (modData.uninstall) {
        modData.uninstall(this.getParent())
      }
    }
  }
  /**
   * 加载模块
   * @param {string} modName 模块名
   * @param {object} data 模块实例
   */
  installData(modName, modData) {
    this.data[modName] = modData
    if (modData && modData.install) {
      modData.install(this.getParent())
    }
  }
  /**
   * 获取模块实例
   * @param {string} modName 模块名
   * @returns {object}
   */
  getData(modName) {
    return this.data[modName]
  }
  /**
   * 触发指定模块的指定函数
   * @param {string} modName 模块名
   * @param {string} method 函数名
   * @param {*[]} args 参数
   * @returns {*}
   */
  triggerMethod(modName, method, args) {
    let mod = this.getData(modName)
    if (mod) {
      let type = typeof mod[method]
      if (type === 'function') {
        return mod[method](...args)
      } else {
        this.printMsg(`${modName}模块${method}属性为${type}，函数触发失败！`)
      }
    } else {
      this.printMsg(`不存在${modName}模块`)
    }
  }
  _selfName () {
    let parent = this.getParent()
    let pre
    if (parent && parent._selfName) {
      pre = `(${parent._selfName()})-`
    }
    if (!pre) {
      pre = ''
    }
    return `{${pre}[${this.constructor._name}]}`
  }
}

ModuleData._name = 'ModuleData'

export default ModuleData
