import Data from "../data/Data"

export type valueType = string

export interface itemType {
  value: valueType,
  label: valueType,
  [prop: string]: valueType
}

type defaultOption = {
  type: 'default'
}

type countOption = {
  type: 'count',
  prop: string,
  num: number
}

type countOptionOption = {
  type: 'count',
  prop: string
}

type StatusItemInitOptionOption = Partial<defaultOption> | countOptionOption

export type StatusItemInitOption = {
  list: itemType[],
  current?: valueType,
  default?: valueType,
  option?: StatusItemInitOptionOption
}
class StatusItem extends Data {
  static $name = 'StatusItem'
  option: defaultOption | countOption
  list: {
    [prop: string]: itemType
  }
  current: itemType
  default: string
  constructor (initOption: StatusItemInitOption) {
    if (!initOption.list || initOption.list.length == 0) {
      console.error(`StatusItem未设置初始化列表`)
    }
    super()
    if (!initOption.option) {
      initOption.option = {}
    }
    if (initOption.option.type == 'count') {
      this.option = {
        type: initOption.option.type,
        prop: initOption.option.prop,
        num: 0
      }
      if (!this.option.prop) {
        this.$exportMsg(`StatusItem设置count类型需要传递taget目标值!`)
      }
    } else {
      this.option = {
        type: 'default'
      }
    }
    this.list = {}
    this.current = {
      value: '',
      label: ''
    }
    for (const n in initOption.list) {
      this.list[initOption.list[n].value] = initOption.list[n]
    }
    const current = initOption.current || initOption.list[0].value
    this.setData(current, 'init')
    this.default = initOption.default || current // value值
  }
  /**
   * 设置当前值
   * @param {string} prop 指定的属性值
   * @param {'init' | 'reset'} [act] 操作判断值
   */
  setData (prop: string, act?: 'init' | 'reset') {
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
      this.$exportMsg(`当前加载判断值${prop}不存在`)
    }
  }
  /**
   * 重置计算值
   */
  $resetTarget () {
    if (this.option.type == 'count') {
      this.option.num = 0
    }
  }
  /**
   * 判断是否需要计算以及下一步操作
   * @param {string} prop 属性值
   * @returns {boolean}
   */
  $triggerTarget (prop: string) {
    let fg = true
    if (this.option.type == 'count') {
      if (this.option.prop == prop) {
        this.option.num++
      } else {
        this.option.num--
        if (this.option.num != 0) {
          fg = false
        }
      }
    }
    return fg
  }
  getCurrentProp(prop: valueType): valueType {
    return this.current[prop]
  }

  /**
   * 获取值
   * @param {string} [prop] 整个或者属性值
   * @returns {*}
   */
  getCurrent (): itemType {
    return this.current
  }
  /**
   * 重置
   */
  reset () {
    this.setData(this.default, 'reset')
  }
}

export default StatusItem
