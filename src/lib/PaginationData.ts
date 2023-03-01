import { deepClone, getNum } from 'complex-utils'
import config from '../../config'
import BaseData from '../data/BaseData'
import { formatInitOption } from '../utils'
import DefaultData, { DefaultDataInitOption } from './../data/DefaultData'



type sizeObjectType = {
  change?: boolean,
  current: number,
  list?: string[]
}

type sizeType = boolean | number | sizeObjectType
type jumperType = boolean

export interface PaginationDataInitOptionObject extends DefaultDataInitOption {
  size?: sizeType
  jumper?: jumperType
  localOption?: Record<PropertyKey, any>
}

export type PaginationDataInitOption = undefined | true | PaginationDataInitOptionObject

class PaginationData extends DefaultData {
  static $name = 'PaginationData'
  page: {
    current: number,
    total: number
  }
  size: {
    change: boolean,
    current: number,
    list: string[]
  }
  jumper: {
    change: boolean
  }
  num: number
  $localOption: Record<PropertyKey, any>
  constructor (initOption?: PaginationDataInitOption) {
    initOption = formatInitOption(initOption) as PaginationDataInitOptionObject
    super(initOption)
    this.$triggerCreateLife('PaginationData', 'beforeCreate', initOption)
    this.page = {
      current: 1,
      total: 1
    }
    if (!initOption.size) {
      this.size = {
        change: true,
        current: config.PaginationData.size.current,
        list: deepClone(config.PaginationData.size.list)
      }
    } else {
      switch (typeof initOption.size) {
        case 'number':
          this.size = {
            change: true,
            current: initOption.size,
            list: [initOption.size.toString()]
          }
          break;
        case 'boolean':
          this.size = {
            change: initOption.size,
            current: config.PaginationData.size.current,
            list: deepClone(config.PaginationData.size.list)
          }
          break;
        default:
          this.size = {
            change: true,
            current: initOption.size.current,
            list: initOption.size.list ? initOption.size.list : [initOption.size.current.toString()]
          }
          break;
      }
    }
    this.jumper = {
      change: !!initOption.jumper
    }

    this.num = 0
    this.$localOption = initOption.localOption || {}
    this.$triggerCreateLife('PaginationData', 'created')
  }
  /**
   * 获取UI设置项
   * @returns {object}
   */
  getLocalOption() {
    return this.$localOption
  }
  /**
   * 计算页码相关数据
   */
  $autoCountPage (unCountCurrent?: boolean, untriggerLife?: boolean) {
    const total = getNum(this.getTotal() / this.getSize(), 'ceil', 0)
    this.page.total = total <= 0 ? 1 : total
    if (!unCountCurrent && this.getPage() > this.page.total) {
      this.setPage(this.page.total, untriggerLife)
    }
  }
  /**
   * 设置总数
   * @param {number} num 总数
   */
  setTotal(num: number, unCountCurrent?: boolean, untriggerLife?: boolean) {
    this.num = num < 0 ? 0 : num
    this.$autoCountPage(unCountCurrent, untriggerLife)
  }
  /**
   * 获取总数
   */
  getTotal(): number {
    return this.num
  }
  /**
   * 设置当前页
   * @param {number} current 当前页
   */
  setPage (current: number, untriggerLife?: boolean) {
    const totalPage = this.getTotalPage()
    if (current <= 0) {
      current = 1
    } else if (current > totalPage) {
      current = totalPage
    }
    if (this.page.current != current) {
      this.page.current = current
      if (!untriggerLife) {
        this.$triggerLife('change', this, 'page', current)
      }
    }
  }
  /**
   * 获取总页码
   * @returns {number}
   */
  getTotalPage (): number {
    return this.page.total
  }
  /**
   * 更改页面条数和页码
   * @param {number} size size参数
   * @param {number} page page参数
   */
  setSizeAndPage (current: { page: number, size: number }, untriggerLife?: boolean) {
    this.size.current = current.size
    this.$autoCountPage(true)
    this.setPage(current.page, true)
    if (!untriggerLife) {
      this.$triggerLife('change', this, 'size', current)
    }
  }
  /**
   * 更改页面条数
   * @param {number} size size参数
   */
  setSize(size: number, untriggerLife?: boolean) {
    this.size.current = size
    this.$autoCountPage(false, true)
    if (!untriggerLife) {
      this.$triggerLife('change', this, 'size', {
        size: size,
        page: this.getPage()
      })
    }
  }
  /**
   * 获取当前页
   * @returns {number}
   */
  getPage () {
    return this.page.current
  }
  /**
   * 获取当前size
   * @returns {number}
   */
  getSize () {
    return this.size.current
  }
  /**
   * 获取当前数据
   * @returns { page, size }
   */
  getCurrent (): { page: number, size: number } {
    return {
      page: this.getPage(),
      size: this.getSize()
    }
  }
  getData(): { page: number, size: number }
  getData(prop: 'page' | 'size' | 'num' | 'totalPage'): number
  getData(prop?: 'page' | 'size' | 'num' | 'totalPage') {
    let data
    if (prop == 'page') {
      data = this.getPage()
    } else if (prop == 'size') {
      data = this.getSize()
    } else if (prop == 'num') {
      data = this.getTotal()
    } else if (prop == 'totalPage') {
      data = this.getTotalPage()
    } else {
      data = this.getCurrent()
    }
    return data
  }
  /**
   * 重置
   */
  reset () {
    this.setTotal(0)
    this.setPage(1)
  }
  /**
   * 根据分页器从list中获取对应的数组
   * @param {*[]} list 需要解析的数组
   * @param {boolean} [unOrigin] 是否是当前分页器的数据源，为真则不是，此时不对分页器数据做修正
   * @returns {*[]}
   */
  formatList<T>(list: T[], unOrigin?: boolean): T[] {
    if (!unOrigin) {
      this.setTotal(list.length)
    }
    let current = this.getPage()
    const total = this.getTotalPage()
    if (!unOrigin && current > total) {
      this.setPage(total)
      current = total
    }
    const size = this.getSize()
    const start = (current - 1) * size
    const end = start + size
    return list.slice(start, end)
  }
  /**
   * 模块加载
   * @param {object} target 加载到的目标
   */
  $install (target: BaseData) {
    target.$onLife('beforeReload', {
      id: this.$getId('BeforeReload'),
      data: (instantiater, resetOption) => {
        let pageResetOption = resetOption.page
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
          if (pageResetOption.prop == 'page') {
            this.setPage(pageResetOption.data, pageResetOption.untriggerLife)
          } else if (pageResetOption.prop == 'size') {
            this.setSize(pageResetOption.data, pageResetOption.untriggerLife)
          } else if (pageResetOption.prop == 'sizeAndPage') {
            this.setSizeAndPage(pageResetOption.data, pageResetOption.untriggerLife)
          }
        }
      }
    })
    target.$onLife('reseted', {
      id: this.$getId('Reseted'),
      data: (instantiater, resetOption) => {
        if (target.$parseResetOption(resetOption, 'pagination') !== false) {
          this.reset()
        }
      }
    })
    this.$onLife('change', {
      id: target.$getId('PaginationChange'),
      data: (instantiater, prop, current) => {
        target.$triggerLife('paginationChange', instantiater, prop, current)
      }
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
  $uninstall(target: BaseData) {
    target.$offLife('beforeReload', this.$getId('BeforeReload'))
    target.$offLife('reseted', this.$getId('Reseted'))
    this.$offLife('change', target.$getId('PaginationChange'))
  }
}

export default PaginationData
