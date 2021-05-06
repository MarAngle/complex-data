import _func from 'complex-func'
import BaseData from './../data/BaseData'

// formatItem => 格式化为保存数据

class DataPool extends BaseData {
  constructor (initdata = {}) {
    super(initdata)
    this.triggerCreateLife('DataPool', 'beforeCreate', initdata)
    this.data = {
      list: [],
      current: {}
    }
    this._initDataPool(initdata)
    if (!this.check) {
      this.printInfo('需要传递check函数作为相同对象判断!')
    }
    this.triggerCreateLife('DataPool', 'created')
  }
  _initDataPool ({
    option
  }) {
    this._initDataPoolOption(option)
  }
  // 设置选项
  _initDataPoolOption (option) {
    if (option) {
      // if (option.ditem) {
      //   this.option.setData('ditem', option.ditem)
      // }
    }
  }

  // 初始化列表数据
  initList (list = [], format = 'format') {
    this.data.list = []
    for (let n in list) {
      let item = list[n]
      this.pushItem(item, format)
    }
  }
  // 数据添加
  pushItem (item, format = 'format') {
    if (format == 'format') {
      item = this.triggerFormatItem(item)
    }
    this.data.list.push(item)
  }
  // 触发格式化函数
  triggerFormatItem (item) {
    if (this.formatItem) {
      return this.formatItem(item)
    } else {
      return item
    }
  }
  // 触发销毁函数
  triggerDestroyItem (item) {
    if (this.destroyItem) {
      this.destroyItem(item)
    }
  }
  // 插入数据
  pushList (list, format = 'format') {
    for (let n in list) {
      let item = list[n]
      this.pushItem(item, format)
    }
  }
  // 根据list更新datalist
  updateList (list, payload = {}) {
    if (!payload.check) {
      payload.check = (targetitem, originitem) => {
        return this.check(targetitem, originitem)
      }
    }
    if (!payload.update) {
      payload.update = (targetitem, originitem) => {
        this.updateItem(targetitem, originitem)
      }
    }
    if (!payload.format) {
      payload.format = (originitem) => {
        return this.triggerFormatItem(originitem)
      }
    }
    if (!payload.destroy) {
      payload.destroy = (targetitem) => {
        this.triggerDestroyItem(targetitem)
      }
    }
    _func.updateList(this.data.list, list, payload)
  }
  // 根据oitem更新titem
  updateItem (targetitem, originitem) {
    _func.updateData(targetitem, originitem)
  }

  // 根据属性值获取对象
  getItemByProp (prop, data) {
    if (!prop) {
      this.printInfo('获取ITEM必须定义prop!')
      return false
    }
    for (let n in this.data.list) {
      let item = this.data.list[n]
      if (item[prop] == data) {
        return item
      }
    }
    return false
  }
  // 通过check函数找到对应的对象
  getItemByCheck (data) {
    for (let n in this.data.list) {
      let item = this.data.list[n]
      if (this.check(item, data)) {
        return item
      }
    }
    return false
  }
  // 获取列表数据
  getList (option = {}) {
    let list = []
    let originlist = this.data.list
    if (option.formatList) {
      list = option.formatList(originlist)
    } else {
      list = originlist.slice()
    }
    if (option.checkItem) {
      for (let n = 0; n < list.length; n++) {
        let item = list[n]
        if (!option.checkItem(item)) {
          list.splice(n, 1)
          n--
        }
      }
    }
    return list
  }
}

export default DataPool
