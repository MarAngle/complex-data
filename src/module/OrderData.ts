import Data from './../data/Data'
import BaseData from '../data/BaseData'
import ForceValue from '../lib/ForceValue'

export interface OrderDataInitOption {
  prop: PropertyKey[]
}

export type orderType = undefined | 'asc' | 'desc'

export type orderDataType = {
  prop: undefined | PropertyKey
  value: orderType
}

class OrderData extends Data {
  static $name = 'OrderData'
  static $formatConfig = { name: 'OrderData', level: 50, recommend: true }
  prop: PropertyKey[]
  data: orderDataType
  constructor (initOption: OrderDataInitOption) {
    super()
    this.prop = initOption.prop
    this.data = {
      prop: undefined,
      value: undefined
    }
  }
  setData(prop: PropertyKey, value: orderType) {
    this.data.prop = prop
    this.data.value = value
  }
  reset() {
    this.data.prop = undefined
    this.data.value = undefined
  }
  /**
   * 模块加载
   * @param {object} target 加载到的目标
   */
  _install (target: BaseData) {
    super._install(target)
    target.$onCreatedLife('BaseDataCreated', () => {
      target.onLife('beforeReload', {
        id: this._getId('BeforeReload'),
        handler: (_lifeValue, _instantiater, force: ForceValue) => {
          if (force.module.order === true) {
            this.reset()
          }
        }
      })
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
  _uninstall(target: BaseData) {
    super._uninstall(target)
    target.offLife('beforeReload', this._getId('BeforeReload'))
  }
}

export default OrderData
