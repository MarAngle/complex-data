import ListData from './../../src/main/ListData.js'

ListData.initInstrcution = function() {
  const instrcutionData = {
    extend: 'ComplexDataWithSearch',
    describe: '列表模块',
    build: [
      {
        prop: 'initdata',
        extend: true,
        data: [
          {
            prop: 'choice',
            type: 'object',
            class: 'ChoiceData',
            describe: 'choice加载数据'
          },
          {
            prop: 'pagination',
            type: 'object/boolean',
            class: 'PaginationData',
            describe: 'pagination加载数据'
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
                prop: 'choice',
                class: 'ChoiceData',
                describe: '选择实例 '
              },
              {
                prop: 'pagination',
                class: 'PaginationData',
                describe: '分页器实例'
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

ListData.initInstrcution()

export default ListData
