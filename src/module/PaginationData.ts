import { getNum } from 'complex-utils'
import DefaultData, { DefaultDataInitOption } from '../data/DefaultData'
import BaseData from '../data/BaseData'
import AttrsValue, { AttrsValueInitOption } from '../lib/AttrsValue'
import ForceValue from '../lib/ForceValue'
import { renderType } from '../type'

export interface PaginationDataInitOption extends DefaultDataInitOption {
  size?: boolean | number | {
    show?: boolean
    data: number
    list?: number[]
  }
  jumper?: boolean
  simple?: boolean
  attrs?: AttrsValueInitOption
  renders?: Record<string, undefined | renderType>
}

class PaginationData extends DefaultData {
  static $name = 'PaginationData'
  static $formatConfig = { name: 'Data:PaginationData', level: 50, recommend: true }
  static $option = {
    size: {
      show: true,
      data: 10,
      list: [10, 20, 50, 100]
    },
    jumper: {
      change: true
    }
  }
  count: number
  page: {
    data: number
    total: number
  }
  size: {
    show: boolean
    data: number
    list: number[]
  }
  jumper: boolean
  simple?: boolean
  $attrs?: AttrsValue
  $renders?: Record<string, undefined | renderType>
  constructor(initOption: PaginationDataInitOption = {}) {
    super(initOption)
    this._triggerCreateLife('PaginationData', false, initOption)
    this.page = {
      data: 1,
      total: 1
    }
    this.count = 0
    if (initOption.size === undefined) {
      this.size = {
        show: PaginationData.$option.size.show,
        data: PaginationData.$option.size.data,
        list: [ ...PaginationData.$option.size.list ]
      }
    } else if (initOption.size === true || initOption.size === false) {
      this.size = {
        show: initOption.size,
        data: PaginationData.$option.size.data,
        list: [ ...PaginationData.$option.size.list ]
      }
    } else if (typeof initOption.size === 'number') {
      this.size = {
        show: true,
        data: initOption.size,
        list: [ initOption.size ]
      }
    } else {
      this.size = {
        show: true,
        data: initOption.size.data,
        list: initOption.size.list ? initOption.size.list : [initOption.size.data]
      }
    }
    this.jumper = !!initOption.jumper
    this.simple = initOption.simple
    this.$attrs = initOption.attrs ? new AttrsValue(initOption.attrs) : undefined
    this.$renders = initOption.renders
    this._triggerCreateLife('PaginationData', true)
  }
  /**
   * 设置总数
   * @param {number} num 总数
   */
  setCount(num: number, unCountCurrent?: boolean, unTriggerCurrentLife?: boolean) {
    this.count = num < 0 ? 0 : (num || 0)
    this._autoCountTotal(unCountCurrent, unTriggerCurrentLife)
    this.$syncData(true, 'setCount')
  }
  /**
   * 获取总数
   */
  getCount(): number {
    return this.count
  }
  /**
   * 计算页码相关数据
   */
  protected _autoCountTotal(unCountCurrent?: boolean, unTriggerCurrentLife?: boolean) {
    const total = getNum(this.getCount() / this.getSize(), 'ceil', 0)
    this.page.total = total < 1 ? 1 : total
    if (!unCountCurrent && this.getPage() > this.page.total) {
      this.setPage(this.page.total, unTriggerCurrentLife)
    }
    this.$syncData(true, '_autoCountTotal')
  }
  /**
   * 获取总页码
   * @returns {number}
   */
  getTotal(): number {
    return this.page.total
  }
  /**
   * 设置当前页
   * @param {number} current 当前页
   */
  setPage(current: number, unTriggerCurrentLife?: boolean) {
    const total = this.getTotal()
    if (current < 1) {
      current = 1
    } else if (current > total) {
      current = total
    }
    if (this.page.data !== current) {
      this.page.data = current
      this.$syncData(true, 'setPage')
      if (!unTriggerCurrentLife) {
        this.triggerLife('change', this, 'current', current)
      }
    }
  }
  /**
   * 获取当前页
   * @returns {number}
   */
  getPage() {
    return this.page.data
  }
  /**
   * 更改页面条数
   * @param {number} size size参数
   */
  setSize(size: number, unCountCurrent?: boolean, unTriggerSizeLife?: boolean) {
    this.size.data = size
    this._autoCountTotal(unCountCurrent, true)
    if (!unTriggerSizeLife) {
      this.triggerLife('change', this, 'size', {
        size: size,
        page: this.getPage()
      })
    }
    this.$syncData(true, 'setSize')
  }
  /**
   * 获取当前size
   * @returns {number}
   */
  getSize() {
    return this.size.data
  }
  /**
   * 更改页面条数和页码
   * @param {number} size size参数
   * @param {number} page page参数
   */
  setPageAndSize(data: { page: number, size: number }, unTriggerCurrentAndSizeLife?: boolean) {
    this.setSize(data.size, true)
    this.setPage(data.page)
    if (!unTriggerCurrentAndSizeLife) {
      this.triggerLife('change', this, 'currentAndSize', data)
    }
  }
  /**
   * 根据分页器从list中获取对应的数组
   * @param {*[]} list 需要解析的数组
   * @param {boolean} [unOrigin] 是否是当前分页器的数据源，为真则不是，此时不对分页器数据做修正
   * @returns {*[]}
   */
  formatList<T>(list: T[], unOrigin?: boolean): T[] {
    if (!unOrigin) {
      this.setCount(list.length)
    }
    let page = this.getPage()
    const total = this.getTotal()
    if (!unOrigin && page > total) {
      this.setPage(total)
      page = total
    }
    const size = this.getSize()
    const start = (page - 1) * size
    const end = start + size
    return list.slice(start, end)
  }
  reset(option?: boolean) {
    if (option !== false) {
      this.setCount(0, true)
      this.setPage(1)
    }
  }
  destroy(option?: boolean) {
    if (option !== false) {
      this.reset(option)
    }
  }
  /**
   * 模块加载
   * @param {object} target 加载到的目标
   */
  $install(target: BaseData) {
    super.$install(target)
    target.onLife('beforeReload', {
      id: this.$getId('BeforeReload'),
      data: (instantiater, force: ForceValue) => {
        let pageResetOption = force.module.pagination
        if (pageResetOption) {
          if (pageResetOption === true) {
            pageResetOption = {
              prop: 'page',
              data: 1,
              untriggerLife: true
            }
          }
          if (pageResetOption.untriggerLife === undefined) {
            pageResetOption.untriggerLife = true
          }
          if (pageResetOption.prop === 'page') {
            this.setPage(pageResetOption.data, pageResetOption.untriggerLife)
          } else if (pageResetOption.prop === 'size') {
            this.setSize(pageResetOption.data, pageResetOption.untriggerLife)
          } else if (pageResetOption.prop === 'pageAndSize') {
            this.setPageAndSize(pageResetOption.data, pageResetOption.untriggerLife)
          }
        }
      }
    })
    // target.onLife('reseted', {
    //   id: this.$getId('Reseted'),
    //   data: (instantiater, resetOption) => {
    //     if (target.$parseResetOption(resetOption, 'pagination') !== false) {
    //       this.reset()
    //     }
    //   }
    // })
    this.onLife('change', {
      id: target.$getId('PaginationChange'),
      data: (instantiater, prop, current) => {
        target.triggerLife('paginationChange', instantiater, prop, current)
      }
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
  $uninstall(target: BaseData) {
    super.$uninstall(target)
    target.offLife('beforeReload', this.$getId('BeforeReload'))
    // target.offLife('reseted', this.$getId('Reseted'))
    this.offLife('change', target.$getId('PaginationChange'))
  }
}

export default PaginationData
