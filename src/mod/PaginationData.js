import _func from 'complex-func'
import config from '../config'
import SimpleData from './../data/SimpleData'

class PaginationData extends SimpleData {
  constructor (initdata) {
    super()
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
    this.initMain(initdata)
  }
  /**
   * 加载
   * @param {*} initdata 参数
   */
  initMain (initdata) {
    if (initdata) {
      if (initdata === true) {
        initdata = {}
      }
      this.setInit(true)
      this.initSize(initdata.size)
      this.initOption(initdata.props, initdata.option)
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
   * 计算总页码
   */
  countTotalPage () {
    let total = _func.getNum(this.data.num.total / this.data.size.current, 'ceil', 0)
    this.data.page.total = total <= 0 ? 1 : total
  }
  /**
   * 设置总数
   * @param {number} num 总数
   */
  setTotal(num) {
    this.data.num.total = num < 0 ? 0 : num
    this.countTotalPage()
  }
  /**
   * 设置当前页
   * @param {number} current 当前页
   */
  setPage (current) {
    this.data.page.current = current <= 0 ? 1 : current
  }
  /**
   * 获取总页码
   * @returns {number}
   */
  getTotalPage () {
    return this.data.page.total
  }
  /**
   * 更改页面条数
   * @param {object} option 参数
   * @param {number} option.page page参数
   * @param {number} option.size size参数
   */
  setSize ({ page, size }) {
    this.setPage(page)
    this.data.size.current = size
    this.countTotalPage()
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
   * 模块加载
   * @param {object} target 加载到的目标
   */
  install (target) {
    target.onLife('reseted', {
      id: this.$getModuleId('Reseted'),
      data: (resetOption) => {
        if (target.parseResetOption(resetOption, 'pagination') !== false) {
          this.reset()
        }
      }
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
  uninstall(target) {
    target.offLife('reseted', this.$getModuleId('Reseted'))
  }
}

export default PaginationData
