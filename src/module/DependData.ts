import Data from "../data/Data"
import BaseData, { BaseDataBindOption, BaseDataBindType, loadFunctionType } from "../data/BaseData"


// Base reset/destroy

export type nextTypeFunction<D> = (status: 'success' | 'fail', target: D, res: unknown) => unknown

export type nextType<D> = nextTypeFunction<D> | {
  data: nextTypeFunction<D>
  once?: boolean | 'success' | 'fail'
}

export interface dependBindOption extends BaseDataBindOption {
  data: BaseDataBindType
}

export interface dependValueInitTypeObject<D extends BaseData = BaseData> {
  data: D
  name?: keyof D
  args?: unknown[]
  next?: nextType<D>
  bind?: BaseDataBindType | dependBindOption
}

export type dependValueInitType<D extends BaseData = BaseData> = D | dependValueInitTypeObject<D>

export interface dependValueType<D extends BaseData = BaseData> {
  data: D
  name: keyof D
  args: unknown[]
  next?: {
    data: nextTypeFunction<D>
    once?: boolean | 'success' | 'fail'
  }
}

export interface DependDataInitOption {
  type?: 'sync' | 'order',
  data?: dependValueInitType[]
}

class DependData extends Data {
  static $name = 'DependData'
  type: 'sync' | 'order'
  $data: dependValueType[]
  constructor(initOption: DependDataInitOption, self: BaseData) {
    super()
    this.type = initOption.type || 'sync'
    this.$data = initOption.data ? initOption.data.map(item => this._build(item, self)) : []
  }
  protected _build(item: dependValueInitType, self: BaseData): dependValueType {
    if (item instanceof BaseData) {
      return {
        data: item,
        name: '$loadData',
        args: [false]
      }
    } else {
      if (!item.name) {
        item.name = '$loadData'
      }
      if (!item.args) {
        item.args = [false]
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
          self.$bindLife(item.data, item.bind, {})
        } else {
          self.$bindLife(item.data, item.bind.data, item.bind)
        }
      }
      return item as dependValueType
    }
  }
  protected _loadItem(item: dependValueType) {
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
  protected _loadSyncData() {
    const list: Promise<unknown>[] = []
    this.$data.forEach(item => {
      list.push(this._loadItem(item))
    })
    return Promise.allSettled(list)
  }
  protected _loadOrderData() {
    return new Promise((resolve) => {
      let index = -1
      const resList: unknown[] = []
      const next = () => {
        index++
        if (index < this.$data.length) {
          this._loadItem(this.$data[index]).then(res => {
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
    if (this.type === 'sync') {
      return this._loadSyncData()
    } else {
      return this._loadOrderData()
    }
  }
  $destroy(option?: boolean) {
    if (option === true) {
      // 此处后续考虑数据的解绑操作
    }
  }
}

export default DependData
