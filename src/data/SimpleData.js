import _func from 'complex-func'
import instrcution from './../utils/instrcution'
import install from './../utils/install'

class SimpleData {
  constructor() {
    this.$LocalTempData = {
      module: {
        id: install.getId(this.constructor.name)
      }
    }
    this.$setModuleName()
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
  $setModuleName () {
    this.$LocalTempData.module.name = this.$LocalTempData.module.id.getData()
  }
  $getModuleName (data = '') {
    return this.$LocalTempData.module.name + data
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        describe: '基础类，所有其他类都继承于此，可实现全局定制功能，此处实现基本的信息输出和说明挂载',
        build: [],
        data: [
          {
            prop: '$LocalTempData',
            type: 'object',
            describe: '全局缓存保存字段'
          }
        ],
        method: [
          {
            prop: 'buildPrintMsg',
            type: 'function',
            describe: '输出信息生成函数'
          },
          {
            prop: 'printMsg',
            type: 'function',
            describe: '信息输出函数'
          },
          {
            prop: '_selfName',
            type: 'function',
            describe: '名称获取函数'
          }
        ]
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
  static buildInstrcution(instrcutionData) {
    instrcution.build(instrcutionData)
  }
  static getInstrcution(type) {
    return instrcution.get(this.name, type)
  }
  static instrcutionShow() {
    return instrcution.getShow()
  }
}

SimpleData.initInstrcution()

export default SimpleData
