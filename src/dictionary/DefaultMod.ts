import Data from "../data/Data"
import DictionaryValue from "./DictionaryValue"
import TipValue, { TipValueInitOption } from "../lib/TipValue"
import AttributeValue, { AttributeValueInitOption } from "../lib/AttributeValue"

export interface DefaultModInitOption {
  $format?: 'list'
  $target?: string // 快捷格式化目标，内存指针指向对应的mod
  prop?: string
  name?: string
  local?: {
    parent?: AttributeValueInitOption
    target?: AttributeValueInitOption
    child?: AttributeValueInitOption
  }
  tip?: TipValueInitOption
}

class DefaultMod extends Data {
  static $name = 'DefaultMod'
  $prop: string
  $name: string
  tip?: TipValue
  $local?: {
    parent: AttributeValue
    target: AttributeValue
    child: AttributeValue
  }
  constructor(initOption: DefaultModInitOption | true, modName?: string, parent?: DictionaryValue) {
    if (initOption === true) {
      initOption = {}
    }
    super()
    this.$setParent(parent)
    this.$prop = initOption.prop || (parent ? parent.$prop : '')
    this.$name = initOption.name || (parent ? parent.$getInterfaceValue('name', modName) as string : '')
    if (initOption.tip !== undefined) {
      this.tip = new TipValue(initOption.tip)
    }
    if (initOption.local) {
      // 插件单独的设置，做特殊处理时使用，尽可能的将所有能用到的数据通过option做兼容处理避免问题
      const local = initOption.local
      this.$local = {
        parent: new AttributeValue(local.parent),
        target: new AttributeValue(local.target),
        child: new AttributeValue(local.child)
      }
    }
  }
}

export default DefaultMod