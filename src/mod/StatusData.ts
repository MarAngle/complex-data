import config from '../../config'
import utils from '../utils'
import Data from './../data/Data'
import StatusDataItem, { StatusDataItemInitOption, itemType } from './StatusDataItem'

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
    initOption = utils.formatInitOption(initOption)
    super()
    this.data = {}
    this.$initList(initOption.list)
  }
  $initList (list: StatusDataInitOptionItem[] = []) {
    let defaultlist = (config.StatusData.list as StatusDataInitOptionItem[])
    let mainlist = defaultlist.concat(list)
    for (let n in mainlist) {
      let item = mainlist[n]
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
  getData(target: string, prop: string): PropertyKey
  getData (target: string, prop?: string): itemType | PropertyKey {
    return this.data[target].getData(prop)
  }
  /**
   * 设置指定status的值
   * @param {string} target 指定status
   * @param {string} data 指定的属性值
   * @param {'init' | 'reset'} [act] 操作判断值
   */
  setData (target: string, data: PropertyKey, act?: 'init' | 'reset') {
    this.data[target].setData(data, act)
  }
  /**
   * 重置
   */
  reset () {
    for (let n in this.data) {
      this.data[n].reset()
    }
  }
}

StatusData.$name = 'StatusData'

export default StatusData
