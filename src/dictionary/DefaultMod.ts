import Data from "../data/Data"
import DictionaryValue from "./DictionaryValue"
import TipValue, { TipValueInitOption } from "../lib/TipValue"
import AttributeValue, { AttributeValueInitOption } from "../lib/AttributeValue"
import InterfaceValue from "../lib/InterfaceValue"

export interface DefaultModInitOption {
  $format?: 'list'
  $target?: string // 快捷格式化目标，内存指针指向对应的mod
  prop?: string
  name?: string
  local?: {
    parent?: AttributeValueInitOption
    target?: AttributeValueInitOption
    child?: AttributeValueInitOption
    [prop: string]: undefined | AttributeValueInitOption
  }
  tip?: TipValueInitOption
}

class DefaultMod extends Data {
  static $name = 'DefaultMod'
  $prop: string
  $name: InterfaceValue<string>
  tip?: TipValue
  $local?: {
    parent?: AttributeValue
    target?: AttributeValue
    child?: AttributeValue
    [prop: string]: undefined | AttributeValue
  }
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
    if (initOption.local) {
      // 插件单独的设置，做特殊处理时使用，尽可能的将所有能用到的数据通过option做兼容处理避免问题
      this.$local = {}
      for (const prop in initOption.local) {
        this.$local[prop] = new AttributeValue(initOption.local[prop])
      }
    }
  }
}

export default DefaultMod