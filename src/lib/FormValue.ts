import { isArray } from "complex-utils"

class FormValue {
  static $name = 'FormValue'
  static clearValidate = function(_formValue: FormValue, ..._args: any[]) { console.error('未定义clearValidate函数') }
  static validate = function(_formValue: FormValue, ..._args: any[]): Promise<any> {
    console.error('未定义validate函数')
    return Promise.reject({ status: 'fail', code: 'undefined validate function' })
  }
  ref: any
  data: Record<PropertyKey, any>
  children?: Record<PropertyKey, FormValue | FormValue[]>
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
  pushChild(prop: PropertyKey, form: FormValue) {
    if (!this.children) {
      this.children = {}
    }
    this.children[prop] = form
  }
  clearValidate(...args: any[]): void {
    const $constructor = (this.constructor as typeof FormValue)
    if (this.children) {
      for (const prop in this.children) {
        const child = this.children[prop]
        if (!isArray(child)) {
          $constructor.clearValidate(child, ...args)
        } else {
          child.forEach(childItem => $constructor.clearValidate(childItem, ...args))
        }
      }
    }
    $constructor.clearValidate(this, ...args)
  }
  validate(...args: any[]): Promise<any> {
    const $constructor = (this.constructor as typeof FormValue)
    if (this.children) {
      const promiseList: Promise<any>[] = []
      for (const prop in this.children) {
        const child = this.children[prop]
        if (!isArray(child)) {
          promiseList.push($constructor.validate(child, ...args))
        } else {
          child.forEach(childItem => {
            promiseList.push($constructor.validate(childItem, ...args))
          })
        }
      }
      return new Promise((resolve, reject) => {
        Promise.all(promiseList).then(() => {
          $constructor.validate(this, ...args).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        }).catch(err => {
          reject(err)
        })
      })
    } else {
      return $constructor.validate(this, ...args)
    }
  }
}

export default FormValue
