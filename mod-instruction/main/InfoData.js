import InfoData from './../../src/main/InfoData.js'

InfoData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'ComplexDataWithSearch',
    describe: '信息模块',
    build: [],
    data: [],
    method: []
  }
  instrcutionData.prop = this.$name
  this.buildInstrcution(instrcutionData)
}

InfoData.initInstrcution()

export default InfoData
