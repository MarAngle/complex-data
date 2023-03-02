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
  static $name = 'StatusData'
  data: {
    [prop: string]: StatusItem
  }
  constructor (initOption?: StatusDataInitOption) {
    initOption = formatInitOption(initOption)
    super()
    this.data = {}
    const dataList = (config.StatusData.list as StatusDataInitOptionItem[]).concat(initOption!.list || [])
    dataList.forEach(item => {
      this.data[item.prop] = new StatusItem(item.data)
    })
  }
  addData(target: string, data: StatusItemInitOption, replace?: boolean) {
    if (!this.data[target] || replace) {
      // 当不存在对应数据或者需要置换时进行添加操作
      this.data[target] = new StatusItem(data)
    }
  }
  deleteData(target: string, reset?: boolean) {
    if (this.data[target]) {
      if (reset !== false) {
        this.data[target].reset()
      }
      delete this.data[target]
    }
  }
  /**
   * 获取指定status的prop属性
   * @param {string} target 指定status
   * @param {string} [prop] 获取整个或者属性值
   * @returns {*}
   */
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
