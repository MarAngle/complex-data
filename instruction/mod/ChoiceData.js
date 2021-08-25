import ChoiceData from './../../src/mod/ChoiceData.js'

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
            prop: 'data',
            extend: true,
            data: [
              {
                prop: 'id',
                type: 'array',
                describe: 'id列表'
              },
              {
                prop: 'list',
                type: 'array',
                describe: 'item列表'
              }
            ]
          },
          {
            prop: 'reset',
            type: 'object',
            required: false,
            describe: '各操作阶段的选择重置判断值',
            data: [
              {
                prop: 'load',
                type: 'boolean',
                describe: '加载时重置选择判断值'
              },
              {
                prop: 'reload',
                type: 'boolean',
                describe: '重新加载时重置选择判断值'
              },
              {
                prop: 'update',
                type: 'boolean',
                describe: '更新时重置选择判断值'
              },
              {
                prop: 'search',
                type: 'object/boolean',
                describe: '检索变更时重置选择判断值',
                data: [
                  {
                    prop: 'set',
                    type: 'boolean',
                    describe: '检索时重置选择判断值'
                  },
                  {
                    prop: 'reset',
                    type: 'boolean',
                    describe: '检索重置时重置选择判断值'
                  }
                ]
              },
              {
                prop: 'page',
                type: 'object/boolean',
                describe: '分页器数据变更时重置选择判断值',
                data: [
                  {
                    prop: 'page',
                    type: 'boolean',
                    describe: '分页切换时重置选择判断值'
                  },
                  {
                    prop: 'size',
                    type: 'boolean',
                    describe: 'size切换时重置选择判断值'
                  }
                ]
              }
            ]
          },
          {
            prop: 'option',
            type: 'object',
            required: false,
            describe: 'UI设置项，可根据组件自由定制'
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
            describe: 'item列表'
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
            describe: '加载时重置选择判断值'
          },
          {
            prop: 'reload',
            type: 'boolean',
            describe: '重新加载时重置选择判断值'
          },
          {
            prop: 'update',
            type: 'boolean',
            describe: '更新时重置选择判断值'
          },
          {
            prop: 'search',
            type: 'object',
            describe: '检索变更时重置选择判断值',
            data: [
              {
                prop: 'set',
                type: 'boolean',
                describe: '检索时重置选择判断值'
              },
              {
                prop: 'reset',
                type: 'boolean',
                describe: '检索重置时重置选择判断值'
              }
            ]
          },
          {
            prop: 'page',
            type: 'object',
            describe: '分页器数据变更时重置选择判断值',
            data: [
              {
                prop: 'page',
                type: 'boolean',
                describe: '分页切换时重置选择判断值'
              },
              {
                prop: 'size',
                type: 'boolean',
                describe: 'size切换时重置选择判断值'
              }
            ]
          }
        ]
      },
      {
        prop: 'option',
        type: 'object',
        describe: 'UI设置项，可根据组件自由定制'
      }
    ],
    method: []
  }
  instrcutionData.prop = this._name
  this.buildInstrcution(instrcutionData)
}

ChoiceData.initInstrcution()

export default ChoiceData
