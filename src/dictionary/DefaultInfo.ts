import Data from "../data/Data"
import DictionaryValue from "./DictionaryValue"
import AttributeValue, { AttributeValueInitOption } from "../lib/AttributeValue"

export interface DefaultInfoInitOption {
  prop?: string
  name?: string
  show?: DictionaryValue['show']
  showType?: string
  local?: AttributeValueInitOption
}

class DefaultInfo extends Data {
  static $name = 'DefaultInfo'
  $prop: string
  name: string
  showType?: string
  show: DictionaryValue['show']
  $local?: AttributeValue
  constructor(initOption: DefaultInfoInitOption | true, modName?: string, parent?: DictionaryValue) {
    if (initOption === true) {
      initOption = {}
    }
    super()
    this.$setParent(parent)
    this.$prop = initOption.prop || (parent ? parent.$prop : '')
    this.name = initOption.name || (parent ? parent.$getInterfaceValue('name', modName) as string : '')
    this.show = initOption.show || (parent ? parent.show : undefined)
    this.showType = initOption.showType || (parent ? parent.$getInterfaceValue('showType', modName) : '')
    this.$local = initOption.local ? new AttributeValue(initOption.local) : undefined
  }
}

export default DefaultInfo