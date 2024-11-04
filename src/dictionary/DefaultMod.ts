import SimpleData, { SimpleDataInitOption } from "../data/SimpleData"
import { renderType } from "../../type"
import DictionaryValue, { functionType } from "../lib/DictionaryValue"
import TipValue, { TipValueInitOption } from "../lib/TipValue"
import { LocalValue, LocalValueInitOption, createLocalValue } from "../lib/AttrsValue"
import { ArrayValueDataType } from "../lib/ArrayValue"

export type collapseType = 0 | 1 | 2 // 折叠判断值,默认 0 不展示 1 推荐展示 2必须展示

export interface DefaultModBeforeOrder {
  before: string
}

export interface DefaultModAfterOrder {
  after: string
}

export type DefaultModOrder = DefaultModBeforeOrder | DefaultModAfterOrder

export interface DefaultModInitOption extends SimpleDataInitOption {
  $format?: string // 格式化类型
  $redirect?: string // 快捷格式化目标，内存指针指向对应的mod
  prop?: string
  name?: string
  parse?: false | functionType<any>
  tip?: TipValueInitOption
  width?: number | string
  collapse?: collapseType
  hidden?: boolean // 是否隐藏
  frozen?: boolean // 是否冻结
  local?: LocalValueInitOption
  renders?: Record<string, undefined | renderType>
  order?: DefaultModOrder
}

class DefaultMod extends SimpleData implements ArrayValueDataType {
  static $name = 'DefaultMod'
  static $formatConfig = { name: 'DefaultMod', level: 40, recommend: true }
  static $width = 100 as undefined | number
  $prop: string
  $name: string
  parse?: false | functionType<any>
  $tip?: TipValue
  $collapse?: collapseType
  $width?: number | string
  $hidden?: boolean
  $frozen?: boolean
  $local?: LocalValue
  $renders?: Record<string, undefined | renderType>
  $order?: DefaultModOrder
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
    } else {
      this.$width = $constructor.$width
    }
    if (initOption.hidden !== undefined) {
      this.$hidden = initOption.hidden
    }
    if (initOption.frozen !== undefined) {
      this.$frozen = initOption.frozen
    }
    this.$local = createLocalValue(initOption.local)
    if (initOption.renders !== undefined) {
      this.$renders = initOption.renders
    }
    if (initOption.order) {
      this.$order = initOption.order
    }
  }
}

export default DefaultMod