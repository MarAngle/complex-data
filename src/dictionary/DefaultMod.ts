import Data from "../data/Data"
import DictionaryValue from "../lib/DictionaryValue"
import { observeType } from "./ObserveList"
import TipValue, { TipValueInitOption } from "../lib/TipValue"
import { LocalValue, LocalValueInitOption, createLocalValue } from "../lib/AttrsValue"
import InterfaceValue from "../lib/InterfaceValue"
import { ArrayMapValueType } from "../lib/ArrayMap"
import InterfaceLayoutValue, { InterfaceLayoutValueInitOption } from "../lib/InterfaceLayoutValue"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type reactiveFunction = (...args: any[]) => boolean

export interface DefaultModInitOption {
  $format?: string
  $redirect?: string // 快捷格式化目标，内存指针指向对应的mod
  prop?: string
  name?: string
  layout?: InterfaceLayoutValueInitOption
  local?: LocalValueInitOption
  tip?: TipValueInitOption
  reactives?: Record<string, undefined | reactiveFunction>
  renders?: Record<string, undefined | renderType>
  observe?: observeType
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type renderType<ARGS extends any[] = any[], RES = unknown> = (...args: ARGS) => RES

class DefaultMod extends Data implements ArrayMapValueType {
  static $name = 'DefaultMod'
  static $formatConfig = { name: 'Data:DefaultMod', level: 40, recommend: true }
  $prop: string
  $name: InterfaceValue<string>
  $layout?: InterfaceLayoutValue
  tip?: TipValue
  $local?: LocalValue
  $reactives?: Record<string, undefined | reactiveFunction>
  $renders?: Record<string, undefined | renderType>
  $observe?: observeType
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(initOption: DefaultModInitOption | true, parent?: DictionaryValue, modName?: string) {
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
    if (initOption.layout) {
      this.$layout = new InterfaceLayoutValue(initOption.layout)
    } else if (parent && parent.$layout) {
      this.$layout = parent.$layout
    }
    this.$local = createLocalValue(initOption.local)
    this.$reactives = initOption.reactives
    this.$renders = initOption.renders
    this.$observe = initOption.observe
  }
}

export default DefaultMod