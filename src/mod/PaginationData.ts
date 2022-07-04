import $func from 'complex-func'
import config from '../../config'
import { objectAny } from '../../ts'
import BaseData from '../data/BaseData'
import { formatInitOption } from '../utils'
import DefaultData, { DefaultDataInitOption } from './../data/DefaultData'


type optionProps = {
  jumper?: boolean,
  size?: boolean
}

type sizeObjectType = {
  current: number,
  list?: string[]
}


type sizeType = number | sizeObjectType

export interface PaginationDataInitOptionObject extends DefaultDataInitOption {
  size?: sizeType,
  props?: optionProps,
  option?: objectAny
}


export type PaginationDataInitOption = undefined | true | PaginationDataInitOptionObject

class PaginationData extends DefaultData {
  page: {
    current: number,
    total: number
  }
  size: {
    current: number,
    list: string[]
  }
  num: {
    total: number
  }
  option: objectAny
  constructor (initOption?: PaginationDataInitOption) {
    initOption = formatInitOption(initOption) as PaginationDataInitOptionObject
    super(initOption)
    this.$triggerCreateLife('PaginationData', 'beforeCreate', initOption)
    this.page = {
      current: 1,
      total: 1
    }
    this.size = {
      current: config.PaginationData.size,
      list: []
    }
    this.num = {
      total: 0
    }
    this.option = {
      props: {}
    }
    this.$initSize(initOption.size)
    this.$initOption(initOption.props, initOption.option)
    this.$triggerCreateLife('PaginationData', 'created')
  }
  /**
   * 加载size
   * @param {number | object} [size] size设置项
   */
  $initSize(size?:sizeType) {
    if (!size) {
      this.size.current = config.PaginationData.size
      this.size.list = $func.deepClone(config.PaginationData.sizeList)
    } else {
      const sizeType = $func.getType(size)
      if (sizeType != 'object') {
        this.size.current = Number(size)
        this.size.list = [this.size.current.toString()]
      } else {
        this.size.current = Number((size as sizeObjectType).current)
        if (!this.size.list) {
          this.size.list = [this.size.current.toString()]
        } else {
          this.size.list = (size as sizeObjectType).list!
        }
      }
    }
  }
  /**
   * 加载UI设置项
   * @param {object} props
   * @param {object} option
   */
  $initOption(props:optionProps = {}, option: objectAny = {}) {
    if (!option.props) {
      option.props = {}
    }
    option.props = {
      showQuickJumper: props.jumper === undefined ? config.PaginationData.jumperChange : props.jumper,
      showSizeChanger: props.size === undefined ? config.PaginationData.sizeChange : props.size
    }
    this.option = {
      ...option
    }
  }
  /**
   * 获取UI设置项
   * @returns {object}
   */
  getOption() {
    return this.option
  }
  /**
   * 计算页码相关数据
   */
  $autoCountPage (unCountCurrent?: boolean, unTriggerLife?: boolean) {
    const total = $func.getNum(this.getTotal() / this.getSize(), 'ceil', 0)
    this.page.total = total <= 0 ? 1 : total
    if (!unCountCurrent && this.getPage() > this.page.total) {
      this.setPage(this.page.total, unTriggerLife)
    }
  }
  /**
   * 设置总数
   * @param {number} num 总数
   */
  setTotal(num: number, unCountCurrent?: boolean, unTriggerLife?: boolean) {
    this.num.total = num < 0 ? 0 : num
    this.$autoCountPage(unCountCurrent, unTriggerLife)
  }
  /**
   * 获取总数
   */
  getTotal(): number {
    return this.num.total
  }
  /**
   * 设置当前页
   * @param {number} current 当前页
   */
  setPage (current: number, unTriggerLife?: boolean) {
    const totalPage = this.getTotalPage()
    if (current <= 0) {
      current = 1
    } else if (current > totalPage) {
      current = totalPage
    }
    if (this.page.current != current) {
      this.page.current = current
      if (!unTriggerLife) {
        this.triggerLife('change', this, 'page', current)
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
  setSizeAndPage (current: { page: number, size: number }, unTriggerLife?: boolean) {
    this.size.current = current.size
    this.$autoCountPage(true)
    this.setPage(current.page, true)
    if (!unTriggerLife) {
      this.triggerLife('change', this, 'size', current)
    }
  }
  /**
   * 更改页面条数
   * @param {number} size size参数
   */
  setSize(size: number, unTriggerLife?: boolean) {
    this.size.current = size
    this.$autoCountPage(false, true)
    if (!unTriggerLife) {
      this.triggerLife('change', this, 'size', {
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
  getData(prop: 'page'): number
  getData(prop: 'size'): number
  getData(prop: 'num'): number
  getData(prop: 'totalPage'): number
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
  install (target: BaseData) {
    target.onLife('reseted', {
      id: this.$getId('Reseted'),
      data: (instantiater, resetOption) => {
        if (target.parseResetOption(resetOption, 'pagination') !== false) {
          this.reset()
        }
      }
    })
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
  uninstall(target: BaseData) {
    target.offLife('reseted', this.$getId('Reseted'))
    this.offLife('change', target.$getId('PaginationChange'))
  }
}

PaginationData.$name = 'PaginationData'

export default PaginationData
