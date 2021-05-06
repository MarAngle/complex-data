import SimpleData from './../data/SimpleData'

class ParentData extends SimpleData {
  constructor (parentData) {
    super()
    this.data = null
    this._initMain(parentData)
  }
  _initMain (parentData) {
    if (parentData) {
      this.setData(parentData)
    }
  }
  setData (data) {
    this.data = data
  }
  getData (deepLevel = 1) {
    let current = this.getDataNext(this, deepLevel)
    return current
  }
  getDataNext (target, deepLevel) {
    if (target) {
      let current = target.data
      deepLevel--
      if (current && deepLevel > 0) {
        return this.getDataNext(current.module.parent, deepLevel)
      } else {
        return current
      }
    } else {
      return null
    }
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'SimpleData',
        describe: '实现父实例的挂载',
        build: [
          {
            prop: 'data',
            type: 'object',
            describe: '父实例',
            required: false
          }
        ],
        data: [
          {
            prop: 'data',
            type: 'object',
            describe: '父实例数据保存位置'
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

ParentData.initInstrcution()

export default ParentData
