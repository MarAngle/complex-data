
export interface AttributeValueInitOption {
  id?: string[]
  class?: string[]
  style?: Record<PropertyKey, unknown>
  attributes?: Record<PropertyKey, unknown>
  props?: Record<PropertyKey, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on?: Record<PropertyKey, ((...args: any[]) => unknown)>
}

class AttributeValue {
  id: string[]
  class: string[]
  style: Record<PropertyKey, unknown>
  attributes: Record<PropertyKey, unknown>
  props: Record<PropertyKey, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: Record<PropertyKey, ((...args: any[]) => unknown)>
  constructor(initOption?: AttributeValueInitOption) {
    if (!initOption) {
      initOption = {}
    }
    this.id = initOption.id || []
    this.class = initOption.class || []
    this.style = initOption.style || {}
    this.attributes = initOption.attributes || {}
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
  merge(targetData?: AttributeValue) {
    if (targetData) {
      targetData.class.forEach(classStr => {
        this.pushClass(classStr)
      })
      targetData.id.forEach(idStr => {
        this.pushId(idStr)
      })
      for (const key in targetData.style) {
        this.style[key] = targetData.style[key]
      }
      for (const key in targetData.attributes) {
        this.attributes[key] = targetData.attributes[key]
      }
      for (const key in targetData.props) {
        this.props[key] = targetData.props[key]
      }
      for (const key in targetData.on) {
        this.on[key] = targetData.on[key]
      }
    }
  }
}

export default AttributeValue
