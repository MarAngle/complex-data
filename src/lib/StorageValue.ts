import { exportMsg, getRandomNum, storage } from 'complex-utils'
import { DataWithLife } from 'complex-utils/src/class/Life'
import Data from '../data/Data'

export interface StorageValueInitOption {
  prop: string
  float?: number // 定时刷新时间间隔浮动偏移量[分钟]
  offset?: number // 定时刷新时间间隔基础偏移量[分钟]
  version?: number // 版本号
  validity?: number // 有效期[天]
  num?: number // 读取次数
  stability?: number // 稳定性
}

export interface storageDataType {
  version: number // 版本号
  num: number // 读取次数
  time: number // 数据保存时间
  value: Record<string, any>
}

type controlType<D = any> = {
  init: (value?: D) => void
  save: () => D
}

export interface DataWithStorage {
  $storage?: StorageValue
  saveStorage: () => void
}

class StorageValue extends Data {
  static $name = 'StorageValue'
  static $config = {
    float: 5, // 默认浮动时间间隔5分钟
    offset: 10, // 默认基础更新时间间隔10分钟
    validity: 7, // 默认有效期7天
    num: 21, // 读取次数
    stability: 10, // 默认稳定性10，请注意在稳定性80的情况下哪怕进度为90，实际的加权进度也仅为18，因此高稳定度带来的结果是除非读取和有效期到达，否则很难触发
  }
  static $parse = function(storageValue: StorageValue, storageData: storageDataType) {
    const validityPercent = (Date.now() - storageData.time) / storageValue.validity // 有效期比率
    if (validityPercent >= 1) {
      return 100
    }
    const numPercent = storageData.num / storageValue.num // 访问次数比率
    if (numPercent >= 1) {
      return 100
    }
    const totalPercent = (validityPercent + numPercent) / 2
    const stabilityRate = 100 - storageValue.stability // 0 - 100 越大说明越不稳定
    return totalPercent * stabilityRate
  }
  prop: string
  offset: number // 时间间隔基础偏移量[毫秒]
  version: number
  validity: number // 有效期[毫秒]
  num: number // 读取次数
  stability: number // 稳定性[0 - 100]:数据变化的可能性，数据越小数据变化的可能性越大
  control: Record<string, controlType>
  timer: undefined | number // 定时器
  constructor(initOption: StorageValueInitOption, prop: string) {
    super()
    const $constructor = this.constructor as typeof StorageValue
    this.prop = prop + '-' + initOption.prop
    const float = initOption.float ?? $constructor.$config.float
    const offset = initOption.offset ?? $constructor.$config.offset
    this.offset = (offset + getRandomNum(0, float * 10) / 10) * 60 * 1000
    this.version = initOption.version || 0
    this.validity = (initOption.validity ?? $constructor.$config.validity) * 24 * 60 * 60 * 1000
    this.num = initOption.num ?? $constructor.$config.num
    this.stability = initOption.stability ?? $constructor.$config.stability
    this.control = {}
  }
  push(prop: string, data: controlType, replace?: boolean) {
    if (!this.control[prop] || replace) {
      this.control[prop] = data
    } else {
      exportMsg(`本地存储报错：模块${prop}已存在，请勿重复添加！`)
    }
  }
  collect() {
    const collectValue = {} as storageDataType['value']
    for (const prop in this.control) {
      const control = this.control[prop]
      collectValue[prop] = control.save()
    }
    return collectValue
  }
  save() {
    const storageData = {
      version: this.version,
      time: Date.now(),
      num: 0,
      value: this.collect()
    } as storageDataType
    return storage.setData(this.prop, storageData)
  }
  sync(storageData: storageDataType) {
    storageData.time++
    return storage.setData(this.prop, storageData)
  }
  init(parent: DataWithLife) {
    const storageData = storage.getData(this.prop) as undefined | storageDataType
    if (storageData) {
      if (this.version === storageData.version) {
        const $constructor = (this.constructor as typeof StorageValue)
        const rate = $constructor.$parse(this, storageData)
        if (rate < 100) {
          parent.triggerLife('beforeInitStorage', parent)
          for (const prop in storageData.value) {
            if (this.control[prop]) {
              this.control[prop].init(storageData.value[prop])
            }
          }
          this.sync(storageData)
          parent.triggerLife('initStoraged', parent)
          if (rate > 50) {
            const offsetRate = rate - 50 // 0 - 50
            // 加权后的进度超过50时，进行可能存在的后期定时加载逻辑
            this.timer = setTimeout(() => {
              this.timer = undefined
              parent.triggerLife('reloadStorage', parent)
            }, this.offset * (1 + offsetRate / 50)) as unknown as number
          }
          return true
        } else {
          return false
        }
      }
    }
    return false
  }
  stop() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }
}

export default StorageValue
