import ComplexData from './ComplexData'
import SearchData from './../mod/SearchData'

class ComplexDataWithSearch extends ComplexData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super(initOption)
    this.$triggerCreateLife('ComplexDataWithSearch', 'beforeCreate', initOption)
    if (initOption.search) {
      initOption.search.parent = this
    }
    this.setModule('search', new SearchData(initOption.search))
    this.$triggerCreateLife('ComplexDataWithSearch', 'created')
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
    this.getModule('search').resetSearchFormData('reset', option, syncPost, type)
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

ComplexDataWithSearch.$name = 'ComplexDataWithSearch'

export default ComplexDataWithSearch
