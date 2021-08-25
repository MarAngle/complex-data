import LifeData from './../../mod/LifeData.js'

LifeData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '生命周期数据格式',
    build: [
      {
        prop: 'data',
        type: 'object',
        describe: '生命周期设置数据',
        data: [
          {
            prop: '[key]',
            type: 'string',
            describe: '生命周期名称'
          },
          {
            prop: '[value]',
            type: 'object/function',
            describe: '函数回调对象/函数'
          }
        ]
      }
    ],
    data: [
      {
        prop: 'data',
        type: 'object',
        describe: '函数数据保存位置'
      }
    ],
    method: []
  }
  instrcutionData.prop = this._name
  this.buildInstrcution(instrcutionData)
}

LifeData.initInstrcution()

export default LifeData
