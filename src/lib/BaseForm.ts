/* eslint-disable @typescript-eslint/no-explicit-any */
abstract class BaseForm {
  static $name = 'BaseForm'
  ref: any
  data: Record<PropertyKey, any>
  constructor() {
    this.ref = null
    this.data = {}
  }
  setRef(ref: any) {
    this.ref = ref
  }
  setData(data: Record<PropertyKey, any>) {
    this.data = data
  }
  getRef() {
    return this.ref
  }
  getData() {
    return this.data
  }
  abstract clearValidate(...args: any[]): void
  abstract validate(...args: any[]): Promise<unknown>
}

export default BaseForm
