import { Watcher, observe } from "complex-utils"
import ArrayValue from "../lib/ArrayValue"
import DefaultInfo from "./DefaultInfo"

export type observeType = (target: ObserveList, prop: PropertyKey, val: unknown, from: 'set' | 'change') => unknown

class ObserveList extends ArrayValue<DefaultInfo> {
  static $name = 'ObserveList'
  $data!: null | Record<PropertyKey, any>
  $watch!: Map<PropertyKey, Watcher>
  $type: string
  $deep: boolean
  constructor(list?: DefaultInfo[]) {
    super(list)
    // 不可枚举，不可配置
    Object.defineProperty(this, '$data', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: null
    })
    Object.defineProperty(this, '$watch', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: new Map()
    })
    this.$type = ''
    this.$deep = false
  }
  startObserve(data: Record<PropertyKey, any>, type = '', deep = true) {
    observe(data)
    this.$data = data
    this.$type = type
    this.$deep = deep
    this.$startObserve()
  }
  $startObserve () {
    this.clearWatcher()
    if (this.$data) {
      this.$map.forEach((item, prop) => {
        if (item.$observe) {
          this.setWatcher(prop, new Watcher(this.$data!, prop as string, {
            deep: this.$deep,
            handler: (val) => {
              if (!this.isFrozen(prop)) {
                // 未被冻结的属性则触发响应式
                this.triggerObserve(prop, val, 'change')
              }
            }
          }), false)
        }
      })
    }
  }
  // 触发响应式
  triggerObserve (prop: PropertyKey, val: any, from: 'set' | 'change') {
    const item = this.get(prop)
    if (item && item.$observe) {
      item.$observe(this, prop, val, from)
    }
  }
  // 设置观察者
  setWatcher (prop: PropertyKey, watcher: Watcher, unTriggerObserve?: boolean) {
    this.$watch.set(prop, watcher)
    if (!unTriggerObserve) {
      this.triggerObserve(prop, this.$data![prop], 'set')
    }
  }
  // 移除观察者
  removeWatcher (prop: PropertyKey) {
    const watcher = this.$watch.get(prop)
    if (watcher) {
      watcher.stop()
      this.$watch.delete(prop)
    }
  }
  // 清空观察者
  clearWatcher () {
    this.$watch.forEach(function(watcher) {
      watcher.stop()
    })
    this.$watch.clear()
  }
}

export default ObserveList
