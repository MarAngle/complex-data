import { promiseAllFinished } from "complex-utils"
import BaseData, { promiseFunction } from "../data/BaseData"
import Data from "../data/Data"

interface dependItemObject<D extends BaseData = BaseData> {
  data: D,
  name?: keyof D,
  args?: any[],
  next?: (status: 'success' | 'fail',target: D) => any
}

interface requiredDependItemObject<D extends BaseData = BaseData> {
  data: D,
  name: keyof D,
  args: any[],
  next?: (status: 'success' | 'fail',target: D) => any
}

type dependItem<D extends BaseData = BaseData> = D | dependItemObject<D>

export interface DependDataInitOption {
  type?: 'together' | 'order',
  data: dependItem[]
}

class DependData extends Data {
  static $name = 'DependData'
  type: 'together' | 'order'
  $data: requiredDependItemObject[]
  constructor(initOption: DependDataInitOption) {
    super()
    this.type = initOption.type || 'together'
    this.$data = initOption.data.map(item => this.$build(item))
  }
  $build(item: dependItem): requiredDependItemObject {
    if (item instanceof BaseData) {
      return {
        data: item,
        name: '$loadData',
        args: [true]
      }
    } else {
      if (!item.name) {
        item.name = '$loadData'
      }
      if (!item.args) {
        item.args = [true]
      }
      return item as requiredDependItemObject
    }
  }
  $loadItem(item: requiredDependItemObject) {
    return new Promise((resolve, reject) => {
      (item.data[item.name] as promiseFunction)(...item.args).then(res => {
        if (item.next) {
          item.next('success', item.data)
        }
        resolve(res)
      }).catch(err => {
        if (item.next) {
          item.next('fail', item.data)
        }
        reject(err)
      })
    })
  }
  $loadTogetherData() {
    const list: Promise<any>[] = []
    this.$data.forEach(item => {
      list.push(this.$loadItem(item))
    })
    return promiseAllFinished(list)
  }
  $loadOrderData() {
    return new Promise((resolve) => {
      let index = -1
      const resList: any[] = []
      const next = () => {
        index++
        if (index < this.$data.length) {
          this.$loadItem(this.$data[index]).then(res => {
            resList.push(res)
            next()
          }).catch(err => {
            resList.push(err)
            next()
          })
        } else {
          resolve(resList)
        }
      }
      next()
    })
  }
  $loadData() {
    if (this.type == 'together') {
      return this.$loadTogetherData()
    } else {
      return this.$loadOrderData()
    }
  }
}

export default DependData
