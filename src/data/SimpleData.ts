import _func from 'complex-func'
import IdData from './../mod/IdData'
import install from './../utils/install'

class SimpleData {
  $LocalTempData: {
    module: {
      id: IdData,
      name: string
    }
  }
  constructor() {
    this.$LocalTempData = {
      module: {
        id: install.getId(this.constructor.name),
        name: ''
      }
    }
    this.$setModuleName()
  }
  buildPrintMsg (content: string): string {
    return `${this._selfName()}:${content}`
  }
  printMsg (content: string, type: string = 'error', option: object | undefined): void {
    content = this.buildPrintMsg(content)
    _func.printMsgAct(content, type, option)
  }
  _selfName (): string {
    return `[CLASS:${this.constructor.name}]`
  }
  toString (): string {
    return this._selfName()
  }
  $setModuleName (): void {
    this.$LocalTempData.module.name = this.$LocalTempData.module.id.getData()
  }
  $getModuleName (data = ''): string {
    return this.$LocalTempData.module.name + data
  }
}

export default SimpleData
