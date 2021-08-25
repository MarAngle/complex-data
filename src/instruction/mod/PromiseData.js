import PromiseData from './../../mod/PromiseData.js'

PromiseData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: 'promise数据格式',
    build: [
      {
        prop: 'initdata',
        type: 'object',
        describe: '加载数据',
        data: [
          {
            prop: 'data',
            type: 'object',
            describe: 'promise设置数据(key=>value)'
          }
        ]
      }
    ],
    data: [
      {
        prop: 'data',
        type: 'object',
        describe: 'promise数据保存位置'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

PromiseData.initInstrcution()

export default PromiseData
