import { Life, upperCaseFirstChar } from 'complex-utils'
import type { DataWithLife, LifeInitOption } from 'complex-utils/src/class/Life'
import type { LifeValueInitOptionWithExtra } from 'complex-utils/src/class/LifeData'
import type { BufferType } from './Data'
import SimpleData from './SimpleData'
import type { SimpleDataInitOption } from './SimpleData'
import StorageValue from '../lib/StorageValue'
import type { DataWithStorage, StorageValueInitOption } from '../lib/StorageValue'

export interface DefaultDataInitOption extends SimpleDataInitOption {
  prop?: string
  life?: LifeInitOption
  storage?: StorageValueInitOption
}

export interface DefaultBufferType extends BufferType {
  create: Record<string, undefined | boolean>
}

class DefaultData<Buffer extends DefaultBufferType = DefaultBufferType> extends SimpleData<Buffer> implements DataWithLife, DataWithStorage {
  static $name = 'DefaultData'
  static $formatConfig = { name: 'DefaultData', level: 40, recommend: true }
  $prop: string
  $life!: Life
  $storage?: StorageValue
  constructor(initOption: DefaultDataInitOption) {
    super(initOption)
    this._buffer.create = {}
    this.$prop = initOption.prop || ''
    Object.defineProperty(this, '$life', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: new Life(initOption.life)
    })
    this._triggerCreateLife('DefaultData', false, initOption)
    if (initOption.storage) {
      this.$storage = new StorageValue(initOption.storage, this._getProp())
      this.$storage.push('extra', {
        init: (value) => {
          this.$extra = { ...value, ...this.$extra }
        },
        save: () => this.$extra
      })
      this.onLife('created', {
        handler: () => this.$storage!.init(this)
      })
    }
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
    const name = this._getConstructorName()
    if (env === name) {
      // 当前环境是对应触发的类的环境时，触发独立的创建生命周期
      this.triggerLife(lifeName, this, ...args)
      this._buffer.create[lifeName] = isCreate
    }
    const lifeNameWithData = env + upperCaseFirstChar(lifeName)
    // 触发带类名称的创建生命周期
    this.triggerLife(lifeNameWithData, this, ...args)
    this._buffer.create[lifeNameWithData] = isCreate
  }
  $onCreatedLife(createdLifeName: string, handler: LifeValueInitOptionWithExtra['handler']) {
    return this.$life.on(createdLifeName, { handler: handler, immediate: this._buffer.create[createdLifeName] })
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
    return this.$life.emit(...args)
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
    return this.$life.trigger(...args)
  }
  /**
   * 清除生命周期
   * @param {string} name 生命周期
   */
  clearLife(...args: Parameters<Life['clear']>) {
    return this.$life.clear(...args)
  }
  /**
   * 生命周期重置
   */
  resetLife() {
    return this.$life.reset()
  }
  /**
   * 生命周期销毁
   */
  destroyLife() {
    return this.$life.destroy()
  }
  saveStorage() {
    if (this.$storage) {
      this.triggerLife('beforeSaveStorage', this)
      this.$storage.save()
      this.triggerLife('saveStoraged', this)
    }
  }
  _getProp() {
    return `${this._getConstructorName}-${this.$prop}`
  }
  _getName(): string {
    return `[${super._getName()}-(${this.$prop})]`
  }
}

export default DefaultData
