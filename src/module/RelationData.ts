import { upperCaseFirstChar } from "complex-utils"
import BaseData, { loadFunctionType } from "../data/BaseData"

export type bindLifeType = 'load' | 'update'

export type unbindType = (life?: string[]) => void

export type bindType = (depend: BaseData, self: BaseData, success: boolean, life: bindLifeType, unbind: unbindType) => void

export interface bindOption {
  life?: bindLifeType
  active?: boolean
}

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
  static $bindDependByActive(self: BaseData, depend: BaseData, bind: bindType, from: string, success: boolean, life: bindLifeType, unbind: () => void, active?: boolean) {
    let sync = true
    if (active && !self.$isActive()) {
      // 需要判断激活状态且当前状态为未激活时不同步触发
      sync = false
    }
    if (sync) {
      bind(depend, self, success, life, unbind)
    } else {
      // 设置主数据被激活时触发bind函数
      // 设置相同id,使用replace模式，需要注意的是当函数变化后开始的函数可能还未被触发
      self.$onLife('actived', {
        id: depend.$getId('BindLife' + upperCaseFirstChar(from)),
        once: true,
        replace: true,
        data: () => {
          bind(depend, self, success, life, unbind)
        }
      })
    }
  }
  static $bindDependByLife(self: BaseData, depend: BaseData, bind: bindType, life: bindLifeType, lifeDict: Record<string, PropertyKey> = {}, {
    active, // 是否只在激活状态下触发
  }: bindOption = {}) {
    if (active === undefined && self.$active.auto) {
      // 自动激活模式下，默认进行激活的判断
      active = true
    }
    const failLifeName = life === 'load' ? 'loadFail' : 'updateFail'
    const successLifeName = life === 'load' ? 'loaded' : 'updated'
    const currentStatus = depend.$getStatus(life)
    const unbind: unbindType = function(lifeList?: string[]) {
      for (const lifeName in lifeDict) {
        if (lifeList === undefined || lifeList.indexOf(lifeName) > -1) {
          depend.$offLife(lifeName, lifeDict[lifeName])
        }
      }
    }
    lifeDict[successLifeName] = depend.$onLife(successLifeName, {
      data: () => {
        this.$bindDependByActive(self, depend, bind, successLifeName, true, life, unbind, active)
      }
    }) as PropertyKey
    lifeDict[failLifeName] = depend.$onLife(failLifeName, {
      data: () => {
        this.$bindDependByActive(self, depend, bind, failLifeName, false, life, unbind, active)
      }
    }) as PropertyKey
    if (currentStatus === 'success') {
      this.$bindDependByActive(self, depend, bind, successLifeName, true, life, unbind, active)
    } else if (currentStatus === 'fail') {
      this.$bindDependByActive(self, depend, bind, failLifeName, false, life, unbind, active)
    }
  }
  static $bindDepend(self: BaseData, depend: BaseData, bind: bindType, option: bindOption = {}) {
    const lifeDict: Record<string, PropertyKey> = {}
    this.$bindDependByLife(self, depend, bind, 'load', lifeDict, option)
    this.$bindDependByLife(self, depend, bind, 'update', lifeDict, option)
  }
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
        RelationData.$bindDepend(self, item.data, item.bind.data, item.bind)
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
