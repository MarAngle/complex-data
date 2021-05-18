import ComplexData from './ComplexData'
import SearchData from './../mod/SearchData'

class ComplexDataWithSearch extends ComplexData {
  constructor (initdata) {
    if (!initdata) {
      initdata = {}
    }
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
  getSearchInit () {
    return this.getModule('search').getInit()
  }
}

export default ComplexDataWithSearch
