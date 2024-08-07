import { upperCaseFirstChar } from "complex-utils"
import { DataWithLife } from "complex-utils/src/class/Life"
import BaseData, { loadFunctionType } from "../data/BaseData"
import Data from "../data/Data"
import { DataWithLoad, DataWithSimpleLoad, StatusValue } from "./StatusData"

export type bindLife = 'load' | 'update'

export type dependUnbind = (lifeName?: string[]) => void

export type dependDataType = Data & (DataWithLoad | DataWithSimpleLoad) & DataWithLife

export type dependBind = (depend: dependDataType, self: BaseData, success: boolean, life: bindLife, unbind: dependUnbind) => void

export interface dependBindOption {
  life?: bindLife
  active?: boolean
}

export interface dependBindType extends dependBindOption {
  data: dependBind
}

export type DependValueInitOption<D extends dependDataType = dependDataType> = D | {
  data: D
  name?: keyof D
  args?: unknown[]
  bind?: dependBindType
}

export class DependValue<D extends dependDataType = dependDataType> {
  static $name = 'DependValue'
  static $formatConfig = { name: 'DependValue', level: 10, recommend: false }
  data: D
  name: keyof D
  args: unknown[]
  constructor(initOption: DependValueInitOption<D>, self: BaseData) {
    if (initOption instanceof Data) {
      this.data = initOption
      this.name = 'loadData'
      this.args = [false]
    } else {
      this.data = initOption.data
      this.name = initOption.name || 'loadData'
      this.args = initOption.args || [false]
      if (initOption.bind) {
        DependData.$bindDepend(self, initOption.data, initOption.bind.data, initOption.bind)
      }
    }
  }
  loadData() {
    return (this.data[this.name] as loadFunctionType)(...this.args)
  }
}

export interface DependDataInitOption {
  type?: 'sync' | 'order'
  list?: DependValueInitOption[]
}

class DependData {
  static $name = 'DependData'
  static $formatConfig = { name: 'DependData', level: 10, recommend: false }
  // 基于激活状态绑定依赖
  static $bindDependByActive(self: BaseData, depend: dependDataType, bind: dependBind, from: string, success: boolean, life: bindLife, unbind: () => void, active?: boolean) {
    let sync = true
    if (active && !self.isActive()) {
      // 需要判断激活状态且当前状态为未激活时不同步触发
      sync = false
    }
    if (sync) {
      bind(depend, self, success, life, unbind)
    } else {
      // 设置主数据被激活时触发bind函数
      // 设置相同id,使用replace模式，需要注意的是当函数变化后开始的函数可能还未被触发
      self.onLife('actived', {
        id: depend._getId('BindLife' + upperCaseFirstChar(from)),
        replace: true,
        handler: (lifeValue) => {
          bind(depend, self, success, life, unbind)
          lifeValue.destroy()
        }
      })
    }
  }
  // 根据生命周期将依赖通过bind函数绑定到self上
  static $bindDependByLife(self: BaseData, depend: dependDataType, bind: dependBind, life: bindLife, lifeDict: Record<string, string> = {}, {
    active, // 是否只在激活状态下触发
  }: dependBindOption = {}) {
    const simple = '$load' in depend
    if (simple && life === 'update') {
      return
    }
    if (active == undefined && self.$active.auto) {
      // 自动激活模式下，默认进行激活的判断
      active = true
    }
    const failLifeName = life === 'load' ? 'loadFail' : 'updateFail'
    const successLifeName = life === 'load' ? 'loaded' : 'updated'
    const currentStatus = simple ? depend.getLoad() : depend.getStatus(life)
    const unbind: dependUnbind = function(lifeList?: string[]) {
      for (const lifeName in lifeDict) {
        if (lifeList == undefined || lifeList.indexOf(lifeName) > -1) {
          depend.offLife(lifeName, lifeDict[lifeName])
        }
      }
    }
    lifeDict[successLifeName] = depend.onLife(successLifeName, {
      handler: () => {
        this.$bindDependByActive(self, depend, bind, successLifeName, true, life, unbind, active)
      }
    })!
    lifeDict[failLifeName] = depend.onLife(failLifeName, {
      handler: () => {
        this.$bindDependByActive(self, depend, bind, failLifeName, false, life, unbind, active)
      }
    })!
    if (currentStatus === StatusValue.success) {
      this.$bindDependByActive(self, depend, bind, successLifeName, true, life, unbind, active)
    } else if (currentStatus === StatusValue.fail) {
      this.$bindDependByActive(self, depend, bind, failLifeName, false, life, unbind, active)
    }
  }
  static $bindDepend(self: BaseData, depend: dependDataType, bind: dependBind, option: dependBindOption = {}) {
    const lifeDict: Record<string, string> = {}
    this.$bindDependByLife(self, depend, bind, 'load', lifeDict, option)
    this.$bindDependByLife(self, depend, bind, 'update', lifeDict, option)
  }
  data: {
    type: 'sync' | 'order'
    list: DependValue[]
  }
  constructor(initOption: DependDataInitOption, self: BaseData) {
    this.data = {
      type: initOption.type || 'sync',
      list: initOption.list ? initOption.list.map(valueInitOption => this._build(valueInitOption, self)) : []
    }
  }
  protected _build(valueInitOption: DependValueInitOption, self: BaseData): DependValue {
    return new DependValue(valueInitOption, self)
  }
  protected _loadSyncDepend() {
    return Promise.allSettled(this.data.list.map(item => {
      return item.loadData()
    }))
  }
  protected _loadOrderDepend() {
    return new Promise((resolve) => {
      let index = -1
      const resList: unknown[] = []
      const next = () => {
        index++
        if (index < this.data.list.length) {
          this.data.list[index].loadData().then(res => {
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
  loadDepend() {
    if (this.data.type === 'sync') {
      return this._loadSyncDepend()
    } else {
      return this._loadOrderDepend()
    }
  }
  destroy(option?: boolean) {
    if (option === true) {
      // 此处后续考虑数据的解绑操作
    }
  }
}

export default DependData
