/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Data as UtilsBaseData } from "complex-utils";
import BaseData from './BaseData'
let id = 0

function createId(): string {
  id++
  return id.toString()
}

class Data extends UtilsBaseData {
  readonly $id!: string
  static $name = 'Data'
  constructor() {
    super()
    Object.defineProperty(this, '$id', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: createId()
    })
  }
  $syncData(...args: any[]) { }
  $getId(prop = ''): string {
    return this.$id + prop
  }
  $selfName(): string {
    return `CLASS:${super.$selfName()}-ID:${this.$getId()}`
  }
  $install(target: BaseData) { }
  $uninstall(target: BaseData) { }
}


export default Data
