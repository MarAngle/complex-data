import _func from 'complex-func'
import SimpleData from './../data/SimpleData'

class ExtraData extends SimpleData {
  constructor (data = {}) {
    super()
    this.data = {}
    this._initMain(data)
  }
  _initMain (data) {
    this.initData(data)
  }
  // 加载数据
  initData (data) {
    let dataType = _func.getType(data)
    if (dataType == 'object') {
      for (let n in data) {
        this.setData(n, data[n])
      }
      return true
    } else {
      return false
    }
  }
  // 设置数据
  setData (prop, data) {
    this.data[prop] = data
  }
  // 获取数据
  getData (prop) {
    if (!prop) {
      return this.data
    } else {
      return this.data[prop]
    }
  }
  // 清除数据
  clearData (prop) {
    if (!prop) {
      this.data = {}
    } else {
      delete this.data[prop]
    }
  }
  reset () {
    this.clearData()
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'SimpleData',
        describe: '实现额外数据的保存功能',
        build: [
          {
            prop: 'data',
            type: 'object',
            describe: '额外数据对象',
            required: false
          }
        ],
        data: [
          {
            prop: 'data',
            type: 'object',
            describe: '额外数据保存位置'
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

ExtraData.initInstrcution()

export default ExtraData
