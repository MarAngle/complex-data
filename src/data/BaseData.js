import _func from 'complex-func'
import DefaultData from './DefaultData'
import StatusData from './../mod/StatusData'
import PromiseData from './../mod/PromiseData'

class BaseData extends DefaultData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super(initOption)
    this.$promise = new PromiseData()
    this.initStatus(initOption.status)
  }
  initStatus(status) {
    this.$status = new StatusData(status)
  }
  /**
   * 设置状态
   * @param {*} data 状态value值
   * @param {*} prop 需要设置的状态
   * @param {*} act 操作判断值 count模式下启用，可选不传/init/reset，基本不用传
   */
  setStatus (data, prop = 'operate', act) {
    this.$status.setData(prop, data, act)
  }
  /**
   * 获取对应状态的值
   * @param {string} prop 对应状态
   * @returns {*}
   */
  getStatus (prop = 'operate') {
    return this.$status.getData(prop)
  }
  /**
   * 恢复状态
   */
  resetStatus () {
    this.$status.reset()
  }
}

BaseData.$name = 'BaseData'

export default BaseData
