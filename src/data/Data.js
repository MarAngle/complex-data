import _func from 'complex-func'

let id = 0

function createId() {
  id++
  return id.toString()
}

class Data {
  constructor() {
    this.$id = createId()
  }
  $getId (prop = '') {
    return this.$id + prop
  }
  /**
   * 获取名称
   * @returns {string}
   */
  $selfName() {
    return `CLASS:${this.constructor.$name}-ID:${this.$getId()}`
  }
  /**
   * 创建输出信息
   * @param {string} content 需要输出的信息
   * @returns {string}
   */
  $createMsg (content) {
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
  $exportMsg (content, type = 'error', option) {
    content = this.$createMsg(content)
    _func.printMsgAct(content, type, option)
  }
  toString () {
    return this.$selfName()
  }
}

Data.$name = 'Data'

export default Data
