import SimpleData, { SimpleDataInitOption } from "../data/SimpleData"
import DictionaryValue from "../lib/DictionaryValue"
import { observeType } from "./ObserveList"
import TipValue, { TipValueInitOption } from "../lib/TipValue"
import { LocalValue, LocalValueInitOption, createLocalValue } from "../lib/AttrsValue"
import InterfaceValue from "../lib/InterfaceValue"
import { ArrayMapValueType } from "../lib/ArrayMap"
import { renderType } from "../type"
import { GridValue, buildGridValue } from "../lib/GridParse"
import WidthValue, { WidthValueInitOption } from "../lib/WidthValue"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type reactiveFunction = (...args: any[]) => boolean

export interface DefaultModInitOption extends SimpleDataInitOption {
  $format?: string // 格式化类型
  $redirect?: string // 快捷格式化目标，内存指针指向对应的mod
  prop?: string
  name?: string
  tip?: TipValueInitOption
  grid?: GridValue
  width?: WidthValueInitOption
  local?: LocalValueInitOption
  reactives?: Record<string, undefined | reactiveFunction>
  renders?: Record<string, undefined | renderType>
  observe?: observeType
}

class DefaultMod extends SimpleData implements ArrayMapValueType {
  static $name = 'DefaultMod'
  static $formatConfig = { name: 'DefaultMod', level: 40, recommend: true }
  $prop: string
  $name: InterfaceValue<string>
  $tip?: TipValue
  $grid?: GridValue
  $width?: WidthValue
  $local?: LocalValue
  $reactives?: Record<string, undefined | reactiveFunction>
  $renders?: Record<string, undefined | renderType>
  $observe?: observeType
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(initOption: DefaultModInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption)
    this.$setParent(parent)
    this.$prop = initOption.prop || (parent ? parent.$prop : '')
    this.$name = (initOption.name !== undefined || !parent) ? new InterfaceValue(initOption.name) : parent.$getInterfaceData('name')
    if (initOption.tip !== undefined) {
      this.$tip = new TipValue(initOption.tip)
    }
    this.$grid = buildGridValue(initOption.grid)
    this.$width = new WidthValue(initOption.width)
    this.$local = createLocalValue(initOption.local)
    this.$reactives = initOption.reactives
    this.$renders = initOption.renders
    this.$observe = initOption.observe
  }
}

export default DefaultMod