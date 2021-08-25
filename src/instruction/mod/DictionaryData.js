import DictionaryData from './../../mod/DictionaryData.js'
DictionaryData.initInstrcution = function() {
  const funcList = [
    {
      prop: 'defaultGetData',
      type: 'function',
      describe: '默认获取数据的接口，存在默认值，默认按照type获取showprop进行解析'
    },
    {
      prop: 'show',
      type: 'function',
      describe: '默认获取展示数据的接口，不存在时调用defaultGetData'
    },
    {
      prop: 'edit',
      type: 'function',
      describe: '默认获取编辑数据的接口，不存在时调用defaultGetData'
    },
    {
      prop: 'unedit',
      type: 'function',
      describe: '编辑数据转换为正常数据的转换函数'
    },
    {
      prop: 'check',
      type: 'function',
      describe: '判断编辑数据是否存在的判断函数,默认为当前值不同于defaultdata'
    },
    {
      prop: 'format',
      type: 'function',
      describe: 'edit接口数据转换为本地数据的格式化数据'
    }
  ]

  const instrcutionData = {
    extend: 'DefaultData',
    describe: '字典数据',
    build: [
      {
        prop: 'initdata',
        extend: true,
        data: [
          {
            prop: 'originfrom',
            type: 'string/array',
            default: '["list"]',
            describe: '数据来源接口判断值，默认为[list]'
          },
          {
            prop: 'originprop',
            type: 'string/object',
            class: 'InterfaceData',
            describe: '数据来源接口对应的字段值，不存在则取prop'
          },
          {
            prop: 'prop',
            type: 'string',
            describe: '实例唯一属性值，不存在时取originprop的默认值'
          },
          {
            prop: 'type',
            type: 'string/object',
            class: 'InterfaceData',
            describe: '保存的数据类型判断值，默认为string,存在showprop时的默认值为object'
          },
          {
            prop: 'modtype',
            type: 'string/object',
            class: 'InterfaceData',
            describe: '???属性不明，等待验证'
          },
          {
            prop: 'label',
            type: 'string/object',
            class: 'InterfaceData',
            describe: '名称取值，不存在时取name字段作为InterfaceData的默认值'
          },
          {
            prop: 'order',
            type: 'string/object',
            class: 'InterfaceData',
            describe: '暂未启用，排序判断值'
          },
          {
            prop: 'showprop',
            type: 'string/object',
            class: 'InterfaceData',
            describe: '显示属性值，指定模块显示指定属性，object/array数据'
          },
          {
            prop: 'showtype',
            type: 'string/object',
            class: 'InterfaceData',
            describe: '暂未启用，显示类型属性值，指定模块通过此值判断类型'
          },
          {
            prop: 'layout',
            type: 'object',
            describe: 'layout数据'
          },
          {
            prop: 'func',
            extend: true,
            data: funcList
          },
          {
            prop: 'mod',
            type: 'object',
            describe: '模块对象设置数据',
            data: [
              {
                prop: 'object',
                type: 'object',
                describe: '数据说明',
                data: [
                  {
                    prop: 'formatType',
                    type: 'string',
                    describe: [
                      '格式化类型',
                      '可能的值为list/info/edit(build/change)',
                      '默认格式化类型为当前prop，可通过设置此值指定模式，一般适应于单数据多同一模块情况'
                    ]
                  },
                  {
                    prop: 'type',
                    type: 'string',
                    describe: [
                      '编辑模块=>prop[build/change]||formatType[edit/build/change]时可设置',
                      '值为edit时此模块数据直接指向edit模块对应值，对于编辑模块数据统一的字典可如此设置'
                    ]
                  },
                  {
                    prop: '...',
                    type: 'string',
                    describe: '各模块对应可设置数据参照maindata/build/index中format(保存)/unformat(解析)进行'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        prop: 'payload',
        type: 'object',
        describe: 'payload数据',
        data: [
          {
            prop: 'layout',
            type: 'object',
            describe: '父类的layout数据，当本身参数无layout数据时以此数据为基准构建Layout'
          }
        ]
      }
    ],
    data: [
      {
        prop: 'originfrom',
        type: 'string/array',
        default: '["list"]',
        describe: '数据来源接口判断值，默认为[list]'
      },
      {
        prop: 'prop',
        extend: true,
        describe: '实例唯一属性值，不存在时取originprop的默认值'
      },
      {
        prop: 'layout',
        type: 'LayoutData',
        describe: 'layout数据'
      },
      {
        prop: 'interface',
        type: 'object',
        describe: 'InterfaceData数据类保存位置',
        data: [
          {
            prop: 'originprop',
            type: 'InterfaceData',
            describe: '数据来源接口对应的字段值，不存在则取prop'
          },
          {
            prop: 'type',
            type: 'InterfaceData',
            describe: '保存的数据类型判断值，默认为string,存在showprop时的默认值为object'
          },
          {
            prop: 'modtype',
            type: 'InterfaceData',
            describe: '???属性不明，等待验证'
          },
          {
            prop: 'label',
            type: 'InterfaceData',
            describe: '名称取值，不存在时取name字段作为InterfaceData的默认值'
          },
          {
            prop: 'order',
            type: 'InterfaceData',
            describe: '暂未启用，排序判断值'
          },
          {
            prop: 'showprop',
            type: 'InterfaceData',
            describe: '显示属性值，指定模块显示指定属性，object/array数据'
          },
          {
            prop: 'showtype',
            type: 'InterfaceData',
            describe: '暂未启用，显示类型属性值，指定模块通过此值判断类型'
          }
        ]
      },
      {
        prop: 'func',
        extend: true,
        data: funcList
      },
      {
        prop: 'mod',
        type: 'object',
        describe: '模块对象设置数据',
        data: [
          {
            prop: 'object',
            type: 'object',
            describe: '数据说明',
            data: [
              {
                prop: 'formatType',
                type: 'string',
                describe: [
                  '格式化类型',
                  '可能的值为list/info/edit(build/change)',
                  '默认格式化类型为当前prop，可通过设置此值指定模式，一般适应于单数据多同一模块情况'
                ]
              },
              {
                prop: 'type',
                type: 'string',
                describe: [
                  '编辑模块=>prop[build/change]||formatType[edit/build/change]时可设置',
                  '值为edit时此模块数据直接指向edit模块对应值，对于编辑模块数据统一的字典可如此设置'
                ]
              },
              {
                prop: '...',
                type: 'string',
                describe: '各模块对应可设置数据参照maindata/build/index中format(保存)/unformat(解析)进行'
              }
            ]
          }
        ]
      }
    ],
    method: []
  }
  instrcutionData.prop = this._name
  this.buildInstrcution(instrcutionData)
}

DictionaryData.initInstrcution()

export default DictionaryData
