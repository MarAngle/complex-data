import TreeData from './../../main/TreeData.js'

TreeData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'ListData',
    describe: '树形数据',
    build: [],
    data: [],
    method: []
  }
  instrcutionData.prop = this._name
  this.buildInstrcution(instrcutionData)
}

TreeData.initInstrcution()

export default TreeData
