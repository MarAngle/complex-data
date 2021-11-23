import DefaultDataWithLife from './../../src/data/DefaultDataWithLife.js'

DefaultDataWithLife.initInstrcution = function() {
  const instrcutionData = {
    extend: 'DefaultData',
    describe: '实现life数据的加载',
    build: [
      {
        prop: 'initdata',
        type: 'object',
        describe: '构建参数',
        required: true,
        data: [
          {
            prop: 'life',
            type: 'object',
            required: false,
            describe: 'life加载数据,仅此处定义created生命周期时可实现触发'
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
            prop: 'data',
            extend: true,
            data: [
              {
                prop: 'life',
                class: 'LifeData',
                describe: '生命周期数据'
              }
            ]
          }
        ]
      }
    ],
    method: []
  }
  instrcutionData.prop = this.$name
  this.buildInstrcution(instrcutionData)
}

DefaultDataWithLife.initInstrcution()

export default DefaultDataWithLife
