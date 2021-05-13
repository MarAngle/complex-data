import _func from 'complex-func'
import utils from './../utils/index'
import DefaultData from './DefaultData'
import OptionData from './../mod/OptionData'

// 本地选择器数据
class SelectList extends DefaultData {
  constructor(initdata) {
    if (!initdata) {
      initdata = {}
    }
    initdata.data = utils.formatData(initdata.data, {
      list: []
    })
    super(initdata)
    this.triggerCreateLife('SelectList', 'beforeCreate', initdata)
    this.option = new OptionData({
      prop: {
        value: 'value',
        label: 'label'
      },
      unhit: {
        value: undefined, // value值默认设置，true为设置为第一个选项,其他遍历选项
        deep: true, // 深拷贝判断值
        deepOption: undefined // 深拷贝设置值
      },
      undef: {
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
    this._initSelectList(initdata)
    this.triggerCreateLife('SelectList', 'created')
  }
  _initSelectList({
    list,
    option,
    format,
    unhitData,
    undefData
  }) {
    this._initOption(option)
    this.initDataList(list)
    this._initFormat(format)
    this._initUnhitData(unhitData)
    this._initUndefData(undefData)
  }
  // 加载设置
  _initOption(option = {}) {
    this.option.initData(option)
  }
  // 加载数据
  initDataList(list) {
    if (list) {
      let dataType = _func.getType(list)
      let dataOption
      let dataList
      if (dataType == 'array') {
        dataList = list
      } else {
        dataList = list.list
        dataOption = list.option
      }
      if (dataOption) {
        dataList = _func.formatList(dataList, dataOption)
      }
      for (let n = 0; n < dataList.length; n++) {
        let dataItem = dataList[n]
        if (dataItem.filter) {
          let type = _func.getType(dataItem.filter)
          if (type != 'array') {
            dataItem.filter = [ dataItem.filter ]
          }
        } else {
          dataItem.filter = false
        }
      }
      this.data.list = dataList
    }
  }
  // 加载格式化设置
  _initFormat(format) {
    if (format) {
      let formatType = _func.getType(format)
      if (formatType == 'object') {
        this.format = format
      } else if (formatType == 'number') {
        this.format = {
          type: 'number',
          offset: this.format
        }
      } else if (formatType == 'string') {
        this.format = {
          type: 'string',
          head: this.format,
          foot: ''
        }
      } else if (formatType == 'function') {
        this.format = {
          type: 'function',
          data: this.format
        }
      }
    }
  }
  // 加载未命中数据
  _initUnhitData(unhitData) {
    if (unhitData) {
      this.unhitData = unhitData
    } else {
      let unhitOption = this.option.getData('unhit')
      let deep = unhitOption.deep
      let deepOption = unhitOption.deepOption
      let value = unhitOption.value
      if (!this.checkUndef(value)) {
        if (value === true) {
          // 可能为空
          value = this.getItemByIndex(0).value
        }
        this.unhitData = this.getItem(value, { deep, deepOption })
      }
    }
  }
  // 加载未定义数据， 默认等同于未命中数据
  _initUndefData(undefData) {
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
          if (value === true) {
            value = this.getItemByIndex(0).value
          }
          this.undefData = this.getItem(value, deepOption)
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
  // 获取未命中默认值
  getUnhitData() {
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
          if (!item.filter) {
            push = true
          } else {
            if (item.filter.indexOf(payload.filter) > -1) {
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
  getItem(value, payload = {}) {
    let res
    if (this.checkUndef(value)) {
      res = this.getUndefData()
    } else {
      let prop = payload.prop
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
      res = this.getUnhitData()
    }
    res = this.formatItemByDeep(res, payload)
    return res
  }
  // 根据index获取对象
  getItemByIndex(index, payload = {}) {
    let res = this.data.list[index]
    if (!res) {
      res = this.getUnhitData()
    }
    res = this.formatItemByDeep(res, payload)
    return res
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'DefaultData',
        describe: '检索数据',
        build: [
          {
            prop: 'initdata',
            describe: '加载数据',
            data: [
              {
                prop: 'list',
                type: 'object/array',
                required: true,
                describe: '列表数据',
                data: [
                  {
                    prop: '...array',
                    type: 'object',
                    describe: '检索数据对象',
                    data: [
                      {
                        prop: 'label',
                        type: 'string',
                        describe: 'LABEL'
                      },
                      {
                        prop: 'value',
                        type: 'string',
                        describe: 'VALUE'
                      }
                    ]
                  }
                ]
              },
              {
                prop: 'option',
                type: 'object',
                required: false,
                describe: '设置项，详情参照代码'
              },
              {
                prop: 'format',
                type: 'object/number/string/function',
                required: false,
                describe: '传入数据格式化函数'
              },
              {
                prop: 'unhitData',
                type: 'object',
                required: false,
                describe: '未命中数据'
              },
              {
                prop: 'undefData',
                type: 'object',
                required: false,
                describe: '未定义数据'
              }
            ]
          }
        ],
        data: [
          {
            prop: 'data',
            extend: true,
            data: [
              {
                prop: 'list',
                type: 'array',
                describe: '检索列表数据',
                data: [
                  {
                    prop: 'label',
                    type: 'string',
                    describe: 'LABEL'
                  },
                  {
                    prop: 'value',
                    type: 'string',
                    describe: 'VALUE'
                  },
                  {
                    prop: '...',
                    type: 'string',
                    describe: '...'
                  }
                ]
              }
            ]
          },
          {
            prop: 'option',
            type: 'object',
            class: 'OptionData',
            describe: '设置项'
          },
          {
            prop: 'format',
            type: 'object',
            describe: '传入数据格式化函数',
            data: [
              {
                prop: 'type',
                type: 'boolean/string',
                describe: 'false不格式化，number直接附加offset做偏移，string通过head/foot拼接，function直接格式化'
              },
              {
                prop: 'offset',
                type: 'number',
                describe: 'number状态下的偏移'
              },
              {
                prop: 'head',
                type: 'string',
                describe: 'string状态下的拼接开始'
              },
              {
                prop: 'foot',
                type: 'string',
                describe: 'string状态下的拼接结束'
              },
              {
                prop: 'data',
                type: 'function',
                describe: 'function状态下的函数，返回string'
              }
            ]
          },
          {
            prop: 'unhitData',
            type: 'object',
            describe: '未命中数据'
          },
          {
            prop: 'undefData',
            type: 'object',
            describe: '未定义数据'
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

SelectList.initInstrcution()

export default SelectList
