import SimpleData from './../data/SimpleData'

class StatusDataItem extends SimpleData {
  constructor (initOption) {
    super()
    if (!initOption || !initOption.list || initOption.list.length <= 0) {
      console.error(`StatusDataItem需要设置初始化数据,并设置列表`)
    }
    this.option = {
      type: 'default'
    }
    this.list = {}
    this.current = {
      value: '',
      label: ''
    }
    this.$initList(initOption.list)
    let current = initOption.current || initOption.list[0].value
    this.setData(current, 'init')
    this.default = initOption.default || current // value值
    this.$initOption(initOption.option)
  }
  $initList (list) {
    for (let n in list) {
      this.list[list[n].value] = list[n]
    }
  }
  $initOption (option = {}) {
    if (option.type && option.type == 'count') {
      if (option.prop) {
        this.option.type = option.type
        this.option.data = {
          prop: option.prop,
          num: 0
        }
      } else {
        console.error(`StatusDataItem设置target类型需要传递taget目标值!`)
      }
    }
  }
  /**
   * 设置当前值
   * @param {string} prop 指定的属性值
   * @param {'init' | 'reset'} [act] 操作判断值
   */
  setData (prop, act) {
    if (this.list[prop]) {
      let build = true
      if (!act) {
        build = this.$triggerTarget(prop)
      } else if (act == 'init') {
        //
      } else if (act == 'reset') {
        this.$resetTarget()
      }
      if (build && this.current.value != this.list[prop].value) {
        this.current.value = this.list[prop].value
        this.current.label = this.list[prop].label
      }
    } else {
      console.error(`当前加载判断值${prop}不存在`)
    }
  }
  /**
   * 重置计算值
   */
  $resetTarget () {
    if (this.option.type == 'count') {
      this.option.data.num = 0
    }
  }
  /**
   * 判断是否需要计算以及下一步操作
   * @param {string} prop 属性值
   * @returns {boolean}
   */
  $triggerTarget (prop) {
    let fg = true
    if (this.option.type == 'count') {
      if (this.option.data.prop == prop) {
        this.option.data.num++
      } else {
        this.option.data.num--
        if (this.option.data.num != 0) {
          fg = false
        }
      }
    }
    return fg
  }
  /**
   * 获取值
   * @param {string} [prop] 整个或者属性值
   * @returns {*}
   */
  getData (prop) {
    if (prop) {
      return this.current[prop]
    } else {
      return this.current
    }
  }
  /**
   * 重置
   */
  reset () {
    this.setData(this.default, 'reset')
  }
}

StatusDataItem.$name = 'StatusDataItem'

export default StatusDataItem
