import { defineReactive } from "complex-utils"
import ArrayMap from "../lib/ArrayMap"
import DefaultMod from "./DefaultMod"

export type observeType = (target: ObserveList, prop: PropertyKey, val: unknown, from?: string) => unknown

class ObserveList extends ArrayMap<DefaultMod> {
  static $name = 'ObserveList'
  static $observe = function(form: Record<PropertyKey, any>, prop: PropertyKey, target: ObserveList) {
    defineReactive(form, prop, {
      set(val) {
        target.$triggerObserve(prop, val, 'change')
      }
    })
  }
  $observe: Record<PropertyKey, undefined | boolean>
  $form: null | Record<PropertyKey, unknown>
  $type: string
  constructor(list?: DefaultMod[]) {
    super(list)
    this.$observe = {}
    this.$form = null
    this.$type = ''
  }
  $triggerObserve (prop: PropertyKey, val: unknown, from?: string) {
    if (this.$observe[prop]) {
      const item = this.get(prop)
      if (item && item.$observe) {
        item.$observe(this, prop, val, from)
      }
    }
  }
  pushObserve (item: DefaultMod) {
    const $constructor = (this.constructor as typeof ObserveList)
    $constructor.$observe(this.$form!, item.$prop, this)
    this.$observe[item.$prop] = true
    this.$triggerObserve(item.$prop, this.$form![item.$prop], 'init')
  }
  removeObserve(prop: PropertyKey) {
    this.$observe[prop] = undefined
  }
  clearObserve() {
    this.$observe = {}
  }
  $startObserve () {
    if (this.$form) {
      this.$map.forEach((item) => {
        if (item.$observe) {
          this.pushObserve(item)
        }
      })
    }
  }
  setForm(form: Record<PropertyKey, unknown>, type = '') {
    this.$form = form
    this.$type = type
    this.$startObserve()
  }
}

export default ObserveList
