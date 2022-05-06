import _func from 'complex-func'
import SimpleData from './../data/SimpleData'

class InterfaceData extends SimpleData {
  constructor (initOption) {
    super()
    this.init = false
    this.data = {
      default: undefined
    }
    if (initOption) {
      this.initMain(initOption)
    }
  }
  /**
   * 加载
   * @param {*} initOption 参数
   */
  initMain (initOption) {
    if (initOption !== undefined) {
      let type = _func.getType(initOption)
      if (type !== 'object') {
        this.data.default = initOption
      } else {
        for (let n in initOption) {
          this.setData(n, initOption[n])
        }
      }
      this.init = true
    }
  }
  /**
   * 是否加载
   * @returns {boolean}
   */
  isInit() {
    return this.init
  }
  /**
   * 设置属性值
   * @param {string} prop 属性
   * @param {*} data 值
   */
  setData (prop, data, useSetData) {
    if (useSetData === undefined) {
      this.data[prop] = data
    } else {
      _func.setProp(this.data, prop, data, useSetData)
    }
  }
  /**
   * 获取对应属性值，不存在对应属性或值则获取默认值
   * @param {string} [prop] 属性值
   * @returns {*}
   */
  getData (prop) {
    if (prop && this.data[prop] !== undefined) {
      return this.data[prop]
    }
    return this.data.default
  }
  /**
   * 获取整个数据对象
   * @returns {object}
   */
  getMain () {
    return this.data
  }
  /**
   * 对data属性调用fn方法
   * @param {function} fn 方法
   */
  map(fn) {
    for (let n in this.data) {
      fn(this.data, n)
    }
  }
  toString () {
    return this.data.default
  }
}

InterfaceData.$name = 'InterfaceData'

export default InterfaceData
