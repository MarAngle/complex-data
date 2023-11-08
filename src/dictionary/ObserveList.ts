import { Watcher, observe } from "complex-utils-next"
import DefaultEdit from "./DefaultEdit"
import ArrayMap from "../lib/ArrayMap"
import DefaultMod from "./DefaultMod"

export type observeType = (target: ObserveList, prop: PropertyKey, val: unknown, from?: string) => unknown

class ObserveList extends ArrayMap<DefaultMod> {
  static $name = 'ObserveList'
  $watch: Map<PropertyKey, Watcher>
  $form: null | Record<PropertyKey, unknown>
  $type: string
  constructor(list?: DefaultEdit[]) {
    super(list)
    this.$watch = new Map()
    this.$form = null
    this.$type = ''
  }
  $triggerObserve (prop: PropertyKey, val: unknown, from?: string) {
    this.$map.forEach((item) => {
      if (item.$observe) {
        item.$observe(this, prop, val, from)
      }
    })
  }
  pushWatcher (prop: PropertyKey, watcher: Watcher, unTriggerObserve?: boolean, from?: string) {
    this.$watch.set(prop, watcher)
    if (!unTriggerObserve) {
      this.$triggerObserve(prop, this.$form![prop], from)
    }
  }
  removeWatcher (prop: PropertyKey) {
    const watcher = this.$watch.get(prop)
    if (watcher) {
      watcher.stop()
      this.$watch.delete(prop)
    }
  }
  clearWatcher () {
    this.$watch.forEach(function(watcher) {
      watcher.stop()
    })
    this.$watch.clear()
  }
  $observe () {
    this.clearWatcher()
    if (this.$form) {
      for (const prop in this.$form) {
        this.pushWatcher(prop, new Watcher(this.$form, prop, {
          deep: true,
          handler: (val) => {
            this.$triggerObserve(prop, val, 'change')
          }
        }), false, 'init')
      }
    }
  }
  setForm(form: Record<PropertyKey, unknown>, type = '') {
    observe(form)
    this.$form = form
    this.$type = type
    this.$observe()
  }
}

export default ObserveList
