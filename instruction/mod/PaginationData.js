import PaginationData from './../../src/mod/PaginationData.js'

PaginationData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'SimpleData',
    describe: '分页器数据',
    build: [],
    data: [],
    method: []
  }
  instrcutionData.prop = this._name
  this.buildInstrcution(instrcutionData)
}

PaginationData.initInstrcution()

export default PaginationData
