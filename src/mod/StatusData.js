import config from '../../config'
import SimpleData from './../data/SimpleData'
import StatusDataItem from './StatusDataItem'

class StatusData extends SimpleData {
  constructor (initOption = {}) {
    super()
    this.data = {}
    this._initMain(initOption)
  }
  _initMain ({
    list
  }) {
    this._initList(list)
  }
  _initList (list = []) {
    let defaultlist = config.StatusData.list
    let mainlist = defaultlist.concat(list)
    for (let n in mainlist) {
      let item = mainlist[n]
      this.data[item.prop] = new StatusDataItem(item.data)
    }
  }
  /**
   * 获取指定status的prop属性
   * @param {string} target 指定status
   * @param {string} [prop] 获取整个或者属性值
   * @returns {*}
   */
  getData (target, prop) {
    return this.data[target].getData(prop)
  }
  /**
   * 设置指定status的值
   * @param {string} target 指定status
   * @param {string} data 指定的属性值
   * @param {'init' | 'reset'} [act] 操作判断值
   */
  setData (target, data, act) {
    this.data[target].setData(data, act)
  }
  /**
   * 重置
   */
  reset () {
    for (let n in this.data) {
      this.data[n].reset()
    }
  }
}

StatusData.$name = 'StatusData'

export default StatusData
