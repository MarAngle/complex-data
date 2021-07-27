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
    if (initdata && typeof initdata == 'object') {
      for (let n in initdata) {
        this.setData(n, initdata[n])
      }
    }
  }
  /**
   * 设置模块
   * @param {string} prop 模块名
   * @param {object} data 模块实例
   */
  setData(prop, data) {
    if (this.data[prop]) {
      // 存在旧数据时需要对旧数据进行卸载操作
      if (this.data[prop].uninstall) {
        this.data[prop].uninstall(this.getParent())
      }
    }
    this.data[prop] = data
    if (data && data.install) {
      data.install(this.getParent())
    }
  }
  /**
   * 获取模块实例
   * @param {string} prop 模块名
   * @returns {object}
   */
  getData(prop) {
    return this.data[prop]
  }
  /**
   * 触发指定模块的指定函数
   * @param {string} prop 模块名
   * @param {string} method 函数名
   * @param {*[]} args 参数
   * @returns {*}
   */
  triggerMethod(prop, method, args) {
    let mod = this.getData(prop)
    if (mod) {
      let type = typeof mod[method]
      if (type === 'function') {
        return mod[method](...args)
      } else {
        this.printMsg(`${prop}模块${method}属性为${type}，函数触发失败！`)
      }
    } else {
      this.printMsg(`不存在${prop}模块`)
    }
  }
  _selfName () {
    let parent = this.getParent()
    let pre
    if (parent && parent._selfName) {
      pre = `(${parent._selfName()})-`
    }
    if (!pre) {
      pre = ``
    }
    return `{${pre}[${this.constructor.name}]}`
  }
}

export default ModuleData
