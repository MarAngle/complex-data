import { clearArray, observe, Watcher } from 'complex-utils'
import Data from './../data/Data'
import { PageData } from './DictionaryData'

class PageList extends Data {
  static $name = 'PageList'
  $map: {
    data: Map<string, PageData>,
    hidden: Map<string, PageData>
  }
  $watch: Map<string, Watcher>
  $order: string[]
  $data: null | Record<PropertyKey, any>
  data: PageData[]
  constructor (list?: PageData[]) {
    super()
    this.$map = {
      data: new Map(),
      hidden: new Map()
    }
    this.$watch = new Map()
    this.$order = []
    this.$data = null
    this.data = []
    if (list) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        this.push(item)
      }
    }
  }
  push(target: PageData) {
    this.data.push(target)
    this.$order.push(target.prop)
    this.$map.data.set(target.prop, target)
  }
  unshift(target: PageData) {
    this.data.unshift(target)
    this.$order.unshift(target.prop)
    this.$map.data.set(target.prop, target)
  }
  pop() {
    const deleteItem = this.data.pop()!
    const deleteItemProp = deleteItem.prop
    // 删除顺序，为避免结尾隐藏情况，单独判断
    this.$order.splice(this.$order.indexOf(deleteItemProp), 1)
    this.$map.data.delete(deleteItemProp)
    this.$map.hidden.delete(deleteItemProp)
  }
  shift() {
    const deleteItem = this.data.shift()!
    const deleteItemProp = deleteItem.prop
    // 删除顺序，为避免结尾隐藏情况，单独判断
    this.$order.splice(this.$order.indexOf(deleteItemProp), 1)
    this.$map.data.delete(deleteItemProp)
    this.$map.hidden.delete(deleteItemProp)
  }
  $addItemByPreIndex(preIndex: number, target: PageData) {
    let preCurrentIndex = -1
    for (preIndex; preIndex >= 0; preIndex--) {
      // 获取总顺序
      const preProp = this.$order[preIndex]
      if (!this.$map.hidden.get(preProp)) {
        const preItem = this.$map.data.get(preProp)!
        preCurrentIndex = this.data.indexOf(preItem)
        break
      }
    }
    this.data.splice(preCurrentIndex + 1, 0, target)
  }
  showOrder() {
    return console.log(JSON.stringify(this.$order))
  }
  setOrder(order: string[]) {
    const currentOrder = []
    for (let i = 0; i < order.length; i++) {
      const prop = order[i]
      const index = this.$order.indexOf(prop)
      if (index > -1) {
        currentOrder.push(prop)
        this.$order.splice(index, 1)
      }
    }
    for (let n = 0; n < this.$order.length; n++) {
      const prop = this.$order[n];
      currentOrder.push(prop)
    }
    this.$order = currentOrder
    this.syncOrder()
  }
  syncOrder() {
    clearArray(this.data)
    for (let n = 0; n < this.$order.length; n++) {
      this.push(this.getItem(this.$order[n])!)
    }
  }
  getItem(prop: string) {
    return this.$map.data.get(prop)
  }
  addItem(target: PageData, preProp?: string) {
    if (preProp) {
      const preIndex = this.$order.indexOf(preProp)
      this.$addItemByPreIndex(preIndex, target)
      this.$order.splice(preIndex + 1, 0, target.prop)
    } else {
      this.data.unshift(target)
    }
  }
  delItem(prop: string) {
    const target = this.$map.data.get(prop)
    if (target) {
      this.$map.data.delete(prop)
      this.$map.hidden.delete(prop)
      const totalIndex = this.$order.indexOf(prop)
      this.$order.splice(totalIndex, 1)
      const index = this.data.indexOf(target)
      if (index > -1) {
        this.data.splice(index, 1)
      }
    }
  }
  hidden(prop: string) {
    if (!this.$map.hidden.has(prop)) {
      const target = this.getItem(prop)!
      const index = this.data.indexOf(target)
      this.data.splice(index, 1)
      this.$map.hidden.set(prop, target)
    }
  }
  show(prop: string) {
    const target = this.$map.hidden.get(prop)
    if (target) {
      this.$map.hidden.delete(prop)
      const totalIndex = this.$order.indexOf(prop)
      this.$addItemByPreIndex(totalIndex - 1, target)
    }
  }
  setData(data: Record<PropertyKey, any>) {
    observe(data)
    this.$data = data
    this.$observe()
  }
  $triggerObserve (prop: string, val: any, from?: string) {
    this.$map.data.forEach((item) => {
      if (item.edit.$observe) {
        item.edit.$observe(this, prop, val, from)
      }
    })
  }
  $observe () {
    this.clearObserve()
    if (this.$data) {
      for (const prop in this.$data) {
        this.addObserve(prop, new Watcher(this.$data, prop, {
          deep: true,
          handler: (val) => {
            this.$triggerObserve(prop, val, 'watch')
          }
        }), false, 'init')
      }
    }
  }
  addObserve (prop: string, watcher: Watcher, unTriggerObserve?: boolean, from?: string) {
    this.$watch.set(prop, watcher)
    if (!unTriggerObserve) {
      this.$triggerObserve(prop, this.$data![prop], from)
    }
  }
  delObserve (prop: string) {
    const watcher = this.$watch.get(prop)
    if (watcher) {
      watcher.stop()
      this.$watch.delete(prop)
    }
  }
  clearObserve () {
    this.$watch.forEach(function(watcher) {
      watcher.stop()
    })
    this.$watch.clear()
  }
}

export default PageList
