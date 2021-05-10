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
  getPrintInfo (content) {
    return `${this.selfName()}:${content}`
  }
  printInfo (content, type = 'error', nextContent, nextType = type) {
    content = this.getPrintInfo(content)
    if (type === 'error') {
      content = new Error(content)
    }
    console[type](content)
    if (nextContent) {
      console[nextType](nextContent)
    }
  }
  selfName () {
    return `[CLASS:${this.constructor.name}]`
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
            prop: 'getPrintInfo',
            type: 'function',
            describe: '输出信息生成函数'
          },
          {
            prop: 'printInfo',
            type: 'function',
            describe: '信息输出函数'
          },
          {
            prop: 'selfName',
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
