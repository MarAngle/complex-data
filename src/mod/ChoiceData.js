import _func from 'complex-func'
import utils from './../utils/index'
import DefaultData from './../data/DefaultData'
import EmptyData from './EmptyData'

class ChoiceData extends DefaultData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    initOption.data = utils.formatData(initOption.data, {
      id: [],
      list: []
    })
    super(initOption)
    this.status = {
      show: false
    }
    this.resetOption = {
      load: false,
      reload: false,
      update: false,
      search: {
        set: true,
        reset: true
      },
      page: {
        page: false,
        size: false
      }
    }
    this.option = {}
    this.checkInit(initOption)
  }
  /**
   * 检查是否加载
   * @param {object} [initOption] 参数
   */
  checkInit(initOption = {}) {
    if (initOption.show) {
      this.setShow(true)
      this.initChoiceData(initOption)
    }
  }
  /**
   * 设置显示
   * @param {boolean} [data = false] 显示值
   */
  setShow(data = false) {
    this.status.show = data
  }
  /**
   * 获取是否显示
   * @returns {boolean}
   */
  getShow() {
    return this.status.show
  }
  /**
   * 设置设置项
   * @param {object} [initOption] 参数
   */
  initChoiceData(initOption = {}) {
    if (initOption.reset) {
      for (let n in initOption.reset) {
        if (typeof initOption.reset[n] == 'object') {
          if (typeof this.resetOption[n] != 'object') {
            this.resetOption[n] = {}
          }
          for (let i in initOption.reset[n]) {
            this.resetOption[n][i] = initOption.reset[n][i]
          }
        } else {
          this.resetOption[n] = initOption.reset[n]
        }
      }
    }
    if (initOption.option) {
      this.option = {
        ...initOption.option
      }
    }
  }
  /**
   * 获取UI设置项
   * @returns {object}
   */
  getOption() {
    return this.option
  }
  /**
   * 获取数据
   * @param {'id' | 'list'} [prop] 存在prop获取data[prop]，否则获取{id, list}
   * @returns {string[] | object[] | {id, list}}
   */
  getData(prop) {
    if (prop) {
      return this.data[prop]
    } else {
      return this.data
    }
  }
  /**
   * 根据id/idProp从totalList获取对应的数据并从totalList删除对应数据
   * @param {string} id id属性值
   * @param {object[]} totalList 全数据列表
   * @param {string} idProp id属性
   * @returns {object}
   */
  formatItemFromList(id, totalList, idProp = 'id') {
    for (let n = 0; n < totalList.length; n++) {
      let item = totalList[n]
      if (item && item[idProp] == id) {
        totalList.splice(n, 1)
        return item
      }
    }
    return new EmptyData('ChoiceData空选项数据')
  }
  /**
   * 数据变更=>id作为唯一基准
   * @param {string[]} idList ID列表
   * @param {object[]} currentList ITEM列表
   * @param {'auto' | 'force'} [check = 'auto'] 检查判断值,auto在长度相等时直接认为格式符合，否则进行格式化判断
   * @param {string} idProp id的属性
   */
  changeData(idList, currentList = [], check = 'auto', idProp) {
    // check 'auto'/'force'
    if (check == 'force' || idList.length != currentList.length) {
      let totalList = currentList
      for (let n = 0; n < this.data.list.length; n++) {
        let item = this.data.list[n]
        if (totalList.indexOf(item) < 0) {
          totalList.push(item)
        }
      }
      let list = []
      for (let i = 0; i < idList.length; i++) {
        let id = idList[i]
        list[i] = this.formatItemFromList(id, totalList, idProp)
      }
      this.setData(idList, list)
    } else {
      this.setData(idList, currentList)
    }
  }
  /**
   * 添加选择
   * @param {string[]} idList 要添加的ID列表
   * @param {object[]} list 要添加的ITEM列表
   * @param {string} idProp id属性
   */
  addData(idList, list = [], idProp, act = 'auto') {
    if (act == 'auto') {
      for (let i = 0; i < idList.length; i++) {
        let id = idList[i]
        if (this.data.id.indexOf(id) < 0) {
          this.data.id.push(id)
          this.data.list.push(list[i])
        }
      }
    } else {
      let currentIdList = this.data.id
      for (let i = 0; i < idList.length; i++) {
        let id = idList[i]
        if (currentIdList.indexOf(id) < 0) {
          currentIdList.push(id)
        }
      }
      this.changeData(currentIdList, list, idProp, 'force')
    }
  }
  /**
   * 设置选项列表数据
   * @param {string[]} idList ID列表
   * @param {object[]} list ITEM列表
   */
  setData(idList, list) {
    _func.clearArray(this.data.id)
    _func.clearArray(this.data.list)
    for (let n = 0; n < idList.length; n++) {
      this.data.id.push(idList[n])
    }
    for (let i = 0; i < list.length; i++) {
      this.data.list.push(list[i])
    }
  }
  /**
   * 根据option, defaultOption自动判断重置与否
   * @param {object | string} [option] 参数
   * @param {object | string} [defaultOption] 默认参数
   */
  autoReset(option, defaultOption) {
    option = this.formatResetOption(option, defaultOption)
    let force = this.checkReset(option)
    this.reset(force)
  }
  /**
   * 根据defaultOption格式化option
   * @param {object | string} [option] 参数
   * @param {object | string} [defaultOption = 'load'] 默认参数
   * @returns {object}
   */
  formatResetOption(option, defaultOption = 'load') {
    if (!option) {
      option = defaultOption
    }
    if (typeof option != 'object') {
      option = {
        from: option
      }
    }
    return option
  }
  /**
   * 检查是否进行重置
   * @param {object} [option] 重置参数
   * @param {boolean | string} [option.from] 当前操作
   * @param {string} [option.act] 当前操作分支操作
   * @returns {boolean}
   */
  checkReset(option = {}) {
    let from = option.from
    let reset
    if (from === true) {
      reset = true
    } else if (this.resetOption[from] !== undefined) {
      if (this.resetOption[from] && typeof this.resetOption[from] == 'object') {
        let act = option.act
        if (!act) {
          this.$exportMsg(`checkReset函数中对应的from:${from}未定义act,可定义:${Object.keys(this.resetOption[from])}`)
        } else if (this.resetOption[from][act] !== undefined) {
          reset = this.resetOption[from][act]
        } else {
          this.$exportMsg(`checkReset函数中对应的from:${from}中不存在act:${act},可定义:${Object.keys(this.resetOption[from])}`)
        }
      } else {
        reset = this.resetOption[from]
      }
    } else {
      this.$exportMsg(`checkReset函数未找到对应的from:${from}`)
    }
    return reset
  }
  /**
   * 重置操作
   * @param {boolean} force 重置判断值
   */
  reset(force) {
    if (force) {
      this.setData([], [])
    }
  }
  /**
   * 模块加载
   * @param {object} target 加载到的目标
   */
  install (target) {
    target.onLife('reseted', {
      id: this.$getId('Reseted'),
      data: (instantiater, resetOption) => {
        if (target.parseResetOption(resetOption, 'choice') !== false) {
          this.reset(true)
        }
      }
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
  uninstall(target) {
    target.offLife('reseted', this.$getId('Reseted'))
  }
}

ChoiceData._name = 'ChoiceData'

export default ChoiceData
