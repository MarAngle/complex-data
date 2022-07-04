import utils from '../utils'
import Data from './../data/Data'


export interface itemType {
  value: PropertyKey,
  label: PropertyKey
}

type defaultOption = {
  type: 'default'
}

type countOption = {
  type: 'count',
  data: {
    prop: string,
    num: number
  }
}

type countOptionOption = {
  type: 'count',
  prop: string
}

type StatusDataItemInitOptionOption = {
  type?: 'default'
} | countOptionOption

export type StatusDataItemInitOption = {
  list: itemType[],
  current?: PropertyKey,
  default?: PropertyKey,
  option?: StatusDataItemInitOptionOption
}

class StatusDataItem extends Data {
  option: defaultOption | countOption
  list: {
    [prop: PropertyKey]: itemType
  }
  current: itemType
  default: PropertyKey
  constructor (initOption: StatusDataItemInitOption) {
    initOption = utils.formatInitOption(initOption, null, 'StatusDataItem未设置初始化数据')
    if (!initOption.list || initOption.list.length == 0) {
      console.error(`StatusDataItem未设置初始化列表`)
    }
    super()
    this.option = {
      type: 'default'
    }
    this.list = {}
    this.current = {
      value: '',
      label: ''
    }
    this.$initList(initOption.list)
    let current = initOption.current || initOption.list[0].value
    this.setData(current, 'init')
    this.default = initOption.default || current // value值
    this.$initOption(initOption.option)
  }
  $initList (list: itemType[]) {
    for (let n in list) {
      this.list[list[n].value] = list[n]
    }
  }
  $initOption (option: StatusDataItemInitOptionOption = {}) {
    this.option.type = option.type || 'default'
    if (option.type == 'count') {
      if (option.prop) {
        (this.option as countOption).data = {
          prop: option.prop,
          num: 0
        }
      } else {
        this.$exportMsg(`StatusDataItem设置target类型需要传递taget目标值!`)
      }
    }
  }
  /**
   * 设置当前值
   * @param {string} prop 指定的属性值
   * @param {'init' | 'reset'} [act] 操作判断值
   */
  setData (prop: PropertyKey, act?: 'init' | 'reset') {
    if (this.list[prop]) {
      let build = true
      if (!act) {
        build = this.$triggerTarget(prop)
      } else if (act == 'init') {
        //
      } else if (act == 'reset') {
        this.$resetTarget()
      }
      if (build && this.current.value != this.list[prop].value) {
        this.current.value = this.list[prop].value
        this.current.label = this.list[prop].label
      }
    } else {
      console.error(`当前加载判断值${prop}不存在`)
    }
  }
  /**
   * 重置计算值
   */
  $resetTarget () {
    if (this.option.type == 'count') {
      this.option.data.num = 0
    }
  }
  /**
   * 判断是否需要计算以及下一步操作
   * @param {string} prop 属性值
   * @returns {boolean}
   */
  $triggerTarget (prop: PropertyKey) {
    let fg = true
    if (this.option.type == 'count') {
      if (this.option.data.prop == prop) {
        this.option.data.num++
      } else {
        this.option.data.num--
        if (this.option.data.num != 0) {
          fg = false
        }
      }
    }
    return fg
  }
  /**
   * 获取值
   * @param {string} [prop] 整个或者属性值
   * @returns {*}
   */
  getData(): itemType
  getData(prop: string): PropertyKey
  getData (prop?: string) {
    if (prop) {
      return this.current[prop]
    } else {
      return this.current
    }
  }
  /**
   * 重置
   */
  reset () {
    this.setData(this.default, 'reset')
  }
}

StatusDataItem.$name = 'StatusDataItem'

export default StatusDataItem
