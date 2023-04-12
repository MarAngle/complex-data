import Data from "../data/Data";


export interface AttributesDataInitOption {
  props?: Record<PropertyKey, any>
  on?: Record<PropertyKey, ((...args: any[]) => any)>
  style?: Record<PropertyKey, any>
  class?: any
  id?: any
}

class AttributesData extends Data {
  props: Record<PropertyKey, any>
  on: Record<PropertyKey, ((...args: any[]) => any)>
  style: Record<PropertyKey, any>
  class: any
  id: any
  constructor(initOption?: AttributesDataInitOption) {
    super()
    if (!initOption) {
      initOption = {}
    }
    this.style = initOption.style || {}
    this.props = initOption.props || {}
    this.on = initOption.on || {}
    this.class = initOption.class
    this.id = initOption.id
  }
}


export default AttributesData
