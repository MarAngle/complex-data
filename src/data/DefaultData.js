import _func from 'complex-func'
import SimpleData from './SimpleData'
import ModuleData from './../mod/ModuleData'
import LifeData from './../mod/LifeData'

class DefaultData extends SimpleData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super(initOption)
    this.$module = new ModuleData({
      life: new LifeData(initOption.life)
    })
    this.triggerCreateLife('DefaultData', 'beforeCreate', initOption)
    this.triggerCreateLife('DefaultData', 'created', initOption)
  }
  /**
   * 设置模块
   * @param {string} modName 模块名
   * @param {object} data 模块实例
   */
  setModule(modName, data) {
    this.$module.setData(modName, data)
  }
  /**
   * 加载模块
   * @param {string} modName 模块名
   * @param {object} data 模块实例
   */
  installModule(modName, data) {
    return this.$module.installData(modName, data)
  }
  /**
   * 卸载模块
   * @param {string} modName 模块名
   * @returns {object | undefined} 卸载的模块
   */
  uninstallModule(modName) {
    return this.$module.uninstallData(modName)
  }
  /**
   * 触发创造生命周期
   * @param {string} env 当前调用对象名称
   * @param {string} lifeName 生命周期
   * @param  {*[]} args 参数
   */
  triggerCreateLife(env, lifeName, ...args) {
    return this.$module.life.triggerCreate(env, this.constructor.$name, lifeName, this, ...args)
  }
  /**
   * 设置生命周期回调函数
   * @param {string} name 对应生命周期
   * @param {*} data 回调对象
   * @returns {string | string} id/idList
   */
  onLife (name, data) {
    return this.$module.life.on(name, data)
  }
  /**
   * 触发生命周期指定id函数
   * @param {string} name 生命周期
   * @param {string} id 指定ID
   * @param  {...any} args 参数
   */
  emitLife (name, id, ...args) {
    this.$module.life.emit(name, id, ...args)
  }
  /**
   * 删除生命周期指定函数
   * @param {string} name 生命周期
   * @param {string} id 指定ID
   * @returns {boolean}
   */
  offLife (name, id) {
    this.$module.life.off(name, id)
  }
  /**
   * 触发生命周期
   * @param {string} name 生命周期
   * @param  {...any} args 参数
   */
  triggerLife (name, ...args) {
    this.$module.life.trigger(name, ...args)
  }
  /**
   * 清除生命周期
   * @param {string} name 生命周期
   */
  clearLife (name) {
    this.$module.life.clear(name)
  }
  /**
   * 生命周期重置
   */
  resetLife () {
    this.$module.life.reset()
  }
  /**
   * 生命周期销毁
   */
  destroyLife () {
    this.$module.life.destroy()
  }
}

DefaultData.$name = 'DefaultData'

export default DefaultData
