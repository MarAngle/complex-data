import _func from 'complex-func'
import config from '../../config'
import DefaultDataWithLife from './../data/DefaultDataWithLife'

class PaginationData extends DefaultDataWithLife {
  constructor (initOption) {
    if (initOption === true) {
      initOption = {}
    }
    super(initOption)
    this.triggerCreateLife('PaginationData', 'beforeCreate', initOption)
    this.status = {
      init: false
    }
    this.data = {
      page: {
        current: 1,
        total: 1
      },
      size: {
        current: config.PaginationData.size,
        list: []
      },
      num: {
        total: 0
      }
    }
    this.option = {
      props: {}
    }
    this.initMain(initOption)
    this.triggerCreateLife('PaginationData', 'created')
  }
  /**
   * 加载
   * @param {*} initOption 参数
   */
  initMain (initOption) {
    if (initOption) {
      this.setInit(true)
      this.initSize(initOption.size)
      this.initOption(initOption.props, initOption.option)
    }
  }
  /**
   * 是否加载
   * @returns {boolean}
   */
  isInit() {
    return this.status.init
  }
  /**
   * 设置是否加载
   * @param {boolean} init 是否加载
   */
  setInit(init) {
    this.status.init = init
  }
  /**
   * 加载size
   * @param {number | object} [size] size设置项
   */
  initSize(size) {
    if (!size) {
      this.data.size.current = config.PaginationData.size
      this.data.size.list = _func.deepClone(config.PaginationData.sizeList)
    } else {
      let sizeType = _func.getType(size)
      if (sizeType != 'object') {
        this.data.size.current = Number(size)
        this.data.size.list = [this.data.size.current.toString()]
      } else {
        this.data.size.current = Number(size.current)
        if (!this.data.size.list) {
          this.data.size.list = [this.data.size.current.toString()]
        } else {
          this.data.size.list = size.list
        }
      }
    }
  }
  /**
   * 加载UI设置项
   * @param {object} props
   * @param {object} option
   */
  initOption(props = {}, option = {}) {
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
  autoCountPage (unCountCurrent, unTriggerLife) {
    let total = _func.getNum(this.getTotal() / this.getSize(), 'ceil', 0)
    this.data.page.total = total <= 0 ? 1 : total
    if (!unCountCurrent && this.getPage() > this.data.page.total) {
      this.setPage(this.data.page.total, unTriggerLife)
    }
  }
  /**
   * 设置总数
   * @param {number} num 总数
   */
  setTotal(num, unCountCurrent, unTriggerLife) {
    this.data.num.total = num < 0 ? 0 : num
    this.autoCountPage(unCountCurrent, unTriggerLife)
  }
  /**
   * 获取总数
   */
  getTotal() {
    return this.data.num.total
  }
  /**
   * 设置当前页
   * @param {number} current 当前页
   */
  setPage (current, unTriggerLife) {
    let totalPage = this.getTotalPage()
    if (current <= 0) {
      current = 1
    } else if (current > totalPage) {
      current = totalPage
    }
    if (this.data.page.current != current) {
      this.data.page.current = current
      if (!unTriggerLife) {
        this.triggerLife('change', this, 'page', current)
      }
    }
  }
  /**
   * 获取总页码
   * @returns {number}
   */
  getTotalPage () {
    return this.data.page.total
  }
  /**
   * 更改页面条数和页码
   * @param {number} size size参数
   * @param {number} page page参数
   */
  setSizeAndPage (current, unTriggerLife) {
    this.data.size.current = current.size
    this.autoCountPage(true)
    this.setPage(current.page, true)
    if (!unTriggerLife) {
      this.triggerLife('change', this, 'size', current)
    }
  }
  /**
   * 更改页面条数
   * @param {number} size size参数
   */
  setSize(size, unTriggerLife) {
    this.data.size.current = size
    this.autoCountPage(false, true)
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
    return this.data.page.current
  }
  /**
   * 获取当前size
   * @returns {number}
   */
  getSize () {
    return this.data.size.current
  }
  /**
   * 获取当前数据
   * @returns { page, size }
   */
  getCurrent () {
    return {
      page: this.getPage(),
      size: this.getSize()
    }
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
  formatList(list, unOrigin) {
    if (!unOrigin) {
      this.setTotal(list.length)
    }
    let current = this.getPage()
    let total = this.getTotalPage()
    if (!unOrigin && current > total) {
      this.setPage(total)
      current = total
    }
    let size = this.getSize()
    let start = (current - 1) * size
    let end = start + size
    return list.slice(start, end)
  }
  /**
   * 模块加载
   * @param {object} target 加载到的目标
   */
  install (target) {
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
  uninstall(target) {
    target.offLife('reseted', this.$getId('Reseted'))
    this.offLife('change', target.$getId('PaginationChange'))
  }
}

PaginationData._name = 'PaginationData'

export default PaginationData
