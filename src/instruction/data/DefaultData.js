import DefaultData from './../../data/DefaultData.js'

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

DefaultData.initInstrcution()

export default DefaultData
