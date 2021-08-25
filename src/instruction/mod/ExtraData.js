import ExtraData from './../../mod/ExtraData.js'

ExtraData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '实现额外数据的保存功能',
    build: [
      {
        prop: 'data',
        type: 'object',
        describe: '额外数据对象',
        required: false
      }
    ],
    data: [
      {
        prop: 'data',
        type: 'object',
        describe: '额外数据保存位置'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

ExtraData.initInstrcution()

export default ExtraData
