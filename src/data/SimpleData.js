import _func from 'complex-func'
import install from './../utils/install'

class SimpleData {
  constructor() {
    this.$LocalTempData = {
      module: {
        id: install.getId(this.constructor.name)
      }
    }
  }
  buildPrintMsg (content) {
    return `${this._selfName()}:${content}`
  }
  printMsg (content, type = 'error', option) {
    content = this.buildPrintMsg(content)
    _func.printMsgAct(content, type, option)
  }
  _selfName () {
    return `[CLASS:${this.constructor.name}]`
  }
  toString () {
    return this._selfName()
  }
  $getModuleId (data = '') {
    return this.$LocalTempData.module.id + data
  }
}

export default SimpleData
