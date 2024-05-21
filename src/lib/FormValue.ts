class FormValue {
  static $name = 'FormValue'
  static clearValidate = function(_formValue: FormValue, ..._args: any[]) { console.error('未定义clearValidate函数') }
  static validate = function(_formValue: FormValue, ..._args: any[]): Promise<any> {
    console.error('未定义validate函数')
    return Promise.reject({ status: 'fail', code: 'undefined validate function' })
  }
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
  clearValidate(...args: any[]): void {
    return (this.constructor as typeof FormValue).clearValidate(this, ...args)
  }
  validate(...args: any[]): Promise<any> {
    return (this.constructor as typeof FormValue).validate(this, ...args)
  }
}

export default FormValue
