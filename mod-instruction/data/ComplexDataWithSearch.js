import ComplexDataWithSearch from './../../src/data/ComplexDataWithSearch.js'

ComplexDataWithSearch.initInstrcution = function() {
  const instrcutionData = {
    extend: 'ComplexData',
    describe: '实现Search数据的加载',
    build: [
      {
        prop: 'initdata',
        extend: true,
        data: [
          {
            prop: 'search',
            type: 'object',
            class: 'SearchData',
            describe: 'search加载数据'
          }
        ]
      }
    ],
    data: [
      {
        prop: 'module',
        extend: true,
        data: [
          {
            prop: 'data',
            extend: true,
            data: [
              {
                prop: 'search',
                class: 'SearchData',
                describe: '检索数据'
              }
            ]
          }
        ]
      }
    ],
    method: []
  }
  instrcutionData.prop = this.$name
  this.buildInstrcution(instrcutionData)
}

ComplexDataWithSearch.initInstrcution()

export default ComplexDataWithSearch
