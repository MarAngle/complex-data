import Data from "../data/Data"
import config from "../../config"
import DictionaryValue from "./DictionaryValue"
import { ObserveItem } from "./ObserveList"
import TipValue, { TipValueInitOption } from "../lib/TipValue"
import AttributeValue, { AttributeValueInitOption } from "../lib/AttributeValue"

type renderType = (payload: {
  text: unknown,
  record: Record<PropertyKey, unknown>,
  index: number,
  target: unknown,
  list: DefaultList[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => any

export interface DefaultListInitOption {
  prop?: string
  name?: string
  align?: 'center' | 'left' | 'right'
  width?: number | string
  ellipsis?: boolean
  auto?: boolean
  local?: AttributeValueInitOption
  tip?: TipValueInitOption
  show?: DictionaryValue['show']
  render?: renderType
  pureRender?: renderType
  observe?: ObserveItem['$observe']
}

class DefaultList extends Data implements ObserveItem{
  static $name = 'DefaultList'
  declare parent: DictionaryValue
  prop: string
  name: string
  align: 'center' | 'left' | 'right'
  width?: number | string
  ellipsis: boolean
  auto: boolean
  show: DictionaryValue['show']
  tip: TipValue
  $local?: AttributeValue
  render?: renderType
  pureRender?: renderType
  $observe?: ObserveItem['$observe']
  constructor(initOption: DefaultListInitOption | true, modName?: string, parent?: DictionaryValue) {
    if (initOption === true) {
      initOption = {}
    }
    super()
    this.$setParent(parent)
    this.prop = initOption.prop || (parent ? parent.$prop : '')
    this.name = initOption.name || (parent ? parent.$getInterfaceValue('name', modName) as string : '')
    this.show = initOption.show || (parent ? parent.show : undefined)
    this.align = initOption.align || 'center'
    this.width = initOption.width === undefined ? config.dictionary.module.list.width : initOption.width
    this.ellipsis = initOption.ellipsis === undefined ? config.dictionary.module.list.ellipsis : initOption.ellipsis
    this.auto = initOption.auto === undefined ? config.dictionary.module.list.auto : initOption.auto
    this.$local = initOption.local ? new AttributeValue(initOption.local) : undefined
    this.tip = new TipValue(initOption.tip)
    this.render = initOption.render
    this.pureRender = initOption.pureRender
    this.$observe = initOption.observe
  }
}

export default DefaultList