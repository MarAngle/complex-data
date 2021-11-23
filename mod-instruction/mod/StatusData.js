import StatusData from './../../src/mod/StatusData.js'

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
                prop: '[index]',
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
  instrcutionData.prop = this.$name
  this.buildInstrcution(instrcutionData)
}

StatusData.initInstrcution()

export default StatusData
