import SelectData from './../../src/main/SelectData.js'

SelectData.initInstrcution = function() {
  const instrcutionData = {
    describe: 'Select数据类',
    build: [],
    data: [],
    method: []
  }
  instrcutionData.prop = this.$name
  this.buildInstrcution(instrcutionData)
}

SelectData.initInstrcution()

export default SelectData
