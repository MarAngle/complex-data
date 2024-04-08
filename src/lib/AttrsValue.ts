
export interface AttrsValueInitOption {
  id?: string[]
  class?: string[]
  style?: Record<PropertyKey, unknown>
  attrs?: Record<PropertyKey, unknown>
  props?: Record<PropertyKey, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on?: Record<PropertyKey, undefined | ((...args: any[]) => unknown)>
}

class AttrsValue {
  id: string[]
  class: string[]
  style: Record<PropertyKey, unknown>
  attrs: Record<PropertyKey, unknown>
  props: Record<PropertyKey, unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: Record<PropertyKey, undefined | ((...args: any[]) => unknown)>
  constructor(initOption?: AttrsValueInitOption) {
    if (!initOption) {
      initOption = {}
    }
    this.id = initOption.id || []
    this.class = initOption.class || []
    this.style = initOption.style || {}
    this.attrs = initOption.attrs || {}
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
  protected _appendData(data: undefined | Record<PropertyKey, unknown>, prop: 'style' | 'attrs' | 'props') {
    if (data) {
      for (const key in data) {
        this[prop][key] = data[key]
      }
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
  pushStyle(style?: Record<PropertyKey, unknown>) {
    return this._appendData(style, 'style')
  }
  pushAttrs(attrs?: Record<PropertyKey, unknown>) {
    return this._appendData(attrs, 'attrs')
  }
  pushProps(props?: Record<PropertyKey, unknown>) {
    return this._appendData(props, 'props')
  }
  pushEvent(prop: string, event?: (...args: unknown[]) => unknown, type: 'before' | 'after' = 'after') {
    if (event) {
      if (this.on[prop]) {
        const lastEvent = this.on[prop]!
        this.on[prop] = type === 'after' ? function(...args) {
          lastEvent(...args)
          return event(...args)
        } : function(...args) {
          event(...args)
          return lastEvent(...args)
        }
      } else {
        this.on[prop] = event
      }
    }
  }
  merge(targetData?: AttrsValue) {
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
      for (const key in targetData.attrs) {
        this.attrs[key] = targetData.attrs[key]
      }
      for (const key in targetData.props) {
        this.props[key] = targetData.props[key]
      }
      for (const key in targetData.on) {
        this.on[key] = targetData.on[key]
      }
    }
    return this
  }
}

export type LocalValueInitOption = Record<string, AttrsValueInitOption>
export type LocalValue = Record<string, undefined | AttrsValue>

export const createLocalValue = function(localValueInitOption?: LocalValueInitOption): undefined | LocalValue {
  if (localValueInitOption) {
    const data: LocalValue = {}
    for (const key in localValueInitOption) {
      data[key] = new AttrsValue(localValueInitOption[key])
    }
    return data
  } else {
    return undefined
  }
}

export default AttrsValue
