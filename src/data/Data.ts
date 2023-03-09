/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Data as UtilsBaseData } from "complex-utils"
import BaseData from './BaseData'
let id = 0

function createId(): string {
  id++
  return id.toString()
}

interface cascadeTypeObject<D> {
  [prop: PropertyKey]: D | cascadeTypeObject<D>
}

export type cascadeType<D> = D | cascadeTypeObject<D>

class Data<P extends Data = any> extends UtilsBaseData {
  static $name = 'Data'
  readonly $id!: string
  $parent?: P
  constructor() {
    super()
    Object.defineProperty(this, '$id', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: createId()
    })
  }
  /**
   * 设置父数据,需要设置为不可枚举避免循环递归：主要针对微信小程序环境
   * @param {object} parent 父数据
   */
  $setParent(parent?: P) {
    Object.defineProperty(this, '$parent', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: parent
    })
  }
  /**
   * 获取父数据
   * @returns {object | undefined}
   */
  $getParent(): P | undefined {
    return this.$parent
  }
  $syncData(from?: string, ...args: any[]) { }
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
