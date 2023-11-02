
export interface AttributeValueInitOption {
  id?: string[]
  class?: string[]
  style?: Record<PropertyKey, unknown>
  props?: Record<PropertyKey, unknown>
  on?: Record<PropertyKey, ((...args: unknown[]) => unknown)>
}

class AttributeValue {
  id: string[]
  class: string[]
  style: Record<PropertyKey, unknown>
  props: Record<PropertyKey, unknown>
  on: Record<PropertyKey, ((...args: unknown[]) => unknown)>
  constructor(initOption?: AttributeValueInitOption) {
    if (!initOption) {
      initOption = {}
    }
    this.id = initOption.id || []
    this.class = initOption.class || []
    this.style = initOption.style || {}
    this.props = initOption.props || {}
    this.on = initOption.on || {}
  }
  protected _pushData(value: string, prop: 'id' | 'class') {
    if (this[prop].indexOf(value) === -1) {
      this[prop].push(value)
      return true
    }
    return false
  }
  protected _removeData(value: string, prop: 'id' | 'class') {
    const index = this[prop].indexOf(value)
    if (index > -1) {
      this[prop].splice(index, 1)
      return true
    }
    return false
  }
  pushId(value: string) {
    return this._pushData(value, 'id')
  }
  removeId(value: string) {
    return this._removeData(value, 'id')
  }
  pushClass(value: string) {
    return this._pushData(value, 'class')
  }
  removeClass(value: string) {
    return this._removeData(value, 'class')
  }

}

export default AttributeValue
