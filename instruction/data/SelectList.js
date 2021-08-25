import SelectList from './../../src/data/SelectList.js'

SelectList.initInstrcution = function() {
  const instrcutionData = {
    extend: 'DefaultData',
    describe: '检索数据',
    build: [
      {
        prop: 'initdata',
        describe: '加载数据',
        data: [
          {
            prop: 'list',
            type: 'object/array',
            required: true,
            describe: '列表数据',
            data: [
              {
                prop: '[index]',
                type: 'object',
                describe: '检索数据对象',
                data: [
                  {
                    prop: 'label',
                    type: 'string',
                    describe: 'LABEL'
                  },
                  {
                    prop: 'value',
                    type: 'string',
                    describe: 'VALUE'
                  }
                ]
              }
            ]
          },
          {
            prop: 'option',
            type: 'object',
            required: false,
            describe: '设置项，详情参照代码'
          },
          {
            prop: 'format',
            type: 'object/number/string/function',
            required: false,
            describe: '传入数据格式化函数'
          },
          {
            prop: 'unhitData',
            type: 'object',
            required: false,
            describe: '未命中数据'
          },
          {
            prop: 'undefData',
            type: 'object',
            required: false,
            describe: '未定义数据'
          }
        ]
      }
    ],
    data: [
      {
        prop: 'data',
        extend: true,
        data: [
          {
            prop: 'list',
            type: 'array',
            describe: '检索列表数据',
            data: [
              {
                prop: '[prop]',
                type: 'object',
                describe: '检索数据',
                data: [
                  {
                    prop: 'label',
                    type: 'string',
                    describe: 'LABEL'
                  },
                  {
                    prop: 'value',
                    type: 'string',
                    describe: 'VALUE'
                  },
                  {
                    prop: '[prop]',
                    type: 'string',
                    describe: '...'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        prop: 'option',
        type: 'object',
        class: 'OptionData',
        describe: '设置项'
      },
      {
        prop: 'format',
        type: 'object',
        describe: '传入数据格式化函数',
        data: [
          {
            prop: 'type',
            type: 'boolean/string',
            describe: 'false不格式化，number直接附加offset做偏移，string通过head/foot拼接，function直接格式化'
          },
          {
            prop: 'offset',
            type: 'number',
            describe: 'number状态下的偏移'
          },
          {
            prop: 'head',
            type: 'string',
            describe: 'string状态下的拼接开始'
          },
          {
            prop: 'foot',
            type: 'string',
            describe: 'string状态下的拼接结束'
          },
          {
            prop: 'data',
            type: 'function',
            describe: 'function状态下的函数，返回string'
          }
        ]
      },
      {
        prop: 'unhitData',
        type: 'object',
        describe: '未命中数据'
      },
      {
        prop: 'undefData',
        type: 'object',
        describe: '未定义数据'
      }
    ],
    method: []
  }
  instrcutionData.prop = this._name
  this.buildInstrcution(instrcutionData)
}

SelectList.initInstrcution()

export default SelectList
