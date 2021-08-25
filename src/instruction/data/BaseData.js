import BaseData from './../../data/BaseData.js'

BaseData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'DefaultDataWithLife',
    describe: '实现option/status/update/promise数据的加载,需要定义getData函数',
    build: [
      {
        prop: 'initdata',
        extend: true,
        data: [
          {
            prop: 'status',
            type: 'object',
            class: 'StatusData',
            describe: 'status加载数据'
          },
          {
            prop: 'update',
            type: 'object',
            class: 'UpdateData',
            describe: 'update加载数据'
          }
        ]
      }
    ],
    data: [
      {
        prop: 'module',
        extend: true,
        data: [
          {
            prop: 'option',
            class: 'OptionData',
            describe: '设置项数据'
          },
          {
            prop: 'status',
            class: 'StatusData',
            describe: '状态数据'
          },
          {
            prop: 'promise',
            class: 'PromiseData',
            describe: 'promise数据'
          },
          {
            prop: 'update',
            class: 'UpdateData',
            describe: '更新数据'
          }
        ]
      }
    ],
    method: []
  }
  instrcutionData.prop = this._name
  this.buildInstrcution(instrcutionData)
}

BaseData.initInstrcution()

export default BaseData
