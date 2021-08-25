import SimpleData from './../../data/SimpleData.js'

SimpleData.initInstrcution = function() {
  const instrcutionData = {
    describe: '基础类，所有其他类都继承于此，可实现全局定制功能，此处实现基本的信息输出和说明挂载',
    build: [],
    data: [
      {
        prop: '$LocalTempData',
        type: 'object',
        describe: '全局缓存保存字段',
        data: [
          {
            prop: 'moduleId',
            type: 'string',
            describe: '唯一识别符'
          }
        ]
      }
    ],
    method: [
      {
        prop: 'buildPrintMsg',
        type: 'function',
        describe: '创建输出信息函数',
        args: [
          {
            name: 'content',
            required: true,
            describe: '需要输出的信息，前缀会自动拼接_selfName'
          }
        ]
      },
      {
        prop: 'printMsg',
        type: 'function',
        describe: '警告信息输出函数',
        args: [
          {
            name: 'content',
            required: true,
            describe: '需要输出的信息'
          },
          {
            name: 'type',
            required: false,
            default: 'error',
            type: 'error | warn | log',
            describe: 'console类型'
          },
          {
            name: 'option',
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
        return: {
          name: '_selfName',
          // eslint-disable-next-line no-template-curly-in-string
          describe: '[CLASS:${this.constructor._name}]'
        }
      },
      {
        prop: '$getModuleId',
        type: 'function',
        describe: '获取唯一识别符函数',
        return: {
          name: 'moduleId',
          describe: 'module加载判断的唯一识别符'
        }
      }
    ]
  }
  instrcutionData.prop = this.name
  this.buildInstrcution(instrcutionData)
}

SimpleData.initInstrcution()

export default SimpleData
