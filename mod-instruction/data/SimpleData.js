import SimpleData from './../../src/data/SimpleData.js'

SimpleData.initInstrcution = function() {
  const instrcutionData = {
    describe: '基础类，所有其他类都继承于此，可实现全局定制功能，此处实现基本的信息输出和说明挂载',
    build: [],
    data: [
      {
        prop: '$id',
        type: 'string',
        describe: '唯一识别符'
      }
    ],
    method: [
      {
        prop: '$createMsg',
        type: 'function',
        describe: '创建输出信息函数',
        args: [
          {
            prop: 'content',
            required: true,
            describe: '需要输出的信息，前缀会自动拼接_selfName'
          }
        ]
      },
      {
        prop: '$exportMsg',
        type: 'function',
        describe: '警告信息输出函数',
        args: [
          {
            prop: 'content',
            required: true,
            describe: '需要输出的信息'
          },
          {
            prop: 'type',
            required: false,
            default: 'error',
            type: 'error | warn | log',
            describe: 'console类型'
          },
          {
            prop: 'option',
            required: false,
            type: 'object',
            describe: '设置项'
          }
        ]
      },
      {
        prop: '_selfName',
        type: 'function',
        describe: '获取名称函数',
        // eslint-disable-next-line no-template-curly-in-string
        return: '[CLASS:${this.constructor.$name}]'
      },
      {
        prop: '$getId',
        type: 'function',
        describe: '获取唯一识别符函数',
        return: 'module加载判断的唯一识别符'
      }
    ]
  }
  instrcutionData.prop = this.$name
  this.buildInstrcution(instrcutionData)
}

SimpleData.initInstrcution()

export default SimpleData
