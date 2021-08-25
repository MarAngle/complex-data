import UpdateData from './../../mod/UpdateData.js'

UpdateData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'DefaultData',
    describe: '更新数据格式',
    build: [
      {
        prop: 'initdata',
        extend: true,
        data: [
          {
            prop: 'offset',
            type: 'object/number',
            describe: '间隔设置数据',
            data: [
              {
                prop: 'data',
                type: 'number',
                describe: '时间间隔'
              },
              {
                prop: 'start',
                type: 'number',
                describe: '第一次触发间隔'
              }
            ]
          }
        ]
      }
    ],
    data: [
      {
        prop: 'current',
        type: 'object',
        describe: '当前次数保存位置',
        data: [
          {
            prop: 'num',
            type: 'number',
            describe: '当前次数'
          }
        ]
      },
      {
        prop: 'timer',
        type: 'number',
        describe: '定时器ID'
      },
      {
        prop: 'offset',
        type: 'object',
        describe: '间隔设置数据',
        data: [
          {
            prop: 'data',
            type: 'number',
            describe: '时间间隔'
          },
          {
            prop: 'start',
            type: 'number',
            describe: '第一次触发间隔'
          }
        ]
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

UpdateData.initInstrcution()

export default UpdateData
