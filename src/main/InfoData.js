import _func from 'complex-func'
import ComplexDataWithSearch from './../data/ComplexDataWithSearch'

class InfoData extends ComplexDataWithSearch {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super(initOption)
    this.$triggerCreateLife('InfoData', 'beforeCreate', initOption)
    this.$triggerCreateLife('InfoData', 'created')
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

InfoData.$name = 'InfoData'

export default InfoData
