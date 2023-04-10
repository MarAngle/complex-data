
import Data from "../data/Data";
import config from "../../config";
import DictionaryData from "../lib/DictionaryData";
import { ObserveItem } from "./ObserveList";
import TipData, { TipDataInitOption } from "./TipsData";

type renderType = (payload: {
  text: any,
  record: Record<PropertyKey, any>,
  index: number,
  item: DefaultList,
  list: DefaultList[]
}) => any

export interface DefaultListInitOption {
  name?: string
  align?: 'center' | 'left' | 'right'
  width?: number | string
  ellipsis?: boolean
  auto?: boolean
  local?: Record<PropertyKey, any>
  tip?: TipDataInitOption
  render?: renderType,
  pureRender?: renderType,
  observe?: ObserveItem['$observe']
}

class DefaultList extends Data<DictionaryData> implements ObserveItem{
  static $name = 'DefaultList'
  declare parent: DictionaryData
  prop: string
  name: string
  align: 'center' | 'left' | 'right'
  width?: number | string
  ellipsis: boolean
  auto: boolean
  show: DictionaryData['show']
  tip: TipData
  local: Record<PropertyKey, any>
  render?: renderType
  pureRender?: renderType
  $observe?: ObserveItem['$observe']
  constructor(initOption: DefaultListInitOption | true, modName: string, parent: DictionaryData) {
    if (initOption === true) {
      initOption = {}
    }
    super()
    this.$setParent(parent)
    this.prop = parent.$prop
    this.name = initOption.name || parent.$getInterface('label', modName) as string
    this.align = initOption.align || 'center'
    this.width = initOption.width === undefined ? config.DefaultList.width : initOption.width
    this.ellipsis = initOption.ellipsis === undefined ? config.DefaultList.ellipsis : initOption.ellipsis
    this.auto = initOption.auto === undefined ? config.DefaultList.auto : initOption.auto
    this.show = parent.show
    this.local = initOption.local || {}
    this.tip = new TipData(initOption.tip)
    this.render = initOption.render
    this.pureRender = initOption.pureRender
    this.$observe = initOption.observe
  }
}

export default DefaultList