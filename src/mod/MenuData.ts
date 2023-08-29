/* eslint-disable @typescript-eslint/no-explicit-any */
import Data from "../data/Data"
import { ObserveItem } from "./ObserveList"
import AttributesData, { AttributesDataInitOption } from "./../lib/AttributesData"
import LayoutData, { LayoutDataInitOption } from "./../lib/LayoutData"

type renderType = (payload: {
  text: any,
  record: Record<PropertyKey, any>,
  index: number,
  target: any,
  list: any[]
}) => any

export type booleanFunction = (...args: any[]) => boolean

export interface MenuDataInitOption {
  prop: string
  name: string
  type?: string
  icon?: any
  loading?: boolean | booleanFunction
  disabled?: boolean | booleanFunction
  hidden?: boolean | booleanFunction
  local?: {
    parent?: AttributesDataInitOption
    target?: AttributesDataInitOption
  }
  layout?: LayoutDataInitOption
  render?: renderType
  observe?: ObserveItem['$observe']
}


class MenuData extends Data implements ObserveItem{
  static $name = 'MenuData'
  prop: string
  name: string
  type?: string
  icon?: any
  loading?: boolean | booleanFunction
  disabled?: boolean | booleanFunction
  hidden?: boolean | booleanFunction
  $local: {
    parent: AttributesData
    target: AttributesData
  }
  layout: LayoutData
  render?: renderType
  $observe?: ObserveItem['$observe']
  constructor(initOption: MenuDataInitOption, layout?: LayoutData) {
    super()
    this.prop = initOption.prop
    this.name = initOption.name
    this.type = initOption.type
    this.icon = initOption.icon
    this.loading = initOption.loading
    this.disabled = initOption.disabled
    this.hidden = initOption.disabled
    const local = initOption.local || {}
    this.$local = {
      parent: new AttributesData(local.parent),
      target: new AttributesData(local.target)
    }
    this.layout = new LayoutData(initOption.layout || layout)
    this.render = initOption.render
    this.$observe = initOption.observe
  }
}

export default MenuData