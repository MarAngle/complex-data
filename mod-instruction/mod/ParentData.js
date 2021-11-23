import ParentData from './../../src/mod/ParentData.js'

ParentData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '实现父实例的挂载',
    build: [
      {
        prop: 'data',
        type: 'object',
        describe: '父实例',
        required: false
      }
    ],
    data: [
      {
        prop: 'data',
        type: 'object',
        describe: '父实例数据保存位置'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.$name
  this.buildInstrcution(instrcutionData)
}

ParentData.initInstrcution()

export default ParentData
