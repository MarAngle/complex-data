import {
  BaseData,
  ComplexData,
  ComplexDataWithSearch,
  DefaultData,
  SelectList,
  SimpleData,
  ChoiceData,
  DictionaryData,
  DictionaryList,
  EmptyData,
  ExtraData,
  FuncData,
  IdData,
  InstrcutionData,
  InterfaceData,
  LayoutData,
  LifeData,
  ModuleData,
  OptionData,
  PaginationData,
  ParentData,
  PromiseData,
  SearchData,
  StatusData,
  StatusDataItem,
  UpdateData,
  InfoData,
  ListData,
  TreeData
} from './../../index'
import instrcution from './data'

SimpleData.buildInstrcution = function (instrcutionData) {
  instrcution.build(instrcutionData)
}

SimpleData.getInstrcution = function (type) {
  return instrcution.get(this.name, type)
}

SimpleData.initInstrcution = function() {
  const instrcutionData = {
    describe: '基础类，所有其他类都继承于此，可实现全局定制功能，此处实现基本的信息输出和说明挂载',
    build: [],
    data: [
      {
        prop: '$LocalTempData',
        type: 'object',
        describe: '全局缓存保存字段'
      }
    ],
    method: [
      {
        prop: 'buildPrintMsg',
        type: 'function',
        describe: '输出信息生成函数'
      },
      {
        prop: 'printMsg',
        type: 'function',
        describe: '信息输出函数'
      },
      {
        prop: '_selfName',
        type: 'function',
        describe: '名称获取函数'
      }
    ]
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

DefaultData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '实现module/extra/parent数据的加载，实现func/method的挂载',
    build: [
      {
        prop: 'initdata',
        type: 'object',
        describe: '构建参数',
        required: true,
        data: [
          {
            prop: 'name',
            type: 'string',
            required: false,
            describe: '名称'
          },
          {
            prop: 'prop',
            type: 'string',
            required: false,
            describe: '属性'
          },
          {
            prop: 'life',
            type: 'object',
            required: false,
            describe: 'life加载数据,仅此处定义created生命周期时可实现触发'
          },
          {
            prop: 'data',
            type: 'object',
            required: false,
            describe: 'data属性赋值'
          },
          {
            prop: 'parent',
            type: 'object',
            required: false,
            describe: '父数据'
          },
          {
            prop: 'extra',
            type: 'object',
            required: false,
            describe: 'extra数据'
          },
          {
            prop: 'func',
            type: 'object',
            required: false,
            describe: 'func函数，将会挂载到跟属性func上，this指向实例'
          },
          {
            prop: 'methods',
            type: 'object',
            required: false,
            describe: 'methods函数，将会挂载到实例上，this不做操作'
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
            type: 'array[string]',
            describe: '继承链上所有创建相关生命周期名称保存数组，创建生命周期触发仅能在创建时触发，此列表缓存实现后期挂载的生命周期创建相关函数时进行可能无法触发的提示'
          }
        ]
      },
      {
        prop: 'name',
        type: 'string',
        describe: '名称'
      },
      {
        prop: 'prop',
        type: 'string',
        describe: '属性'
      },
      {
        prop: 'data',
        type: 'object',
        describe: 'data数据对象'
      },
      {
        prop: 'func',
        type: 'object',
        describe: 'func函数列表'
      },
      {
        prop: 'module',
        class: 'ModuleData',
        describe: '模块数据',
        data: [
          {
            prop: 'life',
            class: 'LifeData',
            describe: '生命周期数据'
          },
          {
            prop: 'extra',
            class: 'ExtraData',
            describe: '属性'
          },
          {
            prop: 'parent',
            class: 'ParentData',
            describe: '属性'
          }
        ]
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

BaseData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'DefaultData',
    describe: '实现option/status/update/life/promise数据的加载,需要定义getData函数',
    build: [
      {
        prop: 'initdata',
        extend: true,
        data: [
          {
            prop: 'status',
            type: 'object',
            class: 'StatusData',
            describe: 'status加载数据'
          },
          {
            prop: 'update',
            type: 'object',
            class: 'UpdateData',
            describe: 'update加载数据'
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
            class: 'array',
            describe: '保存继承链条中生命周期的名称的列表'
          }
        ]
      },
      {
        prop: 'module',
        extend: true,
        data: [
          {
            prop: 'option',
            class: 'OptionData',
            describe: '设置项数据'
          },
          {
            prop: 'status',
            class: 'StatusData',
            describe: '状态数据'
          },
          {
            prop: 'promise',
            class: 'PromiseData',
            describe: 'promise数据'
          },
          {
            prop: 'update',
            class: 'UpdateData',
            describe: '更新数据'
          }
        ]
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

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
            prop: 'option',
            type: 'object',
            describe: 'option设置（暂无）'
          },
          {
            prop: 'data',
            extend: true,
            describe: '默认传递list[]和current{}'
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
            prop: 'dictionary',
            class: 'DictionaryList',
            describe: '字典列表数据'
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
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

ComplexDataWithSearch.initInstrcution = function() {
  const instrcutionData = {
    extend: 'ComplexData',
    describe: '实现Search数据的加载',
    build: [
      {
        prop: 'initdata',
        extend: true,
        data: [
          {
            prop: 'search',
            type: 'object',
            class: 'SearchData',
            describe: 'search加载数据'
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
            prop: 'search',
            class: 'SearchData',
            describe: '检索数据'
          }
        ]
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

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
                prop: '...array',
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
                prop: '...',
                type: 'string',
                describe: '...'
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
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

InfoData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'ComplexDataWithSearch',
    describe: '信息模块',
    build: [],
    data: [],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

ListData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'ComplexDataWithSearch',
    describe: '列表模块',
    build: [
      {
        prop: 'initdata',
        extend: true,
        data: [
          {
            prop: 'choice',
            type: 'object',
            class: 'ChoiceData',
            describe: 'choice加载数据'
          },
          {
            prop: 'pagination',
            type: 'object/boolean',
            class: 'PaginationData',
            describe: 'pagination加载数据'
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
            prop: 'choice',
            class: 'ChoiceData',
            describe: '选择实例 '
          },
          {
            prop: 'pagination',
            class: 'PaginationData',
            describe: '分页器实例'
          }
        ]
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

TreeData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'ListData',
    describe: '树形数据',
    build: [],
    data: [],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

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
            describe: '数据来源接口判断值，默认为[list]'
          },
          {
            prop: 'originprop',
            type: 'string/object',
            describe: '数据来源接口对应的字段值，默认为prop'
          },
          {
            prop: 'prop',
            type: 'string',
            describe: '本地唯一属性值，不存在时通过originprop的默认值为基准'
          },
          {
            prop: 'type',
            type: 'string/object',
            describe: '保存的数据类型判断值，默认为string,存在showprop时的默认值为object'
          },
          {
            prop: 'modtype',
            type: 'string/object',
            describe: '???'
          },
          {
            prop: 'label',
            type: 'string/object',
            describe: '名称取值，不存在时取name字段作为InterfaceData的默认值'
          },
          {
            prop: 'order',
            type: 'string/object',
            describe: '排序判断值，占位，暂无用途'
          },
          {
            prop: 'showprop',
            type: 'string/object',
            describe: '显示属性值，指定模块显示指定属性，object/array数据'
          },
          {
            prop: 'showtype',
            type: 'string/object',
            describe: '显示类型属性值，指定模块通过此值判断类型，占位，暂未启用'
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
            describe: '???'
          }
        ]
      }
    ],
    data: [
      {
        prop: 'originfrom',
        type: 'string/array',
        describe: '数据来源接口判断值，默认为[list]'
      },
      {
        prop: 'prop',
        extend: true,
        describe: '本地唯一属性值，不存在时通过originprop的默认值为基准'
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
            describe: '数据来源接口对应的字段值，默认为prop'
          },
          {
            prop: 'type',
            type: 'InterfaceData',
            describe: '保存的数据类型判断值，默认为string,存在showprop时的默认值为object'
          },
          {
            prop: 'modtype',
            type: 'InterfaceData',
            describe: '???'
          },
          {
            prop: 'label',
            type: 'InterfaceData',
            describe: '名称取值，不存在时取name字段作为InterfaceData的默认值'
          },
          {
            prop: 'order',
            type: 'InterfaceData',
            describe: '排序判断值，占位，暂无用途'
          },
          {
            prop: 'showprop',
            type: 'InterfaceData',
            describe: '显示属性值，指定模块显示指定属性，object/array数据'
          },
          {
            prop: 'showtype',
            type: 'InterfaceData',
            describe: '显示类型属性值，指定模块通过此值判断类型，占位，暂未启用'
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
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

DictionaryList.initInstrcution = function() {
  const instrcutionData = {
    extend: 'DefaultData',
    describe: '字典列表数据',
    build: [
      {
        prop: 'initdata',
        extend: true,
        data: [
          {
            prop: 'option',
            type: 'object',
            describe: '设置项数据'
          },
          {
            prop: 'layout',
            type: 'object',
            describe: 'layout数据'
          },
          {
            prop: 'list',
            type: 'array',
            describe: '字典构建数据',
            data: [
              {
                prop: '[value]',
                type: 'object',
                class: 'DictionaryData'
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
            prop: 'type',
            type: 'object',
            describe: '构建类型[init/push/replace]'
          }
        ]
      }
    ],
    data: [
      {
        prop: 'option',
        type: 'object',
        describe: '设置数据保存位置'
      },
      {
        prop: 'propData',
        type: 'object',
        describe: 'propData',
        data: [
          {
            prop: 'id',
            type: 'object',
            describe: 'ID值对象',
            data: [
              {
                prop: 'prop',
                type: 'string',
                describe: 'ID属性值'
              },
              {
                prop: 'data',
                type: 'string',
                describe: 'ID值'
              }
            ]
          },
          {
            prop: 'parentId',
            type: 'object',
            describe: '父ID值对象',
            data: [
              {
                prop: 'prop',
                type: 'string',
                describe: '父ID属性值'
              },
              {
                prop: 'data',
                type: 'string',
                describe: '父ID值'
              }
            ]
          },
          {
            prop: 'children',
            type: 'object',
            describe: 'children值对象',
            data: [
              {
                prop: 'prop',
                type: 'string',
                describe: 'children属性值'
              },
              {
                prop: 'data',
                type: 'string',
                describe: 'children值'
              }
            ]
          }
        ]
      },
      {
        prop: 'data',
        type: 'map',
        describe: '字典保存位置',
        data: [
          {
            prop: '[value]',
            type: 'object',
            class: 'DictionaryData'
          }
        ]
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

ExtraData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '实现额外数据的保存功能',
    build: [
      {
        prop: 'data',
        type: 'object',
        describe: '额外数据对象',
        required: false
      }
    ],
    data: [
      {
        prop: 'data',
        type: 'object',
        describe: '额外数据保存位置'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

FuncData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '生命周期数据格式',
    build: [
      {
        prop: 'initdata',
        type: 'object',
        describe: '生命周期设置数据',
        data: [
          {
            prop: 'name',
            type: 'string',
            describe: '文字标识'
          },
          {
            prop: 'data',
            type: 'function/object',
            describe: '函数对象参数'
          }
        ]
      }
    ],
    data: [
      {
        prop: 'name',
        type: 'string',
        describe: '文字标识'
      },
      {
        prop: 'data',
        type: 'map',
        describe: '函数保存位置'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

InterfaceData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '接口数据类，主要实现同字段在不同情况下值可能不同的数据类型',
    build: [
      {
        prop: 'initdata',
        type: 'any',
        describe: 'object需要必传default(除非确认每次的取值都能指定并且命中),非object状态下值会直接赋值到default',
        data: [
          {
            prop: 'default',
            type: 'any',
            describe: '必传的值，当其他的字段不存在时取此字段'
          }
        ]
      }
    ],
    data: [
      {
        prop: 'data',
        type: 'object',
        describe: '数据保存位置',
        data: [
          {
            prop: 'default',
            type: 'any',
            describe: '默认值'
          },
          {
            prop: '[...]',
            type: 'any',
            describe: '其他对应值'
          }
        ]
      },
      {
        prop: 'init',
        type: 'boolean',
        describe: '赋值判断值'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

LayoutData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '布局描述类',
    build: [
      {
        prop: 'initdata',
        type: 'object',
        describe: 'key=>取值value值',
        data: [
          {
            prop: '[key]',
            type: 'any',
            describe: 'key的布局'
          },
          {
            prop: '[value]',
            type: 'object',
            describe: '布局数据',
            data: [
              {
                prop: 'type',
                type: 'string',
                describe: '默认grid/width'
              },
              {
                prop: 'label',
                type: 'object/number',
                describe: 'grid状态布局数据，默认{ span: ... },可传递栅栏数据对象'
              },
              {
                prop: 'content',
                type: 'object/number',
                describe: 'grid状态布局数据，默认{ span: ... },可传递栅栏数据对象'
              },
              {
                prop: 'content',
                type: 'number',
                describe: 'width布局数据，默认undef'
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
        class: 'InterfaceData',
        describe: '布局描述数据保存位置'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

LifeData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '生命周期数据格式',
    build: [
      {
        prop: 'data',
        type: 'object',
        describe: '生命周期设置数据',
        data: [
          {
            prop: '[key]',
            type: 'string',
            describe: '生命周期名称'
          },
          {
            prop: '[value]',
            type: 'object/function',
            describe: '函数回调对象/函数'
          }
        ]
      }
    ],
    data: [
      {
        prop: 'data',
        type: 'object',
        describe: '函数数据保存位置'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

ModuleData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '实现模块加载功能',
    build: [
      {
        prop: 'initdata',
        type: 'object',
        describe: '接受object,每个属性就是对应的module',
        required: false
      },
      {
        prop: 'parent',
        type: 'object',
        describe: 'parent父实例',
        required: false
      }
    ],
    data: [
      {
        prop: 'data',
        type: 'object',
        describe: 'module数据保存位置'
      },
      {
        prop: 'parent',
        type: 'object',
        describe: 'parent父实例保存位置(因依赖问题此处非ParentData实例)'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

OptionData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '设置项数据格式',
    build: [
      {
        prop: 'structData',
        describe: '加载设置项数据结构数据'
      }
    ],
    data: [
      {
        prop: 'data',
        type: 'object',
        describe: '设置项数据保存位置'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

PaginationData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '分页器数据',
    build: [
      {
        prop: 'initdata',
        type: 'object/boolean',
        describe: '分页器加载数据，true = {}',
        data: [
          {
            prop: 'size',
            type: 'object/number',
            describe: 'size设置值,number情况下此值格式话为{ current: value }',
            data: [
              {
                prop: 'current',
                type: 'number',
                describe: '当前size值'
              },
              {
                prop: 'list',
                type: 'array[string]',
                describe: 'size可选列表'
              }
            ]
          },
          {
            prop: 'option',
            type: 'object',
            describe: '设置项',
            data: [
              {
                prop: 'jumper',
                type: 'boolean',
                describe: '跳转器，默认为真'
              },
              {
                prop: 'size',
                type: 'boolean',
                describe: 'size更换器，默认为真'
              }
            ]
          },
          {
            prop: 'props',
            type: 'object',
            describe: '扩展设置项',
            data: [
              {
                prop: 'props',
                type: 'object',
                describe: '扩展设置项PROPS'
              }
            ]
          }
        ]
      }
    ],
    data: [
      {
        prop: 'status',
        type: 'object',
        describe: '判断值对象',
        data: [
          {
            prop: 'init',
            type: 'boolean',
            describe: '加载判断'
          }
        ]
      },
      {
        prop: 'data',
        type: 'object',
        describe: '数据保存位置',
        data: [
          {
            prop: 'page',
            type: 'object',
            describe: '页码数据对象',
            data: [
              {
                prop: 'current',
                type: 'number',
                describe: '当前页码'
              },
              {
                prop: 'total',
                type: 'number',
                describe: '总页码'
              }
            ]
          },
          {
            prop: 'size',
            type: 'object',
            describe: '页size数据对象',
            data: [
              {
                prop: 'current',
                type: 'number',
                describe: '当前页size'
              },
              {
                prop: 'list',
                type: 'array[string]',
                describe: '总页size可选列表'
              }
            ]
          },
          {
            prop: 'num',
            type: 'object',
            describe: '数据对象',
            data: [
              {
                prop: 'total',
                type: 'number',
                describe: '总数'
              }
            ]
          }
        ]
      },
      {
        prop: 'option',
        type: 'object',
        describe: '扩展设置',
        data: [
          {
            prop: 'props',
            type: 'object',
            describe: '扩展设置PROPS'
          }
        ]
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

ParentData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '实现父实例的挂载',
    build: [
      {
        prop: 'data',
        type: 'object',
        describe: '父实例',
        required: false
      }
    ],
    data: [
      {
        prop: 'data',
        type: 'object',
        describe: '父实例数据保存位置'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

PromiseData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: 'promise数据格式',
    build: [
      {
        prop: 'initdata',
        type: 'object',
        describe: '加载数据',
        data: [
          {
            prop: 'data',
            type: 'object',
            describe: 'promise设置数据(key=>value)'
          }
        ]
      }
    ],
    data: [
      {
        prop: 'data',
        type: 'object',
        describe: 'promise数据保存位置'
      }
    ],
    method: []
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

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
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

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
                prop: '[key]',
                type: 'string',
                describe: '属性值'
              },
              {
                prop: '[value]',
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
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

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

// 自动加载所有的说明
let data = {
  SimpleData,
  DefaultData,
  BaseData,
  ComplexData,
  ComplexDataWithSearch,
  SelectList,
  ChoiceData,
  DictionaryData,
  DictionaryList,
  EmptyData,
  ExtraData,
  IdData,
  InstrcutionData,
  InterfaceData,
  LifeData,
  OptionData,
  PaginationData,
  ParentData,
  PromiseData,
  SearchData,
  StatusData,
  StatusDataItem,
  UpdateData,
  ListData,
  InfoData,
  TreeData
}
for (let n in data) {
  if (data[n].initInstrcution) {
    data[n].initInstrcution()
  }
}
