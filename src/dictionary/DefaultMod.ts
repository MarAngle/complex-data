import SimpleData, { SimpleDataInitOption } from "../data/SimpleData"
import { renderType } from "../../type"
import DictionaryValue, { functionType } from "../lib/DictionaryValue"
import TipValue, { TipValueInitOption } from "../lib/TipValue"
import { LocalValue, LocalValueInitOption, createLocalValue } from "../lib/AttrsValue"
import { ArrayValueDataType } from "../lib/ArrayValue"

export type reactiveFunction = (...args: any[]) => boolean

export interface DefaultModInitOption extends SimpleDataInitOption {
  $format?: string // 格式化类型
  $redirect?: string // 快捷格式化目标，内存指针指向对应的mod
  prop?: string
  name?: string
  parse?: false | functionType<any>
  tip?: TipValueInitOption
  width?: number | string
  local?: LocalValueInitOption
  reactives?: Record<string, undefined | reactiveFunction>
  renders?: Record<string, undefined | renderType>
}

class DefaultMod extends SimpleData implements ArrayValueDataType {
  static $name = 'DefaultMod'
  static $formatConfig = { name: 'DefaultMod', level: 40, recommend: true }
  $prop: string
  $name: string
  parse?: false | functionType<any>
  $tip?: TipValue
  $width?: number | string
  $local?: LocalValue
  $reactives?: Record<string, undefined | reactiveFunction>
  $renders?: Record<string, undefined | renderType>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(initOption: DefaultModInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption)
    const $constructor = (this.constructor as typeof DefaultMod)
    if ($constructor.$formatInitOption) {
      initOption = $constructor.$formatInitOption(initOption, parent, modName)
    }
    this.$setParent(parent)
    this.$prop = initOption.prop || (parent ? parent.$prop : '')
    this.$name = initOption.name !== undefined ? initOption.name : (parent ? parent.$getInterfaceValue('name', modName) : '')!
    this.parse = initOption.parse
    if (initOption.tip !== undefined) {
      this.$tip = new TipValue(initOption.tip)
    }
    this.$width = initOption.width
    this.$local = createLocalValue(initOption.local)
    this.$reactives = initOption.reactives
    this.$renders = initOption.renders
  }
}

export default DefaultMod