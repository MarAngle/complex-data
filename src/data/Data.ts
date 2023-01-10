/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import $func from 'complex-func'
import { consoleType, exportOption } from 'complex-func/src/data/utils/exportMsg'
import BaseData from './BaseData'

let id = 0

function createId(): string {
  id++
  return id.toString()
}

class Data {
  readonly $id!: string
  static $name = 'Data'
  constructor() {
    Object.defineProperty(this, '$id', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: createId()
    })
  }
  $syncData(...args: any[]) {}
  $getId (prop = ''): string {
    return this.$id + prop
  }
  $getClassName() {
    return (this.constructor as any).$name as string
  }
  /**
   * 获取名称
   * @returns {string}
   */
  $selfName(): string {
    return `CLASS:${this.$getClassName()}-ID:${this.$getId()}`
  }
  /**
   * 创建输出信息
   * @param {string} content 需要输出的信息
   * @returns {string}
   */
  $createMsg (content: string): string {
    return `${this.$selfName()}:${content}`
  }
  /**
   * 警告信息输出
   * @param {string} content 需要输出的信息
   * @param {"error" | "warn" | "log"} type 输出格式
   * @param {object} [option = {}] 设置项
   * @param {string} [option.data] 设置项
   * @param {'error' | 'warn' | 'log'} [option.type] 设置项
   */
  $exportMsg (content: string, type: consoleType = 'error', option?: exportOption) {
    $func.exportMsg(this.$createMsg(content), type, option)
  }
  $install (target: BaseData) {}
  $uninstall (target: BaseData) {}
  toString ():string {
    return this.$selfName()
  }
}

export default Data
