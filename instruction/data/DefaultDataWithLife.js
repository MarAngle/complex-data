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
        prop: '$LocalTempData',
        extend: true,
        data: [
          {
            prop: 'AutoCreateLifeNameList',
            type: 'string[]',
            describe: '继承链上所有创建相关生命周期名称保存数组，创建生命周期触发仅能在创建时触发，此列表缓存实现后期挂载的生命周期创建相关函数时进行可能无法触发的提示'
          }
        ]
      },
      {
        prop: 'module',
        extend: true,
        data: [
          {
            prop: 'life',
            class: 'LifeData',
            describe: '生命周期数据'
          }
        ]
      }
    ],
    method: []
  }
  instrcutionData.prop = this._name
  this.buildInstrcution(instrcutionData)
}

DefaultDataWithLife.initInstrcution()

export default DefaultDataWithLife
