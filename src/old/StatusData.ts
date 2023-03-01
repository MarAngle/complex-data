import config from '../../config'
import BaseData from '../data/BaseData'
import { formatInitOption } from '../utils'
import Data from './../data/Data'
import StatusItem, { StatusItemInitOption, itemType, valueType } from './StatusItem'

type StatusDataInitOptionItem = {
  prop: string,
  data: StatusItemInitOption
}

export type StatusDataInitOption = {
  list?: StatusDataInitOptionItem[]
}

class StatusData extends Data {
  data: {
    [prop: string]: StatusItem
  }
  static $name = 'StatusData'
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
      this.data[item.prop] = new StatusItem(item.data)
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
  /**
   * 模块加载
   * @param {object} target 加载到的目标
   */
  $install (target: BaseData) {
    target.$onLife('beforeReset', {
      id: this.$getId('BeforeReset'),
      data: (instantiater, resetOption) => {
        if (target.$parseResetOption(resetOption, 'status') !== false) {
          this.reset()
        }
      }
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
  $uninstall(target: BaseData) {
    target.$offLife('beforeReset', this.$getId('BeforeReset'))
  }
}

export default StatusData
