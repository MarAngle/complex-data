import { Data as UtilsData } from 'complex-utils'
import BaseData from './BaseData'

let id = 0
function createId(): string {
  id++
  return id.toString()
}

// 属性的类型不能在数据属性和访问器属性之间更改，不可被删除，且其他属性也不能被更改（但是，如果它是一个可写的数据描述符，则 value 可以被更改，writable 可以更改为 false）

class Data extends UtilsData {
  static $name = 'Data'
  static $observe = false
  static $format: (null | ((data: Data) => Data)) = null
  readonly $id!: string
  $buffer!: {
    parent?: Data
    [prop: string]: unknown
  }
  constructor() {
    super()
    // $id不可枚举，不可更改，不可配置
    Object.defineProperty(this, '$id', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: createId()
    })
    // $buffer不可枚举，不可配置
    Object.defineProperty(this, '$buffer', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: {}
    })
    const $format = (this.constructor as typeof Data).$format
    if ($format) {
      return $format(this)
    }
  }
  /**
   * 设置父数据,需要设置为不可枚举避免循环递归：主要针对微信小程序环境
   * @param {object} parent 父数据
   */
  $setParent(parent?: Data) {
    this.$buffer.parent = parent
  }
  /**
   * 获取父数据
   * @returns {object | undefined}
   */
  $getParent() {
    return this.$buffer.parent
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $syncData(self: boolean, act: string, ...args: unknown[]) {
    // 基本逻辑：当自身刷新成功后不冒泡，否则网上递归到顶层数据进行判断
  }
  $getId(prop = ''): string {
    return this.$id + prop
  }
  $getName(): string {
    return `CLASS:${super.$getName()}-ID:${this.$getId()}`
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $install(target: BaseData, from?: string) {
    //
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $uninstall(target: BaseData, from?: string) {
    this.$setParent()
  }
}

export default Data
