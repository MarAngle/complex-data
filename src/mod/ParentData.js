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
  setData (data) {
    this.data = data
  }
  getData (deepLevel = 1) {
    let current = this.getDataNext(this, deepLevel)
    return current
  }
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

export default ParentData
