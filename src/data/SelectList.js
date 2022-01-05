import _func from 'complex-func'
import utils from './../utils/index'
import DefaultData from './DefaultData'
import OptionData from './../mod/OptionData'

// 选择器数据
class SelectList extends DefaultData {
  constructor(initOption) {
    if (!initOption) {
      initOption = {}
    }
    initOption.data = utils.formatData(initOption.data, {
      list: []
    })
    super(initOption)
    this.option = new OptionData({
      prop: {
        value: 'value',
        label: 'label'
      },
      unhit: {
        // 对应设置值将会在设置unhit数据时生效
        value: undefined, // value值默认设置，存在值则会通过getItem获取对应的值对象
        deep: true, // 深拷贝判断值,复制值对象时是否进行深copy
        deepOption: undefined // 深拷贝设置值，deep==true时生效
      },
      undef: {
        // 对应设置值将会在设置undef数据时生效
        unhit: true, // 复制unhit
        value: undefined, // 同上
        deep: true, // 深拷贝判断值
        deepOption: undefined // 深拷贝设置值
      },
      equal: '==',
      deep: true
    })
    this.unhitData = {}
    this.undefData = {}
    this.format = {
      type: false
    }
    this.$initOption(initOption.option)
    this.setList(initOption.list)
    this.setFormat(initOption.format)
    this.setUnhitData(initOption.unhitData)
    this.setUndefData(initOption.undefData)
  }
  // 加载设置
  $initOption(option = {}) {
    this.option.initData(option)
  }
  // 加载数据
  setList(list) {
    if (list) {
      let dataType = _func.getType(list)
      let dataOption
      let dataList
      if (dataType === 'object') {
        dataList = list.list
        dataOption = list.option
      } else if (dataType === 'array') {
        dataList = list
      }
      if (dataList) {
        if (dataOption) {
          dataList = _func.formatList(dataList, dataOption)
        }
        for (let n = 0; n < dataList.length; n++) {
          let dataItem = dataList[n]
          if (dataItem._filter) {
            let type = _func.getType(dataItem._filter)
            if (type != 'array') {
              dataItem._filter = [ dataItem._filter ]
            }
          }
        }
        this.data.list = dataList
      }
    }
  }
  // 加载格式化设置
  setFormat(format) {
    if (format) {
      let formatType = _func.getType(format)
      if (formatType == 'object') {
        this.format = format
      } else if (formatType == 'number') {
        this.format.type = 'number'
        this.format.offset = this.format
      } else if (formatType == 'string') {
        this.format.type = 'string'
        this.format.head = this.format
        this.format.foot = ''
      } else if (formatType == 'function') {
        this.format.type = 'function'
        this.format.data = this.format
      }
    } else {
      this.format.type = false
    }
  }
  // 加载未命中数据
  setUnhitData(unhitData) {
    if (unhitData) {
      this.unhitData = unhitData
    } else {
      let unhitOption = this.option.getData('unhit')
      let deep = unhitOption.deep
      let deepOption = unhitOption.deepOption
      let value = unhitOption.value
      if (!this.checkUndef(value)) {
        this.unhitData = this.getItem(value, { deep, deepOption })
      }
    }
  }
  // 加载未定义数据， 默认等同于未命中数据
  setUndefData(undefData) {
    if (undefData) {
      this.undefData = undefData
    } else {
      let undefOption = this.option.getData('undef')
      let deep = undefOption.deep
      let deepOption = undefOption.deepOption
      if (undefOption.unhit) {
        this.undefData = this.formatItemByDeep(this.getUnhitData(), { deep, deepOption })
      } else {
        let value = undefOption.value
        if (!this.checkUndef(value)) {
          this.undefData = this.getItem(value, { deepOption })
        }
      }
    }
  }
  // 根据数据格式化value，差异化使用
  formatValue(value) {
    if (!this.format.type) {
      return value
    } else if (this.format.type == 'number') {
      return Number(value) + this.format.offset
    } else if (this.format.type == 'string') {
      return this.format.head + value + this.format.foot
    } else if (this.format.type == 'function') {
      return this.format.data(value)
    }
  }
  // 获取未命中默认值,通过重置函数实现自定义
  getUnhitData(value) {
    return this.unhitData
  }
  // 获取未定义默认值
  getUndefData() {
    return this.undefData
  }
  // 获取全列表，可根据format条件筛选
  getList(payload) {
    if (!payload) {
      payload = {}
    } else {
      let type = _func.getType(payload)
      if (type != 'object') {
        payload = {
          filter: payload
        }
      }
    }
    let list = []
    if (!payload.filter) {
      list = this.data.list
    } else {
      let type = _func.getType(payload.filter)
      if (type == 'function') {
        for (let n in this.data.list) {
          if (payload.filter(this.data.list[n])) {
            list.push(this.data.list[n])
          }
        }
      } else {
        for (let n in this.data.list) {
          let item = this.data.list[n]
          let push = false
          if (!item._filter) {
            push = true
          } else {
            if (item._filter.indexOf(payload.filter) > -1) {
              push = true
            }
          }
          if (push) {
            list.push(this.data.list[n])
          }
        }
      }
    }
    if (payload.deep) {
      list = _func.deepClone(list, payload.deepOption)
    }
    return list
  }
  // 检查value数据是否相同
  checkItem(itemvalue, value) {
    let equal = this.option.getData('equal')
    value = this.formatValue(value)
    if (equal == '===') {
      return itemvalue === value
    } else {
      return itemvalue == value
    }
  }
  // 检查undef值判断，可重写
  checkUndef(value) {
    return value === undefined
  }
  formatItemByDeep(item, { deep, deepOption }) {
    if (deep === undefined) {
      deep = this.option.getData('deep')
    }
    if (deep) {
      item = _func.deepClone(item, deepOption)
    }
    return item
  }
  // 获取对象
  getItem(value, option = {}) {
    let res
    if (this.checkUndef(value)) {
      res = this.getUndefData()
    } else {
      let prop = option.prop
      if (!prop) {
        let propData = this.option.getData('prop')
        prop = propData.value
      }
      for (let n in this.data.list) {
        let item = this.data.list[n]
        if (this.checkItem(item[prop], value)) {
          res = item
          break
        }
      }
    }
    if (!res) {
      res = this.getUnhitData(value)
    }
    res = this.formatItemByDeep(res, option)
    return res
  }
  // 根据index获取对象
  getItemByIndex(index, option = {}) {
    let res = this.data.list[index]
    if (!res) {
      res = this.getUnhitData()
    }
    res = this.formatItemByDeep(res, option)
    return res
  }
}

SelectList.$name = 'SelectList'

export default SelectList
