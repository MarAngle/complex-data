import ChoiceData from './../../mod/ChoiceData.js'

ChoiceData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'DefaultData',
    describe: '选择类',
    build: [
      {
        prop: 'initdata',
        extend: true,
        data: [
          {
            prop: 'show',
            type: 'boolean',
            required: false,
            describe: 'choice加载显示判断值'
          },
          {
            prop: 'reset',
            type: 'object',
            required: false,
            describe: '各个阶段重置判断值',
            data: [
              {
                prop: 'load',
                type: 'boolean',
                describe: '加载重置'
              },
              {
                prop: 'reload',
                type: 'boolean',
                describe: '重新加载重置'
              },
              {
                prop: 'update',
                type: 'boolean',
                describe: '更新重置'
              },
              {
                prop: 'search',
                type: 'object/boolean',
                describe: '加载重置',
                data: [
                  {
                    prop: 'set',
                    type: 'boolean',
                    describe: '检索重置'
                  },
                  {
                    prop: 'reset',
                    type: 'boolean',
                    describe: '检索重置重置'
                  }
                ]
              },
              {
                prop: 'page',
                type: 'object/boolean',
                describe: '加载重置',
                data: [
                  {
                    prop: 'page',
                    type: 'boolean',
                    describe: '分页切换'
                  },
                  {
                    prop: 'size',
                    type: 'boolean',
                    describe: 'size切换重置'
                  }
                ]
              }
            ]
          },
          {
            prop: 'option',
            type: 'object',
            required: false,
            describe: 'choice列表中额外字段的接受，可根据组件自由定制'
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
            prop: 'id',
            class: 'array',
            describe: 'id列表 '
          },
          {
            prop: 'list',
            class: 'array',
            describe: '数据列表'
          }
        ]
      },
      {
        prop: 'status',
        type: 'object',
        describe: '状态对象',
        data: [
          {
            prop: 'show',
            type: 'boolean',
            describe: '显示加载判断值'
          }
        ]
      },
      {
        prop: 'resetOption',
        type: 'object',
        describe: '重置判断值对象',
        data: [
          {
            prop: 'load',
            type: 'boolean',
            describe: '加载重置'
          },
          {
            prop: 'reload',
            type: 'boolean',
            describe: '重新加载重置'
          },
          {
            prop: 'update',
            type: 'boolean',
            describe: '更新重置'
          },
          {
            prop: 'search',
            type: 'object',
            describe: '加载重置',
            data: [
              {
                prop: 'set',
                type: 'boolean',
                describe: '检索重置'
              },
              {
                prop: 'reset',
                type: 'boolean',
                describe: '检索重置重置'
              }
            ]
          },
          {
            prop: 'page',
            type: 'object',
            describe: '加载重置',
            data: [
              {
                prop: 'page',
                type: 'boolean',
                describe: '分页切换'
              },
              {
                prop: 'size',
                type: 'boolean',
                describe: 'size切换重置'
              }
            ]
          }
        ]
      },
      {
        prop: 'option',
        type: 'object',
        describe: 'choice列表中额外字段的接受，可根据组件自由定制'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

ChoiceData.initInstrcution()

export default ChoiceData
