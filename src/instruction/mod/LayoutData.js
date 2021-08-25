import LayoutData from './../../mod/LayoutData.js'

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

LayoutData.initInstrcution()

export default LayoutData
