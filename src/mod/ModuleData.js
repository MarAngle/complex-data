import SimpleData from './../data/SimpleData'

class ModuleData extends SimpleData {
  constructor (initdata, parent) {
    super()
    this.data = {}
    this.initData(initdata)
    this.setParent(parent)
  }
  setParent(parent) {
    this.parent = parent
  }
  getParent() {
    return this.parent
  }
  initData(initdata) {
    if (initdata && typeof initdata == 'object') {
      for (let n in initdata) {
        this.setData(n, initdata[n])
      }
    }
  }
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
  getData(prop) {
    return this.data[prop]
  }
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
