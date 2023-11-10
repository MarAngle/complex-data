import BaseData from '../data/BaseData'
import AttributeValue, { AttributeValueInitOption } from '../lib/AttributeValue'
import Data from './../data/Data'

type resetOptionValue = {
  [prop: string]: boolean
}

type resetOption = {
  [prop: string]: boolean | resetOptionValue
}

type checkOption = {
  from: true | string
  act?: string
}

export type ChoiceDataData = {
  id: PropertyKey[]
  list: Record<PropertyKey, unknown>[]
}

export interface ChoiceDataInitOption {
  reset?: resetOption
  local?: {
    parent?: AttributeValueInitOption
    target?: AttributeValueInitOption
    child?: AttributeValueInitOption
    [prop: string]: undefined | AttributeValueInitOption
  }
}

class ChoiceData extends Data {
  static $name = 'ChoiceData'
  idProp: string
  data: ChoiceDataData
  $resetOption: resetOption
  $local?: {
    parent?: AttributeValue
    target?: AttributeValue
    child?: AttributeValue
    [prop: string]: undefined | AttributeValue
  }
  constructor (initOption: ChoiceDataInitOption) {
    super()
    this.idProp = 'id'
    this.data = {
      id: [],
      list: []
    }
    this.$resetOption = {
      load: false,
      reload: false,
      update: false,
      search: {
        set: true,
        reset: true
      },
      pagination: {
        page: false,
        size: false
      }
    }
    if (initOption.reset) {
      for (const n in initOption.reset) {
        if (typeof initOption.reset[n] === 'object') {
          if (typeof this.$resetOption[n] !== 'object') {
            this.$resetOption[n] = {}
          }
          for (const i in (initOption.reset[n] as resetOptionValue)) {
            (this.$resetOption[n] as resetOptionValue)[i] = (initOption.reset[n] as resetOptionValue)[i]
          }
        } else {
          this.$resetOption[n] = initOption.reset[n]
        }
      }
    }
    if (initOption.local) {
      // 插件单独的设置，做特殊处理时使用，尽可能的将所有能用到的数据通过option做兼容处理避免问题
      this.$local = {}
      for (const prop in initOption.local) {
        this.$local[prop] = new AttributeValue(initOption.local[prop])
      }
    }
  }
  /**
   * 获取数据
   */
  getData() {
    return this.data
  }
  getId() {
    return this.data.id
  }
  getList() {
    return this.data.list
  }
  pushData(idList: PropertyKey[], list: Record<PropertyKey, unknown>[]) {
    for (let i = 0; i < idList.length; i++) {
      const id = idList[i]
      if (this.data.id.indexOf(id) === -1) {
        this.data.id.push(id)
        this.data.list.push(list[i])
      }
    }
  }
  /**
   * 设置选项列表数据
   * @param {string[]} idList ID列表
   * @param {object[]} list ITEM列表
   */
  setData(idList: PropertyKey[], list: Record<PropertyKey, unknown>[]) {
    this.data.id = idList
    this.data.list = list
  }
  /**
   * 根据option, defaultOption自动判断重置与否
   * @param {object | string} [option] 参数
   * @param {object | string} [defaultOption] 默认参数
   */
  autoReset(option: true | string | checkOption, defaultOption?: string | checkOption) {
    option = this.$formatresetOption(option, defaultOption)
    const force = this.$checkReset(option)
    this.reset(force)
  }
  /**
   * 根据defaultOption格式化option
   * @param {object | string} [option] 参数
   * @param {object | string} [defaultOption = 'load'] 默认参数
   * @returns {object}
   */
  $formatresetOption(option: true | string | checkOption, defaultOption: string | checkOption = 'load') {
    if (!option) {
      option = defaultOption
    }
    if (typeof option !== 'object') {
      option = {
        from: option
      }
    }
    return option
  }
  /**
   * 检查是否进行重置
   * @param {object} [option] 重置参数
   * @param {boolean | string} [option.from] 当前操作
   * @param {string} [option.act] 当前操作分支操作
   * @returns {boolean}
   */
  $checkReset(option: checkOption = { from: '' }) {
    const from = option.from
    let reset
    if (from === true) {
      reset = true
    } else if (this.$resetOption[from] !== undefined) {
      if (this.$resetOption[from] && typeof this.$resetOption[from] === 'object') {
        const act = option.act
        if (!act) {
          this.$exportMsg(`$checkReset函数中对应的from:${from}未定义act,可定义:${Object.keys(this.$resetOption[from])}`)
        } else if ((this.$resetOption[from] as resetOptionValue)[act] !== undefined) {
          reset = (this.$resetOption[from] as resetOptionValue)[act]
        } else {
          this.$exportMsg(`$checkReset函数中对应的from:${from}中不存在act:${act},可定义:${Object.keys(this.$resetOption[from])}`)
        }
      } else {
        reset = this.$resetOption[from]
      }
    } else {
      this.$exportMsg(`$checkReset函数未找到对应的from:${from}`)
    }
    return !!reset
  }
  /**
   * 重置操作
   * @param {boolean} force 重置判断值
   */
  reset(force?: boolean) {
    if (force) {
      this.setData([], [])
    }
  }
  /**
   * 模块加载
   * @param {object} target 加载到的目标
   */
  $install (target: BaseData) {
    super.$install(target)
    target.$onLife('beforeReload', {
      id: this.$getId('BeforeReload'),
      data: (instantiater, resetOption) => {
        if (target.$module.dictionary) {
          this.idProp = target.$module.dictionary.$getProp('id')
        }
        this.autoReset(resetOption.choice)
      }
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
  $uninstall(target: BaseData) {
    super.$uninstall(target)
    target.$offLife('beforeReload', this.$getId('BeforeReload'))
  }
  $reset(option?: boolean) {
    if (option !== false) {
      this.reset(true)
    }
  }
  $destroy(option?: boolean) {
    if (option !== false) {
      this.$reset(option)
    }
  }
}

export default ChoiceData
