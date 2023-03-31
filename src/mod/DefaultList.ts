
import Data from "../data/Data";
import config from "../../config";
import DictionaryData from "../lib/DictionaryData";

export interface DefaultListInitOption {
  name?: string
  align?: 'center' | 'left' | 'right'
  width?: number | string
  ellipsis?: boolean
  auto?: boolean
  local?: Record<PropertyKey, any>
}

class DefaultList extends Data{
  static $name = 'DefaultList'
  prop: string
  name: string
  align: 'center' | 'left' | 'right'
  width?: number | string
  ellipsis: boolean
  auto: boolean
  show: DictionaryData['show']
  local: Record<PropertyKey, any>
  constructor(initOption: DefaultListInitOption | true, modName: string, parent: DictionaryData) {
    if (initOption === true) {
      initOption = {}
    }
    super()
    this.prop = parent.$prop
    this.name = initOption.name || parent.$getInterface('label', modName) as string
    this.align = initOption.align || 'center'
    this.width = initOption.width === undefined ? config.DefaultList.width : initOption.width
    this.ellipsis = initOption.ellipsis === undefined ? config.DefaultList.ellipsis : initOption.ellipsis
    this.auto = initOption.auto === undefined ? config.DefaultList.auto : initOption.auto
    this.show = parent.show
    this.local = initOption.local || {}
  }
}

export default DefaultList