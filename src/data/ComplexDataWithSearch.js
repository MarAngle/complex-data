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
  /**
   * 加载ComplexDataWithSearch
   * @param {object} option 设置项
   * @param {object} [option.search] SearchData初始化参数或实例
   */
  _initComplexDataWithSearch ({ search }) {
    if (search) {
      search.parent = this
    }
    this.setModule('search', new SearchData(search))
  }
  /**
   * 设置对应type的数据
   * @param {string} [type = 'build'] modtype
   */
  setSearch (type) {
    this.getModule('search').setData(type)
  }
  /**
   * 重置检索值
   * @param {object} [option] 设置项
   * @param {boolean} [syncPost = true] 同步到post[type]中
   * @param {string} [type = build] modtype
   */
  resetSearch (option, syncPost, type) {
    this.getModule('search').resetFormData('reset', option, syncPost, type)
  }
  /**
   * 获取当前检索数据
   * @param {string} [type = 'build'] modtype
   * @param {boolean | object} [deep = true] 是否深拷贝
   * @returns {object}
   */
  getSearch (type, deep) {
    return this.getModule('search').getData(type, deep)
  }
  /**
   * 获取加载判断值
   * @returns {boolean}
   */
  getSearchInit () {
    return this.getModule('search').getInit()
  }
}

export default ComplexDataWithSearch
