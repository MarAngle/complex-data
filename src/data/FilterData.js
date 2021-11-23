import _func from 'complex-func'
import utils from './../utils/index'
import BaseData from './BaseData'

class FilterData extends BaseData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    initOption.data = utils.formatData(initOption.data, {
      originlist: [],
      list: []
    })
    super(initOption)
    this.triggerCreateLife('FilterData', 'beforeCreate', initOption)
    this.initFilter(initOption.filter)
    this.triggerCreateLife('FilterData', 'created')
  }
  initFilter(filter) {
    this.filter = {}
    if (filter) {
      for (let prop in filter) {
        this.setFilter(filter[prop], prop)
      }
    }
  }
  setFilter(filterItem, prop) {
    if (!filterItem.check) {
      filterItem.check = function(item) {
        let data = _func.getProp(item, this.prop)
        if (_func.isExist(this.data)) {
          return data == this.data
        } else {
          return true
        }
      }
    }
    this.filter[prop] = filterItem
  }
  setFilterData(prop, data, unFilter) {
    if (this.filter[prop]) {
      this.filter[prop].data = data
      if (!unFilter) {
        this.triggerFilter('filter', prop)
      }
    } else {
      this.$exportMsg(`不存在${prop},setFilterData失败!`)
    }
  }
  triggerFilter(from, prop) {
    this.triggerLife('beforeFilter', this, from, prop)
    this.data.list = []
    for (let i = 0; i < this.data.originlist.length; i++) {
      let oitem = this.data.originlist[i];
      let check = this.checkFilter(oitem)
      if (check) {
        this.data.list.push(oitem)
      }
    }
    this.triggerLife('filtered', this, from, prop)
  }
  checkFilter(item) {
    for (let prop in this.filter) {
      let filterItem = this.filter[prop]
      if (!filterItem.check(item)) {
        return false
      }
    }
    return true
  }
  setOrigin(list, unFilter) {
    this.triggerLife('beforeUpdate', this)
    this.data.originlist = list
    this.triggerLife('updated', this)
    if (!unFilter) {
      this.triggerFilter('origin')
    }
  }
  getList() {
    return this.data.list
  }
}

FilterData.$name = 'FilterData'

export default FilterData
