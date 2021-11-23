import ComplexData from './../../src/data/ComplexData.js'

ComplexData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'BaseData',
    describe: '实现DictionaryList数据的加载',
    build: [
      {
        prop: 'initdata',
        extend: true,
        data: [
          {
            prop: 'data',
            extend: true,
            data: [
              {
                prop: 'data',
                type: 'array',
                describe: 'list[]'
              },
              {
                prop: 'current',
                type: 'object',
                describe: 'current{}'
              }
            ]
          },
          {
            prop: 'dictionary',
            type: 'object',
            class: 'DictionaryList',
            describe: 'dictionary加载数据'
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
                prop: 'dictionary',
                class: 'DictionaryList',
                describe: '字典列表数据'
              }
            ]
          }
        ]
      },
      {
        prop: 'data',
        extend: true,
        data: [
          {
            prop: 'list',
            type: 'array',
            describe: '数组'
          },
          {
            prop: 'current',
            type: 'object',
            describe: '对象'
          }
        ]
      }
    ],
    method: []
  }
  instrcutionData.prop = this.$name
  this.buildInstrcution(instrcutionData)
}

ComplexData.initInstrcution()

export default ComplexData
