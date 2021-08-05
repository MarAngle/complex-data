import _func from 'complex-func'
import InterfaceData from './InterfaceData'
import SimpleData from './../data/SimpleData'
import config from '../config'

class LayoutData extends SimpleData {
  constructor (initdata) {
    super()
    this.initData(initdata)
  }
  /**
   * 加载
   * @param {*} initdata 参数
   */
  initData (initdata) {
    if (!initdata) {
      initdata = {
        default: undefined
      }
    }
    for (let n in initdata) {
      initdata[n] = this.formatLayout(initdata[n])
    }
    this.data = new InterfaceData(initdata)
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
    if (data.type == 'grid') {
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
    } else if (data.type == 'width') {
      if (!data.width) {
        data.width = undefined
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

export default LayoutData
