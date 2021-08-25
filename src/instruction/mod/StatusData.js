import StatusData from './../../mod/StatusData.js'

StatusData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '状态数据',
    build: [
      {
        prop: 'initdata',
        data: [
          {
            prop: 'list',
            type: 'array',
            describe: '单独状态数据',
            data: [
              {
                prop: '[key]',
                type: 'string',
                describe: '属性值'
              },
              {
                prop: '[value]',
                type: 'object',
                describe: 'StatusDataItem初始化参数'
              }
            ]
          }
        ]
      }
    ],
    data: [
      {
        prop: 'data',
        type: 'object',
        describe: 'StatusDataItem实例保存位置'
      }
    ],
    method: []
  }
  instrcutionData.prop = this._name
  this.buildInstrcution(instrcutionData)
}

StatusData.initInstrcution()

export default StatusData
