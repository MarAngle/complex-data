import Data from "../data/Data"
import config from '../../config'

export type valueType = 'un' | 'ing' | 'success' | 'fail' | 'end'
export type loadValueType = 'un' | 'ing' | 'success' | 'fail'
export type operateValueType = 'un' | 'ing'
export type endValueType = 'un' | 'ing' | 'end'

interface triggerTypeData {
  from: valueType[],
  to: valueType
}

export interface triggerType {
  start: triggerTypeData,
  success: triggerTypeData,
  fail: triggerTypeData,
}

export type triggerCallBackType = (target: keyof triggerType, ...args: any[]) => void

export type StatusItemInitOptionObject = {
  list: valueType[],
  trigger: triggerType
  current?: valueType,
  default?: valueType,
  type?: 'count'
}

export type StatusItemInitOption = 'load' | 'operate' | 'end' | StatusItemInitOptionObject

class StatusItem extends Data {
  static $name = 'StatusItem'
  count?: number
  list: valueType[]
  trigger: triggerType
  current: valueType
  default: valueType
  constructor (initOption: StatusItemInitOption) {
    super()
    if (initOption === 'load') {
      initOption = config.StatusItem.data.load as StatusItemInitOptionObject
    } else if (initOption === 'operate') {
      initOption = config.StatusItem.data.operate as StatusItemInitOptionObject
    } else if (initOption === 'end') {
      initOption = config.StatusItem.data.end as StatusItemInitOptionObject
    }
    if (!initOption.list || initOption.list.length == 0) {
      console.error(`StatusItem未设置初始化列表`)
    }
    if (initOption.type === 'count') {
      this.count = 0
    }
    this.trigger = initOption.trigger
    this.list = initOption.list
    const current = initOption.current || initOption.list[0]
    this.current = current
    this.default = initOption.default || current // value值
  }
  /**
   * 设置当前值
   * @param {string} value 指定的属性值
   * @param {'reset'} [act] 操作判断值
   */
  setData (value: valueType, act?: 'reset') {
    if (this.list.indexOf(value) > -1) {
      let build = true
      if (!act) {
        build = this.$triggerTarget(value)
      } else if (act === 'reset') {
        this.$resetTarget()
      }
      if (build && this.current !== value) {
        this.current = value
        this.$syncData(true, 'setData')
      }
    } else {
      this.$exportMsg(`当前加载判断值${value}不存在`)
    }
  }
  getDataLife(value?: valueType) {
    if (!value) {
      value = this.current
    }
    let life: keyof triggerType
    for (life in this.trigger) {
      const triggerDict = this.trigger[life]
      if (triggerDict.to === value) {
        return life
      }
    }
  }
  triggerChange(target: keyof triggerType, strict?: boolean, triggerCallBack?: triggerCallBackType, args: any[] = []) {
    const current = this.getCurrent()
    const triggerDict = this.trigger[target]
    if (strict) {
      // 当前状态不在目标周期的来源时，严格校验失败打断
      if (triggerDict.from.indexOf(current) === -1) {
        return false
      }
    }
    this.setData(triggerDict.to)
    if (triggerCallBack) {
      triggerCallBack(target, ...args)
    }
    return true
  }
  /**
   * 重置计算值
   */
  $resetTarget () {
    if (this.count !== undefined) {
      this.count = 0
      this.$syncData(true, '$resetTarget')
    }
  }
  /**
   * 判断是否需要计算以及下一步操作
   * @param {string} prop 属性值
   * @returns {boolean}
   */
  $triggerTarget (value: valueType) {
    let fg = true
    if (this.count !== undefined) {
      if (value === 'ing') {
        this.count++
      } else {
        this.count--
        if (this.count !== 0) {
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
