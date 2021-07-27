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
  /**
   * 加载数据
   * @param {object} data 数据
   * @returns {boolean}
   */
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
  /**
   * 设置数据
   * @param {string} prop 属性
   * @param {*} data 数据
   */
  setData (prop, data) {
    this.data[prop] = data
  }
  /**
   * 获取数据
   * @param {string} prop 属性
   * @returns {*}
   */
  getData (prop) {
    if (!prop) {
      return this.data
    } else {
      return this.data[prop]
    }
  }
  /**
   * 清除数据
   * @param {string} [prop] 指定清除的prop或者清除全部
   */
  clearData (prop) {
    if (!prop) {
      this.data = {}
    } else {
      delete this.data[prop]
    }
  }
  /**
   * 重置，清除全部数据
   */
  reset () {
    this.clearData()
  }
}

export default ExtraData
