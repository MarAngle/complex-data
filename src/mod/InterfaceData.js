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
  isInit() {
    return this.init
  }
  setData (prop, data) {
    this.data[prop] = data
  }
  getData (prop) {
    return prop ? this.data[prop] || this.data.default : this.data.default
  }
  getMain () {
    return this.data
  }
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
