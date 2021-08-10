import _func from 'complex-func'
import BaseData from './../data/BaseData'
import SelectList from './../data/SelectList'

class SelectData extends BaseData {
  constructor (initdata) {
    if (!initdata) {
      initdata = {}
    }
    super(initdata)
    this.triggerCreateLife('SelectData', 'beforeCreate', initdata)
    this._initSelectData(initdata)
    this._initSelectDataLife()
    this.triggerCreateLife('SelectData', 'created')
  }
  /**
   * 加载生命周期函数
   */
  _initSelectDataLife() {
    this.onLife('reseted', {
      id: 'AutoSelectDataReseted',
      data: (resetOption) => {
        if (this.parseResetOption(resetOption, 'select') !== false) {
          this.clearSelect()
        }
      }
    })
  }
  /**
   * 加载SelectData
   * @param {object} option 设置项
   * @param {object} [option.select] SelectList初始化参数或实例
   */
  _initSelectData ({
    select
  }) {
    this.setModule('select', new SelectList({
      name: this.name,
      prop: this.prop,
      ...select
    }))
  }
  /**
   * 清空select
   */
  clearSelect() {
    this.setSelect([])
  }
  setSelect(data) {
    this.getModule('select').setList(data)
  }
  getList(payload) {
    this.getModule('select').getList(payload)
  }
  getItem(value, option) {
    this.getModule('select').getItem(value, option)
  }
  getItemByIndex(index, option) {
    this.getModule('select').getItemByIndex(index, option)
  }
}

SelectData._name = 'SelectData'

export default SelectData
