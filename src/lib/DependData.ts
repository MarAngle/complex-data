
import BaseData, { BaseDataBindOption, BaseDataBindType, loadFunctionType } from "../data/BaseData"
import Data from "../data/Data"

export type nextTypeFunction<D> = (status: 'success' | 'fail', target: D, res: unknown) => unknown
export type nextType<D> = nextTypeFunction<D> | {
  data: nextTypeFunction<D>
  once?: boolean | 'success' | 'fail'
}

export interface dependBindOption extends BaseDataBindOption {
  data: BaseDataBindType
}

export interface dependItemObject<D extends BaseData = BaseData> {
  data: D,
  name?: keyof D,
  args?: unknown[],
  next?: nextType<D>,
  bind?: BaseDataBindType | dependBindOption
}
export type dependItem<D extends BaseData = BaseData> = D | dependItemObject<D>
export interface requiredDependItemObject<D extends BaseData = BaseData> {
  data: D,
  name: keyof D,
  args: unknown[],
  next?: {
    data: nextTypeFunction<D>
    once?: boolean | 'success' | 'fail'
  }
}

export interface DependDataInitOption {
  type?: 'together' | 'order',
  data: dependItem[]
}

class DependData extends Data {
  static $name = 'DependData'
  type: 'together' | 'order'
  $data: requiredDependItemObject[]
  constructor(initOption: DependDataInitOption, parent: BaseData) {
    super()
    this.type = initOption.type || 'together'
    this.$data = initOption.data.map(item => this.$build(item, parent))
  }
  $build(item: dependItem, parent: BaseData): requiredDependItemObject {
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
      if (item.next) {
        if (typeof item.next === 'function') {
          item.next = {
            data: item.next,
            once: false
          }
        }
      }
      if (item.bind) {
        if (typeof item.bind === 'function') {
          parent.$bindLife(item.data, item.bind, {})
        } else {
          parent.$bindLife(item.data, item.bind.data, item.bind)
        }
      }
      return item as requiredDependItemObject
    }
  }
  $loadItem(item: requiredDependItemObject) {
    return new Promise((resolve, reject) => {
      (item.data[item.name] as loadFunctionType)(...item.args).then(res => {
        if (item.next) {
          item.next.data('success', item.data, res)
          if (item.next.once === true || item.next.once === 'success') {
            delete item.next
          }
        }
        resolve(res)
      }).catch(err => {
        if (item.next) {
          item.next.data('fail', item.data, err)
          if (item.next.once === true || item.next.once === 'fail') {
            delete item.next
          }
        }
        reject(err)
      })
    })
  }
  $loadTogetherData() {
    const list: Promise<unknown>[] = []
    this.$data.forEach(item => {
      list.push(this.$loadItem(item))
    })
    return Promise.allSettled(list)
  }
  $loadOrderData() {
    return new Promise((resolve) => {
      let index = -1
      const resList: unknown[] = []
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
    if (this.type === 'together') {
      return this.$loadTogetherData()
    } else {
      return this.$loadOrderData()
    }
  }
}

export default DependData
