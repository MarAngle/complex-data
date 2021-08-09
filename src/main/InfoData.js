import _func from 'complex-func'
import ComplexDataWithSearch from './../data/ComplexDataWithSearch'

class InfoData extends ComplexDataWithSearch {
  constructor (initdata) {
    if (!initdata) {
      initdata = {}
    }
    super(initdata)
    this.triggerCreateLife('InfoData', 'beforeCreate', initdata)
    this.triggerCreateLife('InfoData', 'created')
  }
  /**
   * 格式化信息数据，以origindata为基准更新data.current
   * @param {object} origindata 格式化数据的源数据
   * @param {string} originfromType originfromType
   * @param {object} option 设置项
   */
  formatData (origindata = {}, originfromType = 'list', option = {}) {
    if (!option.type) {
      option.type = 'add'
    }
    this.updateItem(this.data.current, origindata, originfromType, option)
  }
  /**
   * 数据重新拉取
   * @param {boolean}} force 强制更新判断值
   * @param  {...any} args loadData=>getData参数列表
   * @returns {Promise}
   */
  reloadData (force, ...args) {
    return new Promise((resolve, reject) => {
      this.loadData(force, ...args).then(res => {
        resolve(res)
      }, err => {
        console.error(err)
        reject(err)
      })
    })
  }
  // --数据相关--*/
  /**
   * 获取对象
   * @param {string} [prop] 存在取data.current[prop],否则取data.current
   * @returns {*}
   */
  getItem(prop) {
    if (prop) {
      return this.data.current[prop]
    } else {
      return this.data.current
    }
  }
}

export default InfoData
