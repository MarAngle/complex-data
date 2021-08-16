import _func from 'complex-func'
import InterfaceData from './InterfaceData'
import SimpleData from './../data/SimpleData'
import config from '../../config'

class LayoutData extends SimpleData {
  constructor (initOption) {
    super()
    this.initData(initOption)
  }
  /**
   * 加载
   * @param {*} initOption 参数
   */
  initData (initOption) {
    if (!initOption) {
      initOption = {
        default: undefined
      }
    }
    for (let n in initOption) {
      initOption[n] = this.formatLayout(initOption[n])
    }
    this.data = new InterfaceData(initOption)
  }
  /**
   * 格式化布局数据
   * @param {object} [data] 布局数据
   * @returns {object}
   */
  formatLayout(data) {
    if (!data) {
      data = {}
    }
    if (!data.type) {
      data.type = 'grid'
    }
    if (!data.grid) {
      data.grid = config.LayoutData.grid
    }
    if (!data.label) {
      data.label = {
        span: config.LayoutData.label
      }
    } else if (_func.getType(data.label) !== 'object') {
      data.label = {
        span: data.label
      }
    }
    if (!data.content) {
      data.content = {
        span: config.LayoutData.content
      }
    } else if (_func.getType(data.content) !== 'object') {
      data.content = {
        span: data.content
      }
    }
    return data
  }
  /**
   * 设置指定布局
   * @param {string} prop 指定属性
   * @param {*} data 布局数据
   */
  setData (prop, data) {
    this.data.setData(prop, this.formatLayout(data))
  }
  /**
   * 获取指定布局
   * @param {string} prop 指定属性
   * @returns {*}
   */
  getData (prop) {
    return this.data.getData(prop)
  }
  /**
   * 获取布局全数据
   * @returns {object}
   */
  getMain () {
    return this.data.getMain()
  }
}

LayoutData._name = 'LayoutData'

export default LayoutData
