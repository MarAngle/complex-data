import _func from 'complex-func'
import SimpleData from './../data/SimpleData'

class InterfaceData extends SimpleData {
  constructor (initdata) {
    super()
    this.init = false
    this.data = {
      default: undefined
    }
    if (initdata) {
      this.initMain(initdata)
    }
  }
  /**
   * 加载
   * @param {*} initdata 参数
   */
  initMain (initdata) {
    if (initdata !== undefined) {
      let type = _func.getType(initdata)
      if (type !== 'object') {
        this.data.default = initdata
      } else {
        for (let n in initdata) {
          this.setData(n, initdata[n])
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
  setData (prop, data) {
    this.data[prop] = data
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

export default InterfaceData
