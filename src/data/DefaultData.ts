import SimpleData, { SimpleDataInitOption } from './SimpleData'
import LifeData, { LifeDataInitOption } from './../mod/LifeData'
import { FuncDataItem } from '../mod/FuncData'
import { formatInitOption } from '../utils'
import { objectAny } from '../../ts'

export interface DefaultDataInitOption extends SimpleDataInitOption {
  life?: LifeDataInitOption,
  data?: objectAny
}


class DefaultData extends SimpleData {
  $life: LifeData;
  data: objectAny;
  constructor (initOption: DefaultDataInitOption) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$life = new LifeData(initOption.life)
    this.$triggerCreateLife('DefaultData', 'beforeCreate', initOption)
    this.data = initOption.data || {}
    this.$triggerCreateLife('DefaultData', 'created', initOption)
  }
  /**
   * 触发创造生命周期
   * @param {string} env 当前调用对象名称
   * @param {string} lifeName 生命周期
   * @param  {*[]} args 参数
   */
  $triggerCreateLife(env: string, lifeName: string, ...args: any[]) {
    return this.$life.$triggerCreate(env, this.constructor.$name!, lifeName, this, ...args)
  }
  /**
   * 设置生命周期回调函数
   * @param {string} name 对应生命周期
   * @param {*} data 回调对象
   * @returns {string | string} id/idList
   */
  $onLife (name: string, data: FuncDataItem | FuncDataItem[]) {
    return this.$life.on(name, data)
  }
  /**
   * 触发生命周期指定id函数
   * @param {string} name 生命周期
   * @param {string} id 指定ID
   * @param  {...any} args 参数
   */
  $emitLife (name: string, id: string, ...args: any[]) {
    this.$life.emit(name, id, ...args)
  }
  /**
   * 删除生命周期指定函数
   * @param {string} name 生命周期
   * @param {string} id 指定ID
   * @returns {boolean}
   */
  $offLife (name: string, id: string): boolean {
    return this.$life.off(name, id)
  }
  /**
   * 触发生命周期
   * @param {string} name 生命周期
   * @param  {...any} args 参数
   */
  $triggerLife (name: string, ...args: any[]) {
    this.$life.trigger(name, ...args)
  }
  /**
   * 清除生命周期
   * @param {string} name 生命周期
   */
  $clearLife (name: string) {
    this.$life.clear(name)
  }
  /**
   * 生命周期重置
   */
  $resetLife () {
    this.$life.reset()
  }
  /**
   * 生命周期销毁
   */
  $destroyLife () {
    this.$life.destroy()
  }
}

DefaultData.$name = 'DefaultData'

export default DefaultData
