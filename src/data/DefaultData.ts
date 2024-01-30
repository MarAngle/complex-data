import { Life, upperCaseFirstChar } from 'complex-utils'
import { DataWithLife, LifeDataInitType, LifeInitOption } from 'complex-utils/src/class/Life'
import SimpleData, { SimpleDataInitOption } from './SimpleData'
import Data from './Data'

export interface DefaultDataInitOption extends SimpleDataInitOption {
  prop?: string
  life?: LifeInitOption
}

class DefaultData extends SimpleData implements DataWithLife {
  static $name = 'DefaultData'
  static $formatConfig = { name: 'DefaultData', level: 40, recommend: true }
  declare $buffer: {
    parent?: Data
    create: Record<string, undefined | boolean>
    [prop: string]: unknown
  }
  $prop: string
  $life!: Life
  constructor(initOption: DefaultDataInitOption) {
    super(initOption)
    this.$buffer.create = {}
    this.$prop = initOption.prop || ''
    Object.defineProperty(this, '$life', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: new Life(initOption.life)
    })
    this._triggerCreateLife('DefaultData', false, initOption)
    this._triggerCreateLife('DefaultData', true, initOption)
  }
  /**
   * 触发创造生命周期
   * @param {string} env 当前调用对象名称
   * @param {string} lifeName 生命周期
   * @param  {*[]} args 参数
   */
  protected _triggerCreateLife(env: string, isCreate: boolean, ...args: unknown[]) {
    if (!env) {
      this.$exportMsg('$triggerCreate函数需要传递env参数')
    }
    const lifeName = isCreate ? 'created' : 'beforeCreate'
    const name = this.$getConstructorName()
    if (env === name) {
      // 当前环境是对应触发的类的环境时，触发独立的创建生命周期
      this.triggerLife(lifeName, this, ...args)
      this.$buffer.create[lifeName] = isCreate
    }
    const lifeNameWithData = env + upperCaseFirstChar(lifeName)
    // 触发带类名称的创建生命周期
    this.triggerLife(lifeNameWithData, this, ...args)
    this.$buffer.create[lifeNameWithData] = isCreate
  }
  $onCreatedLife(createdLifeName: string, data: LifeDataInitType['data']) {
    if (this.$buffer.create[createdLifeName]) {
      data(this)
    } else {
      return this.$life.on(createdLifeName, { data: data })
    }
  }
  /**
   * 设置生命周期回调函数
   * @param {string} name 对应生命周期
   * @param {*} data 回调对象
   * @returns {string | string} id/idList
   */
  onLife(...args: Parameters<Life['on']>) {
    return this.$life.on(...args)
  }
  /**
   * 触发生命周期指定id函数
   * @param {string} name 生命周期
   * @param {string} id 指定ID
   * @param  {...any} args 参数
   */
  emitLife(...args: Parameters<Life['emit']>) {
    this.$life.emit(...args)
  }
  /**
   * 删除生命周期指定函数
   * @param {string} name 生命周期
   * @param {string} id 指定ID
   * @returns {boolean}
   */
  offLife(...args: Parameters<Life['off']>): boolean {
    return this.$life.off(...args)
  }
  /**
   * 触发生命周期
   * @param {string} name 生命周期
   * @param  {...any} args 参数
   */
  triggerLife(...args: Parameters<Life['trigger']>) {
    this.$life.trigger(...args)
  }
  /**
   * 清除生命周期
   * @param {string} name 生命周期
   */
  clearLife(...args: Parameters<Life['clear']>) {
    this.$life.clear(...args)
  }
  /**
   * 生命周期重置
   */
  resetLife() {
    this.$life.reset()
  }
  /**
   * 生命周期销毁
   */
  destroyLife() {
    this.$life.destroy()
  }
  $getName(): string {
    return `[${super.$getName()}-(${this.$prop})]`
  }
}

export default DefaultData
