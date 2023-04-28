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

class Data<P extends undefined | Data<any> = undefined> extends UtilsBaseData {
  static $name = 'Data'
  static $observe = false
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
  $syncData(self: boolean, act: string, ...args: any[]) {
    // 基本逻辑：当自身刷新成功后不冒泡，否则网上递归到顶层数据进行判断
    // if (Data.$observe) {
    //   // 此处处理自身逻辑
    //   fromList.push(this.$selfName())
    //   this.$syncDataUpParent(fromList, ...args)
    // }
  }
  // $syncDataUpParent(fromList: string[] = [], ...args: any[]) {
  //   const parent = this.$getParent()
  //   if (parent && parent.$syncData) {
  //     parent.$syncData()
  //   }
  // }
  $getId(prop = ''): string {
    return this.$id + prop
  }
  $selfName(): string {
    return `CLASS:${super.$selfName()}-ID:${this.$getId()}`
  }
  $install(target: BaseData<any>) {
    this.$setParent(target as unknown as P)
  }
  $uninstall(target: BaseData<any>) {
    this.$setParent(undefined)
  }
}


export default Data
