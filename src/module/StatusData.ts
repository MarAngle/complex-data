import Data from '../data/Data'

export enum StatusValue {
  un = 'un',
  ing = 'ing',
  success = 'success',
  fail = 'fail'
}

export type StatusDataValueType = StatusValue.un | StatusValue.ing | StatusValue.success | StatusValue.fail
export type StatusDataLoadValueType = StatusValue.un | StatusValue.ing | StatusValue.success | StatusValue.fail
export type StatusDataOperateValueType = StatusValue.un | StatusValue.ing

interface triggerDataType {
  from: StatusDataValueType[]
  to: StatusDataValueType
}

export interface StatusTriggerType {
  start: triggerDataType
  success: triggerDataType
  fail: triggerDataType
}

export type StatusDataTriggerCallBackType = (target: keyof StatusTriggerType, ...args: unknown[]) => void

export type StatusItemInitOptionObject = {
  list: StatusDataValueType[]
  trigger: StatusTriggerType
  current?: StatusDataValueType
  default?: StatusDataValueType
  type?: 'count'
}

export type StatusItemInitOption = 'load' | 'operate' | StatusItemInitOptionObject

export class StatusItem extends Data {
  static $name = 'StatusItem'
  static $formatConfig = { name: 'StatusItem', level: 50, recommend: true }
  static $data = {
    load: {
      trigger: {
        start: {
          from: [StatusValue.un, StatusValue.fail],
          to: StatusValue.ing
        },
        success: {
          from: [StatusValue.ing],
          to: StatusValue.success
        },
        fail: {
          from: [StatusValue.ing],
          to: StatusValue.fail
        }
      },
      list: [StatusValue.un, StatusValue.ing, StatusValue.success, StatusValue.fail]
    } as StatusItemInitOptionObject,
    operate: {
      trigger: {
        start: {
          from: [StatusValue.un],
          to: StatusValue.ing
        },
        success: {
          from: [StatusValue.ing],
          to: StatusValue.un
        },
        fail: {
          from: [StatusValue.ing],
          to: StatusValue.un
        }
      },
      list: [StatusValue.un, StatusValue.ing],
      option: {
        type: 'count'
      }
    } as StatusItemInitOptionObject
  }
  count?: number
  list: StatusDataValueType[]
  trigger: StatusTriggerType
  current: StatusDataValueType
  default: StatusDataValueType
  constructor (initOption: StatusItemInitOption) {
    super()
    if (initOption === 'load') {
      initOption = StatusItem.$data.load
    } else if (initOption === 'operate') {
      initOption = StatusItem.$data.operate
    }
    if (!initOption.list || initOption.list.length === 0) {
      this.$exportMsg('未设置初始化列表！')
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
  setCurrent (value: StatusDataValueType, act?: 'reset') {
    if (this.list.indexOf(value) > -1) {
      let build = true
      if (!act) {
        build = this._triggerTarget(value)
      } else if (act === 'reset') {
        this._resetTarget()
      }
      if (build && this.current !== value) {
        this.current = value
        this.$syncData(true, 'setCurrent')
      }
    } else {
      this.$exportMsg(`当前加载判断值${value}不存在`)
    }
  }
  getValueLife(value?: StatusDataValueType) {
    if (!value) {
      value = this.current
    }
    let life: keyof StatusTriggerType
    for (life in this.trigger) {
      const triggerDict = this.trigger[life]
      if (triggerDict.to === value) {
        return life
      }
    }
  }
  triggerChange(target: keyof StatusTriggerType, strict?: boolean, triggerCallBack?: StatusDataTriggerCallBackType, args: unknown[] = []) {
    const current = this.getCurrent()
    const triggerDict = this.trigger[target]
    if (strict) {
      // 当前状态不在目标周期的来源时，严格校验失败打断
      if (triggerDict.from.indexOf(current) === -1) {
        return false
      }
    }
    this.setCurrent(triggerDict.to)
    if (triggerCallBack) {
      triggerCallBack(target, ...args)
    }
    return true
  }
  /**
   * 重置计算值
   */
  protected _resetTarget () {
    if (this.count !== undefined) {
      this.count = 0
      this.$syncData(true, '_resetTarget')
    }
  }
  /**
   * 判断是否需要计算以及下一步操作
   * @param {string} prop 属性值
   * @returns {boolean}
   */
  protected _triggerTarget (value: StatusDataValueType) {
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
  getCurrent (): StatusDataValueType {
    return this.current
  }
  /**
   * 重置
   */
  reset () {
    this.setCurrent(this.default, 'reset')
  }
}

export type StatusDataInitOption = {
  data?: Record<string, StatusItemInitOption>
}

class StatusData extends Data {
  static $name = 'StatusData'
  static $formatConfig = { name: 'StatusData', level: 50, recommend: true }
  data: {
    [prop: string]: StatusItem
  }
  constructor(initOption?: StatusDataInitOption) {
    super()
    this.data = {
      load: new StatusItem('load'),
      operate: new StatusItem('operate'),
      update: new StatusItem('load')
    }
    if (initOption && initOption.data) {
      for (const prop in initOption!.data) {
        this.data[prop] = new StatusItem(initOption!.data[prop])
      }
    }
  }
  addData(target: string, data: StatusItemInitOption, replace?: boolean) {
    if (!this.data[target] || replace) {
      // 当不存在对应数据或者需要置换时进行添加操作
      this.data[target] = new StatusItem(data)
    }
    this.$syncData(true, 'addData')
  }
  removeData(target: string, reset?: boolean) {
    if (this.data[target]) {
      if (reset !== false) {
        this.data[target].reset()
      }
      delete this.data[target]
      this.$syncData(true, 'removeData')
    }
  }
  getValue(target = 'operate') {
    return this.data[target]
  }
  getCurrent(target: 'load' | 'update'): StatusDataLoadValueType
  getCurrent(target: 'operate'): StatusDataOperateValueType
  getCurrent(target?: string): StatusDataValueType
  getCurrent(target = 'operate') {
    return this.data[target].getCurrent()
  }
  setData(data: StatusDataValueType, target = 'operate', act?: 'reset') {
    this.data[target].setCurrent(data, act)
  }
  /**
   * 重置
   */
  $reset() {
    for (const n in this.data) {
      this.data[n].reset()
    }
  }
  reset(option?: boolean) {
    if (option !== false) {
      this.$reset()
    }
  }
  destroy(option?: boolean) {
    if (option !== false) {
      this.reset(option)
    }
  }
}

export default StatusData
