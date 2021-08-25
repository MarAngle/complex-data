import FuncData from './../../mod/FuncData.js'

FuncData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '生命周期数据格式',
    build: [
      {
        prop: 'initdata',
        type: 'object',
        describe: '生命周期设置数据',
        data: [
          {
            prop: 'name',
            type: 'string',
            describe: '文字标识'
          },
          {
            prop: 'data',
            type: 'function/object',
            describe: '函数对象参数'
          }
        ]
      }
    ],
    data: [
      {
        prop: 'name',
        type: 'string',
        describe: '文字标识'
      },
      {
        prop: 'data',
        type: 'map',
        describe: '函数保存位置'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

FuncData.initInstrcution()

export default FuncData
