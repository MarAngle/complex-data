import _func from 'complex-func'
import DefaultData from './DefaultData'
import LifeData from './../mod/LifeData'

class DefaultDataWithLife extends DefaultData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super(initOption)
    this.setModule('life', new LifeData(initOption.life))
    this.$triggerCreateLife('DefaultDataWithLife', 'beforeCreate', initOption)
    this.$triggerCreateLife('DefaultDataWithLife', 'created')
  }
  /* --生命周期函数-- */
  /**
   * 设置生命周期回调函数
   * @param {string} name 对应生命周期
   * @param {*} data 回调对象
   * @returns {string | string} id/idList
   */
  onLife (name, data) {
    return this.getModule('life').on(name, data)
  }
  /**
   * 触发生命周期指定id函数
   * @param {string} name 生命周期
   * @param {string} id 指定ID
   * @param  {...any} args 参数
   */
  emitLife (name, id, ...args) {
    this.getModule('life').emit(name, id, ...args)
  }
  /**
   * 删除生命周期指定函数
   * @param {string} name 生命周期
   * @param {string} id 指定ID
   * @returns {boolean}
   */
  offLife (name, id) {
    this.getModule('life').off(name, id)
  }
  /**
   * 触发创造生命周期
   * @param {string} env 当前调用对象名称
   * @param {string} lifeName 生命周期
   * @param  {*[]} args 参数
   */
  $triggerCreateLife (env, lifeName, ...args) {
    if (!env) {
      this.$exportMsg('$triggerCreateLife函数需要传递env参数')
    }
    if (env != this.constructor.$name) {
      lifeName = env + lifeName.charAt(0).toUpperCase() + lifeName.slice(1)
    }
    this.triggerLife(lifeName, this, ...args)
  }
  /**
   * 触发生命周期
   * @param {string} name 生命周期
   * @param  {...any} args 参数
   */
  triggerLife (name, ...args) {
    this.getModule('life').trigger(name, ...args)
  }
  /**
   * 清除生命周期
   * @param {string} name 生命周期
   */
  clearLife (name) {
    this.getModule('life').clear(name)
  }
  /**
   * 生命周期重置
   */
  resetLife () {
    this.getModule('life').reset()
  }
  /**
   * 生命周期销毁
   */
  destroyLife () {
    this.getModule('life').destroy()
  }
}

DefaultDataWithLife.$name = 'DefaultDataWithLife'

export default DefaultDataWithLife
