import InterfaceData from './../../mod/InterfaceData.js'

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
  instrcutionData.prop = this._name
  this.buildInstrcution(instrcutionData)
}

InterfaceData.initInstrcution()

export default InterfaceData
