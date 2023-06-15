import Data from './../data/Data'
import StatusItem, { StatusItemInitOption, endValueType, loadValueType, operateValueType, valueType } from './StatusItem'
import { formatInitOption } from '../utils'

export type StatusDataInitOption = {
  data?: Record<string, StatusItemInitOption>
}

class StatusData extends Data {
  static $name = 'StatusData'
  data: {
    [prop: string]: StatusItem
  }
  constructor(initOption?: StatusDataInitOption) {
    initOption = formatInitOption(initOption)
    super()
    this.data = {
      load: new StatusItem('load'),
      operate: new StatusItem('operate'),
      update: new StatusItem('load'),
    }
    if (initOption!.data) {
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
  getItem(target = 'operate') {
    return this.data[target]
  }
  getCurrent(target: 'load' | 'update'): loadValueType
  getCurrent(target: 'operate'): operateValueType
  getCurrent(target: 'end'): endValueType
  getCurrent(target?: string): valueType
  getCurrent(target = 'operate') {
    return this.data[target].getCurrent()
  }
  setData(data: valueType, target = 'operate', act?: 'reset') {
    this.data[target].setData(data, act)
  }
  /**
   * 重置
   */
  reset() {
    for (const n in this.data) {
      this.data[n].reset()
    }
  }
  $reset(option?: boolean) {
    if (option !== false) {
      this.reset()
    }
  }
  $destroy(option?: boolean) {
    if (option !== false) {
      this.$reset(option)
    }
  }
}

export default StatusData
