import SimpleData, { SimpleDataInitOption } from "../data/SimpleData"
import { renderType } from "../../type"
import DictionaryValue, { functionType } from "../lib/DictionaryValue"
import TipValue, { TipValueInitOption } from "../lib/TipValue"
import { LocalValue, LocalValueInitOption, createLocalValue } from "../lib/AttrsValue"
import { ArrayValueDataType } from "../lib/ArrayValue"

export type reactiveFunction = (...args: any[]) => boolean

export type collapseType = 0 | 1 | 2 // 折叠判断值,默认 0 不展示 1 推荐展示 2必须展示

export interface DefaultModOffsetSort {
  offset: number
}

export interface DefaultModBeforeSort {
  before: string
}

export interface DefaultModAfterSort {
  after: string
}

export type DefaultModSort = DefaultModBeforeSort | DefaultModAfterSort

export interface DefaultModInitOption extends SimpleDataInitOption {
  $format?: string // 格式化类型
  $redirect?: string // 快捷格式化目标，内存指针指向对应的mod
  prop?: string
  name?: string
  parse?: false | functionType<any>
  tip?: TipValueInitOption
  width?: number | string
  collapse?: collapseType
  local?: LocalValueInitOption
  reactives?: Record<string, undefined | reactiveFunction>
  renders?: Record<string, undefined | renderType>
  sort?: DefaultModSort
}

class DefaultMod extends SimpleData implements ArrayValueDataType {
  static $name = 'DefaultMod'
  static $formatConfig = { name: 'DefaultMod', level: 40, recommend: true }
  $prop: string
  $name: string
  parse?: false | functionType<any>
  $tip?: TipValue
  $collapse?: collapseType
  $width?: number | string
  $local?: LocalValue
  $reactives?: Record<string, undefined | reactiveFunction>
  $renders?: Record<string, undefined | renderType>
  $sort?: DefaultModSort
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(initOption: DefaultModInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption)
    const $constructor = (this.constructor as typeof DefaultMod)
    if ($constructor.$formatInitOption) {
      initOption = $constructor.$formatInitOption(initOption, parent, modName)
    }
    this.$setParent(parent)
    this.$prop = initOption.prop || (parent ? parent.$prop : '')
    this.$name = initOption.name != undefined ? initOption.name : (parent ? parent.$getInterfaceValue('name', modName) : '')!
    if (initOption.parse !== undefined) {
      this.parse = initOption.parse
    }
    if (initOption.tip != undefined) {
      this.$tip = new TipValue(initOption.tip)
    }
    if (initOption.collapse !== undefined) {
      this.$collapse = initOption.collapse
    }
    if (initOption.width !== undefined) {
      this.$width = initOption.width
    }
    this.$local = createLocalValue(initOption.local)
    if (initOption.reactives !== undefined) {
      this.$reactives = initOption.reactives
    }
    if (initOption.renders !== undefined) {
      this.$renders = initOption.renders
    }
    if (initOption.sort) {
      this.$sort = initOption.sort
    }
  }
}

export default DefaultMod