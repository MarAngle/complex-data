import SimpleData, { SimpleDataInitOption } from "../data/SimpleData"
import { renderType } from "../type"
import DictionaryValue, { functionType } from "../lib/DictionaryValue"
import TipValue, { TipValueInitOption } from "../lib/TipValue"
import { LocalValue, LocalValueInitOption, createLocalValue } from "../lib/AttrsValue"
import { ArrayValueDataType } from "../lib/ArrayValue"
import { GridOption, createGridOption } from "../lib/GridParse"
import { observeType } from "./ObserveList"

export type reactiveFunction = (...args: any[]) => boolean

export interface DefaultSimpleModInitOption extends SimpleDataInitOption {
  $format?: string // 格式化类型
  $redirect?: string // 快捷格式化目标，内存指针指向对应的mod
  prop?: string
  name?: string
  parse?: false | functionType<any>
  tip?: TipValueInitOption
  grid?: GridOption
  width?: number | string
  local?: LocalValueInitOption
  reactives?: Record<string, undefined | reactiveFunction>
  renders?: Record<string, undefined | renderType>
  observe?: observeType
}

class DefaultSimpleMod extends SimpleData implements ArrayValueDataType {
  static $name = 'DefaultSimpleMod'
  static $formatConfig = { name: 'DefaultSimpleMod', level: 40, recommend: true }
  $prop: string
  $name: string
  parse?: false | functionType<any>
  $tip?: TipValue
  $grid?: GridOption
  $width?: number | string
  $local?: LocalValue
  $reactives?: Record<string, undefined | reactiveFunction>
  $renders?: Record<string, undefined | renderType>
  $observe?: observeType
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(initOption: DefaultSimpleModInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption)
    this.$setParent(parent)
    this.$prop = initOption.prop || (parent ? parent.$prop : '')
    this.$name = initOption.name !== undefined ? initOption.name : (parent ? parent.$getInterfaceValue('name', modName) : '')!
    this.parse = initOption.parse
    if (initOption.tip !== undefined) {
      this.$tip = new TipValue(initOption.tip)
    }
    this.$grid = createGridOption(initOption.grid)
    this.$width = initOption.width
    this.$local = createLocalValue(initOption.local)
    this.$reactives = initOption.reactives
    this.$renders = initOption.renders
    this.$observe = initOption.observe
  }
}

export default DefaultSimpleMod