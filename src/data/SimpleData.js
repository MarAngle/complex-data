import _func from 'complex-func'
import install from './../utils/install'

class SimpleData {
  constructor() {
    this.$id = install.getId(this.constructor.$name)
  }
  /**
   * 创建输出信息
   * @param {string} content 需要输出的信息
   * @returns {string}
   */
  $createMsg (content) {
    return `${this._selfName()}:${content}`
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
    _func.exportMsg(content, type, option)
  }
  /**
   * 获取名称
   * @returns {string}
   */
  _selfName () {
    return `[CLASS:${this.constructor.$name}]`
  }
  toString () {
    return this._selfName()
  }
  /**
   * 获取模块ID
   * @param {string} data 字符串后缀
   * @returns {string}
   */
  $getId (data = '') {
    return this.$id + data
  }
}

SimpleData.$name = 'SimpleData'

export default SimpleData
