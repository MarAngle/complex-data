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
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'SimpleData',
        describe: '实现模块加载功能',
        build: [
          {
            prop: 'initdata',
            type: 'object',
            describe: '接受object,每个属性就是对应的module',
            required: false
          },
          {
            prop: 'parent',
            type: 'object',
            describe: 'parent父实例',
            required: false
          }
        ],
        data: [
          {
            prop: 'data',
            type: 'object',
            describe: 'module数据保存位置'
          },
          {
            prop: 'parent',
            type: 'object',
            describe: 'parent父实例保存位置(因依赖问题此处非ParentData实例)'
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

ModuleData.initInstrcution()

export default ModuleData
