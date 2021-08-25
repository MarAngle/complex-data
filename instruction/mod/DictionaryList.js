import DictionaryList from './../../src/mod/DictionaryList.js'

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
                prop: '[index]',
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
            describe: '构建类型 init | push | replace]'
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
  instrcutionData.prop = this._name
  this.buildInstrcution(instrcutionData)
}

DictionaryList.initInstrcution()

export default DictionaryList
