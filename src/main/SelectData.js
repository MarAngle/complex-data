import _func from 'complex-func'
import BaseData from './../data/BaseData'
import SelectList from './../data/SelectList'

class SelectData extends BaseData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super(initOption)
    this.$triggerCreateLife('SelectData', 'beforeCreate', initOption)
    this.setModule('select', new SelectList({
      name: this.name,
      prop: this.prop,
      ...initOption.select
    }))
    this.$initSelectDataLife()
    this.$triggerCreateLife('SelectData', 'created')
  }
  /**
   * 加载生命周期函数
   */
  $initSelectDataLife() {
    this.onLife('reseted', {
      id: 'AutoSelectDataReseted',
      data: (instantiater, resetOption) => {
        if (this.$parseResetOption(resetOption, 'select') !== false) {
          this.clearSelect()
        }
      }
    })
  }
  /**
   * 清空select
   */
  clearSelect() {
    this.setSelect([])
  }
  setSelect(data) {
    return this.getModule('select').setList(data)
  }
  getList(payload) {
    return this.getModule('select').getList(payload)
  }
  getItem(value, option) {
    return this.getModule('select').getItem(value, option)
  }
  getItemByIndex(index, option) {
    return this.getModule('select').getItemByIndex(index, option)
  }
}

SelectData.$name = 'SelectData'

export default SelectData
