import config from '../../config'
import { formatInitOption } from '../utils'
import Data from './../data/Data'
import StatusDataItem, { StatusDataItemInitOption, itemType, valueType } from './StatusDataItem'

type StatusDataInitOptionItem = {
  prop: string,
  data: StatusDataItemInitOption
}

export type StatusDataInitOption = {
  list?: StatusDataInitOptionItem[]
}

class StatusData extends Data {
  data: {
    [prop: string]: StatusDataItem
  }
  constructor (initOption?: StatusDataInitOption) {
    initOption = formatInitOption(initOption)
    super()
    this.data = {}
    this.$initList(initOption!.list)
  }
  $initList (list: StatusDataInitOptionItem[] = []) {
    const defaultlist = (config.StatusData.list as StatusDataInitOptionItem[])
    const mainlist = defaultlist.concat(list)
    for (const n in mainlist) {
      const item = mainlist[n]
      this.data[item.prop] = new StatusDataItem(item.data)
    }
  }
  /**
   * 获取指定status的prop属性
   * @param {string} target 指定status
   * @param {string} [prop] 获取整个或者属性值
   * @returns {*}
   */
  getData(target: string): itemType
  getData(target: string, prop: valueType): valueType
  getData (target: string, prop?: valueType) {
    if (prop) {
      return this.data[target].getData(prop)
    } else {
      return this.data[target].getData()
    }
  }
  /**
   * 设置指定status的值
   * @param {string} target 指定status
   * @param {string} data 指定的属性值
   * @param {'init' | 'reset'} [act] 操作判断值
   */
  setData (target: string, data: valueType, act?: 'init' | 'reset') {
    this.data[target].setData(data, act)
  }
  /**
   * 重置
   */
  reset () {
    for (const n in this.data) {
      this.data[n].reset()
    }
  }
}

StatusData.$name = 'StatusData'

export default StatusData
