import OptionData from './../../mod/OptionData.js'

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
  instrcutionData.prop = this._name
  this.buildInstrcution(instrcutionData)
}

OptionData.initInstrcution()

export default OptionData
