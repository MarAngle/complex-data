import _func from 'complex-func'
import SimpleData from './SimpleData'
import LifeData from './../mod/LifeData'

class DefaultData extends SimpleData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super(initOption)
    this.$life = new LifeData(initOption.life)
    this.triggerCreateLife('DefaultData', 'beforeCreate', initOption)
    this.data = initOption.data || {}
    this.triggerCreateLife('DefaultData', 'created', initOption)
  }
  /**
   * 触发创造生命周期
   * @param {string} env 当前调用对象名称
   * @param {string} lifeName 生命周期
   * @param  {*[]} args 参数
   */
  triggerCreateLife(env, lifeName, ...args) {
    return this.$life.triggerCreate(env, this.constructor.$name, lifeName, this, ...args)
  }
  /**
   * 设置生命周期回调函数
   * @param {string} name 对应生命周期
   * @param {*} data 回调对象
   * @returns {string | string} id/idList
   */
  onLife (name, data) {
    return this.$life.on(name, data)
  }
  /**
   * 触发生命周期指定id函数
   * @param {string} name 生命周期
   * @param {string} id 指定ID
   * @param  {...any} args 参数
   */
  emitLife (name, id, ...args) {
    this.$life.emit(name, id, ...args)
  }
  /**
   * 删除生命周期指定函数
   * @param {string} name 生命周期
   * @param {string} id 指定ID
   * @returns {boolean}
   */
  offLife (name, id) {
    this.$life.off(name, id)
  }
  /**
   * 触发生命周期
   * @param {string} name 生命周期
   * @param  {...any} args 参数
   */
  triggerLife (name, ...args) {
    this.$life.trigger(name, ...args)
  }
  /**
   * 清除生命周期
   * @param {string} name 生命周期
   */
  clearLife (name) {
    this.$life.clear(name)
  }
  /**
   * 生命周期重置
   */
  resetLife () {
    this.$life.reset()
  }
  /**
   * 生命周期销毁
   */
  destroyLife () {
    this.$life.destroy()
  }
}

DefaultData.$name = 'DefaultData'

export default DefaultData
