import BaseData, { bindOption, bindType, loadFunctionType } from "../data/BaseData"

export type nextTypeFunction<D> = (status: 'success' | 'fail', depend: D, res: unknown) => unknown

export type nextType<D> = {
  data: nextTypeFunction<D>
  once?: boolean | 'success'
}

export interface dependBindOption extends bindOption {
  data: bindType
}

export interface dependValueInitTypeObject<D extends BaseData = BaseData> {
  data: D
  name?: keyof D
  args?: unknown[]
  bind?: dependBindOption
}

export type dependValueInitType<D extends BaseData = BaseData> = D | dependValueInitTypeObject<D>

export interface dependValueType<D extends BaseData = BaseData> {
  data: D
  name: keyof D
  args: unknown[]
}

export interface RelationDataInitOption {
  depend?: {
    type?: 'sync' | 'order'
    list?: dependValueInitType[]
  }
}

class RelationData {
  static $name = 'RelationData'
  static $formatConfig = { name: 'Data:RelationData', level: 10, recommend: false }
  depend?: {
    type: 'sync' | 'order'
    list: dependValueType[]
  }
  constructor(initOption: RelationDataInitOption, self: BaseData) {
    if (initOption.depend) {
      this.depend = {
        type: initOption.depend.type || 'sync',
        list: initOption.depend.list ? initOption.depend.list.map(item => this._build(item, self)) : []
      }
    }
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
      if (item.bind) {
        self.$bindDepend(item.data, item.bind.data, item.bind)
      }
      return item as dependValueType
    }
  }
  protected _loadItem(item: dependValueType) {
    return (item.data[item.name] as loadFunctionType)(...item.args)
  }
  protected _loadSyncDepend() {
    const list: Promise<unknown>[] = []
    this.depend!.list.forEach(item => {
      list.push(this._loadItem(item))
    })
    return Promise.allSettled(list)
  }
  protected _loadOrderDepend() {
    return new Promise((resolve) => {
      let index = -1
      const resList: unknown[] = []
      const next = () => {
        index++
        if (index < this.depend!.list.length) {
          this._loadItem(this.depend!.list[index]).then(res => {
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
  $loadDepend() {
    if (this.depend) {
      if (this.depend.type === 'sync') {
        return this._loadSyncDepend()
      } else {
        return this._loadOrderDepend()
      }
    } else {
      return Promise.resolve({ status: 'success', code: 'depend is empty' })
    }
  }
  $destroy(option?: boolean) {
    if (option === true) {
      // 此处后续考虑数据的解绑操作
    }
  }
}

export default RelationData
