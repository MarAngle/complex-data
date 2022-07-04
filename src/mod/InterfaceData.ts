import $func from 'complex-func'
import { baseObject, objectUnknown } from '../../ts'
import Data from './../data/Data'


export type mapFunction<D> = (data: baseObject<D>, prop: string) => void

export type InterfaceDataInitOption<D> = D | baseObject<D>


class InterfaceData<D> extends Data {
  init: boolean
  data: baseObject<D | undefined>
  constructor (initOption?: InterfaceDataInitOption<D | undefined>) {
    super()
    this.init = false
    this.data = {
      default: undefined
    }
    this.$initMain(initOption)
  }
  /**
   * 加载
   * @param {*} initOption 参数
   */
  $initMain (initOption?: InterfaceDataInitOption<D | undefined>) {
    if (initOption !== undefined) {
      const type = $func.getType(initOption)
      if (type !== 'object') {
        this.setData('default', initOption as D)
      } else {
        for (const n in (initOption as baseObject<D>)) {
          this.setData(n, (initOption as baseObject<D>)[n])
        }
      }
      this.init = true
    }
  }
  /**
   * 是否加载
   * @returns {boolean}
   */
  isInit() {
    return this.init
  }
  /**
   * 设置属性值
   * @param {string} prop 属性
   * @param {*} data 值
   */
  setData (prop: string, data: D, useSetData?: boolean) {
    if (useSetData === undefined) {
      this.data[prop] = data
    } else {
      $func.setProp(this.data, prop, data, useSetData)
    }
  }
  /**
   * 获取对应属性值，不存在对应属性或值则获取默认值
   * @param {string} [prop] 属性值
   * @returns {*}
   */
  getData (prop?: string) {
    if (prop && this.data[prop] !== undefined) {
      return this.data[prop]
    }
    return this.data.default
  }
  /**
   * 获取整个数据对象
   * @returns {object}
   */
  getMain () {
    return this.data
  }
  /**
   * 对data属性调用fn方法
   * @param {function} fn 方法
   */
  map(fn: mapFunction<D | undefined>) {
    for (const n in this.data) {
      fn(this.data, n)
    }
  }
  toString (): string {
    const value = this.getData('default')
    const type = typeof value
    if (type == 'object' || type == 'function') {
      return (value as unknown as objectUnknown).toString()
    } else if (type != 'string') {
      return String(value)
    } else {
      return (value as unknown as string)
    }
  }
}

InterfaceData.$name = 'InterfaceData'

export default InterfaceData
