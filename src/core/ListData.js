import _func from 'complex-func'
import utils from './../utils/index'
import BaseData from './../data/BaseData'

class ListData extends BaseData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    initOption.data = utils.formatData(initOption.data, {
      list: []
    })
    super(initOption)
    this.triggerCreateLife('ListData', 'beforeCreate', initOption)
    this.$initListDataLife()
    this.triggerCreateLife('ListData', 'created')
  }
  /**
   * 加载生命周期函数
   */
   $initListDataLife() {
    // 添加重载开始生命周期回调，此时通过设置项对分页器和选项进行操作
    this.onLife('beforeReload', {
      id: 'AutoListDataBeforeReload',
      data: (instantiater, resetOption) => {
        if (this.parseResetOption(resetOption, 'data') !== false) {
          if (this.parseResetOption(resetOption, 'data.list') !== false) {
            this.resetArray(this.data.list)
          }
        }
      }
    })
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

ListData.$name = 'ListData'

export default ListData
