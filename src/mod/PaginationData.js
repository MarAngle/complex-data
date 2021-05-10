import _func from 'complex-func'
import SimpleData from './../data/SimpleData'

let defaultdata = {
  size: {
    current: 8,
    list: ['8', '20', '50', '100']
  }
}

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
        current: 8,
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
  isInit() {
    return this.status.init
  }
  setInit(init) {
    this.status.init = init
  }
  initSize(size) {
    if (!size) {
      this.data.size.current = defaultdata.size.current
      this.data.size.list = _func.deepClone(defaultdata.size.list)
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
  initOption(props = {}, option = {}) {
    if (!option.props) {
      option.props = {}
    }
    option.props = {
      showQuickJumper: props.jumper === undefined ? true : props.jumper,
      showSizeChanger: props.size === undefined ? true : props.size
    }
    this.option = {
      ...option
    }
  }
  getOption() {
    return this.option
  }
  // 计算总页码
  countTotalPage () {
    let total = _func.getNum(this.data.num.total / this.data.size.current, 'ceil', 0)
    this.data.page.total = total <= 0 ? 1 : total
  }
  setTotal(num) {
    this.data.num.total = num < 0 ? 0 : num
    this.countTotalPage()
  }
  // 设置当前页
  setPage (current) {
    this.data.page.current = current <= 0 ? 1 : current
  }
  // 获取总页码
  getTotalPage () {
    return this.data.page.total
  }
  // 更改页面条数
  setSize ({ page, size }) {
    this.setPage(page)
    this.data.size.current = size
    this.countTotalPage()
  }
  // 获取当前页
  getPage () {
    return this.data.page.current
  }
  // 获取当前size
  getSize () {
    return this.data.size.current
  }
  // 获取当前数据
  getCurrent () {
    return {
      page: this.getPage(),
      size: this.getSize()
    }
  }
  // 重置
  reset () {
    this.setTotal(0)
    this.setPage(1)
  }
  install (target) {
    target.onLife('reseted', {
      id: this.$getModuleName('Reseted'),
      data: (resetModule) => {
        if (target.analyzeResetModule(resetModule, 'pagination') !== false) {
          this.reset()
        }
      }
    })
  }
  uninstall(target) {
    target.offLife('reseted', this.$getModuleName('Reseted'))
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'SimpleData',
        describe: '分页器数据',
        build: [
          {
            prop: 'initdata',
            type: 'object/boolean',
            describe: '分页器加载数据，true = {}',
            data: [
              {
                prop: 'size',
                type: 'object/number',
                describe: 'size设置值,number情况下此值格式话为{ current: value }',
                data: [
                  {
                    prop: 'current',
                    type: 'number',
                    describe: '当前size值'
                  },
                  {
                    prop: 'list',
                    type: 'array[string]',
                    describe: 'size可选列表'
                  }
                ]
              },
              {
                prop: 'option',
                type: 'object',
                describe: '设置项',
                data: [
                  {
                    prop: 'jumper',
                    type: 'boolean',
                    describe: '跳转器，默认为真'
                  },
                  {
                    prop: 'size',
                    type: 'boolean',
                    describe: 'size更换器，默认为真'
                  }
                ]
              },
              {
                prop: 'props',
                type: 'object',
                describe: '扩展设置项',
                data: [
                  {
                    prop: 'props',
                    type: 'object',
                    describe: '扩展设置项PROPS'
                  }
                ]
              }
            ]
          }
        ],
        data: [
          {
            prop: 'status',
            type: 'object',
            describe: '判断值对象',
            data: [
              {
                prop: 'init',
                type: 'boolean',
                describe: '加载判断'
              }
            ]
          },
          {
            prop: 'data',
            type: 'object',
            describe: '数据保存位置',
            data: [
              {
                prop: 'page',
                type: 'object',
                describe: '页码数据对象',
                data: [
                  {
                    prop: 'current',
                    type: 'number',
                    describe: '当前页码'
                  },
                  {
                    prop: 'total',
                    type: 'number',
                    describe: '总页码'
                  }
                ]
              },
              {
                prop: 'size',
                type: 'object',
                describe: '页size数据对象',
                data: [
                  {
                    prop: 'current',
                    type: 'number',
                    describe: '当前页size'
                  },
                  {
                    prop: 'list',
                    type: 'array[string]',
                    describe: '总页size可选列表'
                  }
                ]
              },
              {
                prop: 'num',
                type: 'object',
                describe: '数据对象',
                data: [
                  {
                    prop: 'total',
                    type: 'number',
                    describe: '总数'
                  }
                ]
              }
            ]
          },
          {
            prop: 'option',
            type: 'object',
            describe: '扩展设置',
            data: [
              {
                prop: 'props',
                type: 'object',
                describe: '扩展设置PROPS'
              }
            ]
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

PaginationData.initInstrcution()

export default PaginationData
