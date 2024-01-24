class FormValue {
  static $name = 'FormValue'
  static clearValidate = function(formValue: FormValue, ...args: any[]) { console.error('未定义clearValidate函数') }
  static validate = function(formValue: FormValue, ...args: any[]): Promise<unknown> {
    console.error('未定义validate函数')
    return Promise.reject({ status: 'fail', code: 'undefined validate function' })
  }
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
  clearValidate(...args: unknown[]): void {
    return (this.constructor as typeof FormValue).clearValidate(this, ...args)
  }
  validate(...args: unknown[]): Promise<unknown> {
    return (this.constructor as typeof FormValue).validate(this, ...args)
  }
}

export default FormValue
