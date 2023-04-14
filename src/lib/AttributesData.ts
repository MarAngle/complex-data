
export interface AttributesDataInitOption {
  props?: Record<PropertyKey, any>
  on?: Record<PropertyKey, ((...args: any[]) => any)>
  style?: Record<PropertyKey, any>
  class?: string[]
  id?: string[]
}

class AttributesData {
  props: Record<PropertyKey, any>
  on: Record<PropertyKey, ((...args: any[]) => any)>
  style: Record<PropertyKey, any>
  class: string[]
  id: string[]
  constructor(initOption?: AttributesDataInitOption) {
    if (!initOption) {
      initOption = {}
    }
    this.props = initOption.props || {}
    this.on = initOption.on || {}
    this.style = initOption.style || {}
    this.class = initOption.class || []
    this.id = initOption.id || []
  }
}

export default AttributesData
