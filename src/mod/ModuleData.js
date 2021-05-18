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
}

export default ModuleData
