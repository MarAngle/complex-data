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
  // /**
  //  * 模块加载
  //  * @param {object} target 加载到的目标
  //  */
  // $install(target: BaseData) {
  //   target.$onLife('beforeReset', {
  //     id: this.$getId('BeforeReset'),
  //     data: (instantiater, resetOption) => {
  //       if (target.$parseResetOption(resetOption, 'status') !== false) {
  //         this.reset()
  //       }
  //     }
  //   })
  // }
  // /**
  //  * 模块卸载
  //  * @param {object} target 卸载到的目标
  //  */
  // $uninstall(target: BaseData) {
  //   target.$offLife('beforeReset', this.$getId('BeforeReset'))
  // }
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
