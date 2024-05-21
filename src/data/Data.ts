import { _Data } from 'complex-utils'
import BaseData from './BaseData'

let id = 0

function createId(): string {
  id++
  return id.toString()
}

export interface BufferType {
  parent?: Data<any>
}

export type formatInitOptionType<D> = (initOption: D, ...args: any[]) => D

class Data<Buffer extends BufferType = BufferType> extends _Data {
  static $name = 'Data'
  static $formatConfig = { name: 'Data', level: 20, recommend: false }
  static $formatInitOption = undefined as undefined | formatInitOptionType<any>
  readonly _id!: string
  _buffer!: Buffer
  constructor() {
    super()
    // _id不可枚举，不可更改，不可配置
    Object.defineProperty(this, '_id', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: createId()
    })
    // _buffer不可枚举，不可配置
    Object.defineProperty(this, '_buffer', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: {}
    })
  }
  /**
   * 设置父数据,需要设置为不可枚举避免循环递归：主要针对微信小程序环境
   * @param {object} parent 父数据
   */
  $setParent(parent?: Data) {
    this._buffer.parent = parent
  }
  /**
   * 获取父数据
   * @returns {object | undefined}
   */
  $getParent() {
    return this._buffer.parent
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _syncData(_self: boolean, _act: string, ..._args: unknown[]) {
    // 基本逻辑：当自身刷新成功后不冒泡，否则网上递归到顶层数据进行判断
  }
  _getId(prop = ''): string {
    return this._id + prop
  }
  _getName(): string {
    return `${super._getName()}-${this._getId()}`
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _install(_target: BaseData, _from?: string) {
    //
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _uninstall(_target: BaseData, _from?: string) {
    this.$setParent()
  }
}

export default Data
