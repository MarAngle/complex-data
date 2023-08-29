/* eslint-disable @typescript-eslint/no-explicit-any */

import Data from "../data/Data";
// import config from "../../config";
import DictionaryData from "../lib/DictionaryData";
import { LayoutDataFormatData } from "../lib/LayoutData";
import { ObserveItem } from "./ObserveList";

export interface DefaultInfoInitOption {
  prop?: string
  name?: string
  show?: DictionaryData['show']
  showType?: string
  local?: Record<PropertyKey, any>
  observe?: ObserveItem['$observe']
}

class DefaultInfo extends Data<DictionaryData> implements ObserveItem{
  static $name = 'DefaultInfo'
  declare parent: DictionaryData
  prop: string
  name: string
  showType?: string
  layout?: LayoutDataFormatData
  show: DictionaryData['show']
  local: Record<PropertyKey, any>
  $observe?: ObserveItem['$observe']
  constructor(initOption: DefaultInfoInitOption | true, modName?: string, parent?: DictionaryData) {
    if (initOption === true) {
      initOption = {}
    }
    super()
    this.$setParent(parent)
    this.prop = initOption.prop || (parent ? parent.$prop : '')
    this.name = initOption.name || (parent ? parent.$getInterface('label', modName) as string : '')
    this.show = initOption.show || (parent ? parent.show : undefined)
    this.showType = initOption.showType || (parent ? parent.$getInterface('showType', modName) : '')
    this.layout = parent ? parent.$getLayout(modName) : undefined
    this.local = initOption.local || {}
    this.$observe = initOption.observe
  }
}

export default DefaultInfo