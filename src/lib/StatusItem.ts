import Data from "../data/Data"

export type valueType = 'un' | 'wait' | 'ing' | 'end' | 'fail'

export interface itemType {
  value: valueType,
  label: string,
  [prop: string]: unknown
}

type defaultOption = {
  type: 'default'
}

type countOption = {
  type: 'count',
  num: number
}

type countOptionOption = {
  type: 'count'
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
  list: Map<valueType, itemType>
  current: valueType
  default: valueType
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
        num: 0
      }
    } else {
      this.option = {
        type: 'default'
      }
    }
    this.list = new Map()
    for (const n in initOption.list) {
      this.list.set(initOption.list[n].value, initOption.list[n])
    }
    const current = initOption.current || initOption.list[0].value
    this.current = current
    this.default = initOption.default || current // value值
  }
  /**
   * 设置当前值
   * @param {string} value 指定的属性值
   * @param {'reset'} [act] 操作判断值
   */
  setData (value: valueType, act?: 'reset') {
    const data = this.list.get(value)
    if (data) {
      let build = true
      if (!act) {
        build = this.$triggerTarget(value)
      } else if (act == 'reset') {
        this.$resetTarget()
      }
      if (build && this.current != data.value) {
        this.current = data.value
      }
    } else {
      this.$exportMsg(`当前加载判断值${value}不存在`)
    }
  }
  getData(value?: valueType) {
    if (!value) {
      value = this.current
    }
    return this.list.get(value)
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
  $triggerTarget (value: valueType) {
    let fg = true
    if (this.option.type == 'count') {
      if (value == 'ing') {
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

  /**
   * 获取值
   * @param {string} [prop] 整个或者属性值
   * @returns {*}
   */
  getCurrent (): valueType {
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
