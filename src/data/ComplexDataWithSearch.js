import ComplexData from './ComplexData'
import SearchData from './../mod/SearchData'

class ComplexDataWithSearch extends ComplexData {
  constructor (initdata = {}) {
    super(initdata)
    this.triggerCreateLife('ComplexDataWithSearch', 'beforeCreate', initdata)
    this._initComplexDataWithSearch(initdata)
    this.triggerCreateLife('ComplexDataWithSearch', 'created')
  }
  _initComplexDataWithSearch ({ search }) {
    if (search) {
      search.parent = this
    }
    this.setModule('search', new SearchData(search))
  }
  setSearch (type) {
    this.getModule('search').setData(type)
  }
  resetSearch (option, syncPost, type) {
    this.getModule('search').resetFormData('reset', option, syncPost, type)
  }
  getSearch (type, deep) {
    return this.getModule('search').getData(type, deep)
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
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
                prop: 'search',
                class: 'SearchData',
                describe: '检索数据'
              }
            ]
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

ComplexDataWithSearch.initInstrcution()

export default ComplexDataWithSearch
