import ModuleData from './../../mod/ModuleData.js'

ModuleData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '实现模块加载功能',
    build: [
      {
        prop: 'initdata',
        type: 'object',
        describe: '接受object,每个属性就是对应的module',
        required: false
      },
      {
        prop: 'parent',
        type: 'object',
        describe: 'parent父实例',
        required: false
      }
    ],
    data: [
      {
        prop: 'data',
        type: 'object',
        describe: 'module数据保存位置'
      },
      {
        prop: 'parent',
        type: 'object',
        describe: 'parent父实例保存位置(因依赖问题此处非ParentData实例)'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

ModuleData.initInstrcution()

export default ModuleData
