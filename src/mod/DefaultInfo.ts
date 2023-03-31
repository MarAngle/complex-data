
import Data from "../data/Data";
// import config from "../../config";
import DictionaryData from "../lib/DictionaryData";
import { LayoutDataFormatData } from "../lib/LayoutData";

export interface DefaultInfoInitOption {
  name?: string
  local?: Record<PropertyKey, any>
}

class DefaultInfo extends Data{
  static $name = 'DefaultInfo'
  prop: string
  name: string
  showType?: string
  layout: LayoutDataFormatData
  show: DictionaryData['show']
  local: Record<PropertyKey, any>
  constructor(initOption: DefaultInfoInitOption | true, modName: string, parent: DictionaryData) {
    if (initOption === true) {
      initOption = {}
    }
    super()
    this.prop = parent.$prop
    this.name = initOption.name || parent.$getInterface('label', modName) as string
    this.showType = parent.$getInterface('showType', modName)
    this.layout = parent.$getLayout(modName)
    this.show = parent.show
    this.local = initOption.local || {}
  }
}

export default DefaultInfo