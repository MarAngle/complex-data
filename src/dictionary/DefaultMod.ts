import Data from "../data/Data"
import DictionaryValue from "./DictionaryValue"
import { observeType } from "./ObserveList"
import TipValue, { TipValueInitOption } from "../lib/TipValue"
import { LocalValue, LocalValueInitOption, createLocalValue } from "../lib/AttrsValue"
import InterfaceValue from "../lib/InterfaceValue"
import { ArrayMapValueType } from "../lib/ArrayMap"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type reactiveFunction = (...args: any[]) => boolean

export interface DefaultModInitOption {
  $format?: string
  $target?: string // 快捷格式化目标，内存指针指向对应的mod
  prop?: string
  name?: string
  local?: LocalValueInitOption
  tip?: TipValueInitOption
  reactive?: {
    [prop: string]: undefined | reactiveFunction
  }
  render?: {
    [prop: string]: undefined | renderType
  }
  observe?: observeType
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type renderType<ARGS extends any[] = any[], RES = unknown> = (...args: ARGS) => RES

class DefaultMod extends Data implements ArrayMapValueType {
  static $name = 'DefaultMod'
  $prop: string
  $name: InterfaceValue<string>
  tip?: TipValue
  $local?: LocalValue
  $reactive?: {
    [prop: string]: undefined | reactiveFunction
  }
  $render?: {
    [prop: string]: undefined | renderType
  }
  $observe?: observeType
  constructor(initOption: DefaultModInitOption | true, modName?: string, parent?: DictionaryValue) {
    if (initOption === true) {
      initOption = {}
    }
    super()
    this.$setParent(parent)
    this.$prop = initOption.prop || (parent ? parent.$prop : '')
    this.$name = (initOption.name !== undefined || !parent) ? new InterfaceValue(initOption.name) : parent.$getInterfaceData('name')
    if (initOption.tip !== undefined) {
      this.tip = new TipValue(initOption.tip)
    }
    this.$local = createLocalValue(initOption.local)
    this.$reactive = initOption.reactive
    this.$render = initOption.render
    this.$observe = initOption.observe
  }
  $getRender(prop: string) {
    if (this.$render) {
      return this.$render[prop]
    }
  }
  $getLocalAttrs(prop: string) {
    if (this.$local) {
      return this.$local[prop]
    }
  }
}

export default DefaultMod