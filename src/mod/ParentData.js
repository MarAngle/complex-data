import SimpleData from './../data/SimpleData'

class ParentData extends SimpleData {
  constructor (parentData) {
    super()
    this.data = null
    this._initMain(parentData)
  }
  _initMain (parentData) {
    if (parentData) {
      this.setData(parentData)
    }
  }
  /**
   * 设置父数据
   * @param {object} data 父数据
   */
  setData (data) {
    this.data = data
  }
  /**
   * 获取父数据
   * @param {number} deepLevel 获取到第几层级
   * @returns {object}
   */
  getData (deepLevel = 1) {
    let current = this.getDataNext(this, deepLevel)
    return current
  }
  /**
   * 获取父数据Next
   * @param {object} target 目标
   * @param {number} deepLevel 层级
   * @returns {object}
   */
  getDataNext (target, deepLevel) {
    if (target) {
      let current = target.data
      deepLevel--
      if (current && deepLevel > 0) {
        return this.getDataNext(current.module.parent, deepLevel)
      } else {
        return current
      }
    } else {
      return null
    }
  }
}

ParentData._name = 'ParentData'

export default ParentData
