import SearchData from './../../mod/SearchData.js'

SearchData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'ComplexData',
    describe: '检索数据',
    build: [
      {
        prop: 'initdata',
        extend: true,
        data: [
          {
            prop: 'title',
            type: 'string',
            describe: 'title设置'
          },
          {
            prop: 'menu',
            type: 'object',
            describe: 'menu设置',
            data: [
              {
                prop: 'type',
                type: 'string',
                describe: '默认default，其他模式全自定义，default模式添加默认按钮'
              },
              {
                prop: 'list',
                type: 'array',
                describe: '按钮列表数据',
                data: [
                  {
                    prop: '[index]',
                    describe: '按钮数据',
                    data: [
                      {
                        prop: 'type'
                      },
                      {
                        prop: 'icon'
                      },
                      {
                        prop: 'name'
                      },
                      {
                        prop: 'act'
                      },
                      {
                        prop: '[prop]'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    data: [
      {
        prop: 'show',
        type: 'boolean',
        describe: 'search加载判断'
      },
      {
        prop: 'title',
        type: 'object',
        describe: 'title设置',
        data: [
          {
            prop: 'show',
            type: 'boolean',
            describe: 'title显示'
          },
          {
            prop: 'data',
            type: 'string',
            describe: 'title值'
          }
        ]
      },
      {
        prop: 'menu',
        type: 'array',
        describe: 'menu列表',
        data: [
          {
            prop: '[value]',
            data: [
              {
                prop: 'type'
              },
              {
                prop: 'icon'
              },
              {
                prop: 'name'
              },
              {
                prop: 'act'
              },
              {
                prop: '[...]'
              }
            ]
          }
        ]
      },
      {
        prop: 'form',
        type: 'object',
        describe: 'form数据总对象，默认为build属性'
      },
      {
        prop: 'post',
        type: 'object',
        describe: 'post数据总对象，默认为build属性'
      }
    ],
    method: []
  }
  instrcutionData.prop = this._name
  this.buildInstrcution(instrcutionData)
}

SearchData.initInstrcution()

export default SearchData
