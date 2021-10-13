import _func from 'complex-func'
import ComplexDataWithSearch from './../data/ComplexDataWithSearch'
import PaginationData from './../mod/PaginationData'
import ChoiceData from './../mod/ChoiceData'

class ListData extends ComplexDataWithSearch {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super(initOption)
    this.triggerCreateLife('ListData', 'beforeCreate', initOption)
    this.setModule('choice', new ChoiceData(initOption.choice))
    this._initPagination(initOption.pagination)
    this._initListDataLife()
    this.triggerCreateLife('ListData', 'created')
  }
  /**
   * 加载分页器
   * @param {object} [pagination] 分页器初始化参数
   */
  _initPagination (pagination) {
    if (pagination) {
      this.setModule('pagination', new PaginationData(pagination))
    } else {
      this.setModule('pagination', null)
    }
  }
  /**
   * 加载生命周期函数
   */
   _initListDataLife() {
    // 添加重载开始生命周期回调，此时通过设置项对分页器和选项进行操作
    this.onLife('beforeReload', {
      id: 'AutoListDataBeforeReload',
      data: (instantiater, option) => {
        if (this.getModule('pagination' && option.page)) {
          if (option.page === true) {
            this.setPageData(1, 'page')
          } else {
            this.setPageData(option.page.data, option.page.prop)
          }
        }
        // 根据设置和传值自动进行当前选项的重置操作
        this.autoChoiceReset(option.choice, 'reload')
      }
    })
  }
  /**
   * 获取分页器数据
   * @param {'page' | 'size' | 'num'} [prop] 获取'page' | 'size' | 'num'数据或者current{page,size}数据
   * @returns {number | { page, size }}
   */
  getPageData (prop) {
    let res
    if (this.getModule('pagination')) {
      if (prop == 'page') {
        res = this.getModule('pagination').getPage()
      } else if (prop == 'size') {
        res = this.getModule('pagination').getSize()
      } else if (prop == 'num') {
        res = this.getModule('pagination').getTotal()
      } else if (prop == 'totalPage') {
        res = this.getModule('pagination').getTotalPage()
      } else {
        res = this.getModule('pagination').getCurrent()
      }
    }
    return res
  }
  /**
   * 重置分页器
   */
  resetPageData () {
    if (this.getModule('pagination')) {
      this.getModule('pagination').reset()
    }
  }
  /**
   * 设置分页器数据
   * @param {number} data 需要设置的属性值
   * @param {'page' | 'size' | 'num'} [prop = 'page'] 需要设置的参数'page' | 'size' | 'num'
   */
  setPageData (data, prop = 'page') {
    if (this.getModule('pagination')) {
      if (prop == 'page') {
        this.getModule('pagination').setPage(data)
      } else if (prop == 'size') {
        this.getModule('pagination').setSize(data) // { size, page }
      } else if (prop == 'num') {
        this.getModule('pagination').setTotal(data)
      }
    }
  }
  /**
   * 格式化列表数据
   * @param {object[]} datalist 源数据列表
   * @param {number} [totalnum] 总数
   * @param {string} [originfromType] originfromType
   * @param {object} [option] 参数
   */
  formatData (datalist = [], totalnum, originfromType, option) {
    this.formatListData(this.data.list, datalist, originfromType, option)
    this.setPageData(totalnum, 'num')
  }
  /**
   * 根据option, defaultOption自动判断重置与否
   * @param {object | string} [option] 参数
   * @param {object | string} [defaultOption] 默认参数
   */
  autoChoiceReset(data) {
    this.getModule('choice').autoReset(data)
  }
  /**
   * 数据变更=>id作为唯一基准
   * @param {string[]} idList ID列表
   * @param {object[]} currentList ITEM列表
   * @param {'auto' | 'force'} [check = 'auto'] 检查判断值,auto在长度相等时直接认为格式符合，否则进行格式化判断
   * @param {string} [idProp] id的属性,不存在时自动从DL中获取
   */
  changeChoice(idList, currentList, check, idProp) {
    if (!idProp) {
      idProp = this.getDictionaryPropData('prop', 'id')
    }
    this.getModule('choice').changeData(idList, currentList, check, idProp)
  }
  /**
   * 重置操作
   * @param {boolean} force 重置判断值
   */
  resetChoice(force) {
    this.getModule('choice').reset(force)
  }
  /**
   * 获取选项数据
   * @param {'id' | 'list'} [prop] 存在prop获取data[prop]，否则获取{id, list}
   * @returns {string[] | object[] | {id, list}}
   */
  getChoiceData (prop) {
    return this.getModule('choice').getData(prop)
  }
  // --数据相关--*/
  /**
   * 获取列表数据对象
   * @param {object} data index值
   * @param {'index'} [type] 方法
   * @returns {object}
   */
  getItem (data, type = 'index') {
    if (type == 'index') {
      return this.data.list[data]
    }
  }
  /**
   * 获取对象的index值
   * @param {object} data 列表数据
   * @returns {number}
   */
  getIndex (data) {
    return this.data.list.indexOf(data)
  }
}

ListData._name = 'ListData'

export default ListData
