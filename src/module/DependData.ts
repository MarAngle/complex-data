import { upperCaseFirstChar } from "complex-utils"
import { DataWithLife } from "complex-utils/src/class/Life"
import BaseData, { loadFunctionType } from "../data/BaseData"
import Data from "../data/Data"
import { DataWithLoad, DataWithSimpleLoad, StatusValue } from "./StatusData"

export type bindLife = 'load' | 'update'

export type dependUnbind = (lifeName?: string[]) => void

export type dependDataType = Data & (DataWithLoad | DataWithSimpleLoad) & DataWithLife

export type dependBind = (depend: dependDataType, target: BaseData, success: boolean, life: bindLife, unbind: dependUnbind) => void

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
  constructor(initOption: DependValueInitOption<D>, target: BaseData) {
    if (initOption instanceof Data) {
      this.data = initOption
      this.name = 'loadData'
      this.args = [false]
    } else {
      this.data = initOption.data
      this.name = initOption.name || 'loadData'
      this.args = initOption.args || [false]
      if (initOption.bind) {
        DependData.$bindDepend(target, initOption.data, initOption.bind.data, initOption.bind)
      }
    }
  }
  loadData() {
    return (this.data[this.name] as loadFunctionType)(...this.args)
  }
}

export interface DependDataInitOption {
  created?: boolean // 创建时自动加载依赖
  order?: boolean
  list?: DependValueInitOption[]
}

class DependData {
  static $name = 'DependData'
  static $formatConfig = { name: 'DependData', level: 10, recommend: false }
  static $created = true
  // 基于激活状态绑定依赖
  static $bindDependByActive(target: BaseData, depend: dependDataType, bind: dependBind, from: string, success: boolean, life: bindLife, unbind: () => void, active?: boolean) {
    let sync = true
    if (active && !target.isActive()) {
      // 需要判断激活状态且当前状态为未激活时不同步触发
      sync = false
    }
    if (sync) {
      bind(depend, target, success, life, unbind)
    } else {
      // 设置主数据被激活时触发bind函数
      // 设置相同id,使用replace模式，需要注意的是当函数变化后开始的函数可能还未被触发
      target.onLife('actived', {
        id: depend._getId('BindLife' + upperCaseFirstChar(from)),
        replace: true,
        handler: (lifeValue) => {
          bind(depend, target, success, life, unbind)
          lifeValue.destroy()
        }
      })
    }
  }
  // 根据生命周期将依赖通过bind函数绑定到target上
  static $bindDependByLife(target: BaseData, depend: dependDataType, bind: dependBind, life: bindLife, lifeDict: Record<string, string> = {}, {
    active, // 是否只在激活状态下触发
  }: dependBindOption = {}) {
    const simple = '$load' in depend
    if (simple && life === 'update') {
      return
    }
    if (active == undefined && target.$active.auto) {
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
        this.$bindDependByActive(target, depend, bind, successLifeName, true, life, unbind, active)
      }
    })!
    lifeDict[failLifeName] = depend.onLife(failLifeName, {
      handler: () => {
        this.$bindDependByActive(target, depend, bind, failLifeName, false, life, unbind, active)
      }
    })!
    if (currentStatus === StatusValue.success) {
      this.$bindDependByActive(target, depend, bind, successLifeName, true, life, unbind, active)
    } else if (currentStatus === StatusValue.fail) {
      this.$bindDependByActive(target, depend, bind, failLifeName, false, life, unbind, active)
    }
  }
  static $bindDepend(target: BaseData, depend: dependDataType, bind: dependBind, option: dependBindOption = {}) {
    const lifeDict: Record<string, string> = {}
    this.$bindDependByLife(target, depend, bind, 'load', lifeDict, option)
    this.$bindDependByLife(target, depend, bind, 'update', lifeDict, option)
  }
  order?: boolean
  list: DependValue[]
  $init: boolean
  $promise?: Promise<unknown>
  constructor(initOption: DependDataInitOption, target: BaseData) {
    if (initOption.order) {
      this.order = initOption.order
    }
    this.list = initOption.list ? initOption.list.map(valueInitOption => this._build(valueInitOption, target)) : []
    this.$init = false
  }
  protected _build(valueInitOption: DependValueInitOption, target: BaseData): DependValue {
    return new DependValue(valueInitOption, target)
  }
  $loadDepend() {
    if (!this.order) {
      return Promise.allSettled(this.list.map(item => {
        return item.loadData()
      }))
    } else {
      return new Promise((resolve) => {
        let index = -1
        const resList: unknown[] = []
        const next = () => {
          index++
          if (index < this.list.length) {
            this.list[index].loadData().then(res => {
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
  }
  loadDepend() {
    // 存在promise则说明在加载中，直接返回即可
    if (this.$promise) {
      return this.$promise
    } else {
      this.$promise = this.$loadDepend()
      this.$promise.finally(() => {
        // 设置为已加载
        this.$init = true
        this.$promise = undefined
      })
      return this.$promise
    }
  }
  destroy(option?: boolean) {
    if (option === true) {
      // 此处后续考虑数据的解绑操作
    }
  }
}

export default DependData
