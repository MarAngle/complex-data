import config from '../../config'
import { formatInitOption } from '../utils'
import Data from './../data/Data'
import StatusItem, { StatusItemInitOption, valueType } from './StatusItem'

type StatusDataInitOptionItem = {
  prop: string,
  data: StatusItemInitOption
}

export type StatusDataInitOption = {
  list?: StatusDataInitOptionItem[]
}

class StatusData extends Data {
  static $name = 'StatusData'
  data: {
    [prop: string]: StatusItem
  }
  constructor(initOption?: StatusDataInitOption) {
    initOption = formatInitOption(initOption)
    super()
    this.data = {}
    const dataList = (config.StatusData.list as StatusDataInitOptionItem[]).concat(initOption!.list || [])
    dataList.forEach(item => {
      this.data[item.prop] = new StatusItem(item.data, this)
    })
  }
  addData(target: string, data: StatusItemInitOption, replace?: boolean) {
    if (!this.data[target] || replace) {
      // 当不存在对应数据或者需要置换时进行添加操作
      this.data[target] = new StatusItem(data)
    }
    this.$syncData(true, 'addData')
  }
  deleteData(target: string, reset?: boolean) {
    if (this.data[target]) {
      if (reset !== false) {
        this.data[target].reset()
      }
      delete this.data[target]
      this.$syncData(true, 'deleteData')
    }
  }
  getItem(target = 'operate') {
    return this.data[target]
  }
  getCurrent(target = 'operate') {
    return this.data[target].getCurrent()
  }
  setData(data: valueType, target = 'operate', act?: 'reset') {
    this.data[target].setData(data, act)
  }
  getData(target = 'operate', ...args: Parameters<StatusItem['getData']>) {
    return this.data[target].getData(...args)
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
