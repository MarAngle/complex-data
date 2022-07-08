import $func from 'complex-func'
import { consoleType, exportOption } from 'complex-func/src/data/utils/exportMsg'

let id = 0

function createId(): string {
  id++
  return id.toString()
}

class Data {
  readonly $id!: string
  $install?: (parent?: Data) => void
  $uninstall?: (parent?: Data) => void
  constructor() {
    Object.defineProperty(this, '$id', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: createId()
    })
  }
  $getId (prop = ''): string {
    return this.$id + prop
  }
  /**
   * 获取名称
   * @returns {string}
   */
  $selfName(): string {
    return `CLASS:${this.constructor.$name}-ID:${this.$getId()}`
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
  toString ():string {
    return this.$selfName()
  }
}

Data.$name = 'Data'

export default Data
