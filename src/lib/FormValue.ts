abstract class FormValue {
  static $name = 'FormValue'
  ref: unknown
  data: Record<PropertyKey, unknown>
  constructor() {
    this.ref = null
    this.data = {}
  }
  setRef(ref: unknown) {
    this.ref = ref
  }
  setData(data: Record<PropertyKey, unknown>) {
    this.data = data
  }
  getRef() {
    return this.ref
  }
  getData() {
    return this.data
  }
  abstract clearValidate(...args: unknown[]): void
  abstract validate(...args: unknown[]): Promise<unknown>
}

export default FormValue
