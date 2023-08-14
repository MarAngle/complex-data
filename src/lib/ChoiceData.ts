/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseData from '../data/BaseData'
import { formatInitOption } from '../utils'
import Data from './../data/Data'

type ResetOptionItem = {
  [prop: string]: boolean
}

type ResetOption = {
  [prop: string]: boolean | ResetOptionItem
}

export type idType = string | number

export type ChoiceDataData = {
  id: idType[],
  list: Record<PropertyKey, unknown>[]
}

export interface ChoiceDataInitOption {
  reset?: ResetOption,
  option?: Record<PropertyKey, any>
}

class ChoiceData extends Data {
  idProp: string
  data: ChoiceDataData
  resetOption: ResetOption
  option: Record<PropertyKey, any>
  static $name = 'ChoiceData'
  constructor (initOption?: ChoiceDataInitOption) {
    initOption = formatInitOption(initOption)
    super()
    this.idProp = 'id'
    this.data = {
      id: [],
      list: []
    }
    this.resetOption = {
      load: false,
      reload: false,
      update: false,
      search: {
        set: true,
        reset: true
      },
      page: {
        page: false,
        size: false
      }
    }
    this.option = {}
    this.$initChoiceData(initOption)
  }
  /**
   * 设置设置项
   * @param {object} [initOption] 参数
   */
  $initChoiceData(initOption: ChoiceDataInitOption = {}) {
    if (initOption.reset) {
      for (const n in initOption.reset) {
        if (typeof initOption.reset[n] === 'object') {
          if (typeof this.resetOption[n] !== 'object') {
            this.resetOption[n] = {}
          }
          for (const i in (initOption.reset[n] as ResetOptionItem)) {
            (this.resetOption[n] as ResetOptionItem)[i] = (initOption.reset[n] as ResetOptionItem)[i]
          }
        } else {
          this.resetOption[n] = initOption.reset[n]
        }
      }
    }
    if (initOption.option) {
      this.option = {
        ...initOption.option
      }
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
  pushData(idList: idType[], list: Record<PropertyKey, unknown>[]) {
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
  setData(idList: idType[], list: Record<PropertyKey, unknown>[]) {
    this.data.id = idList
    this.data.list = list
  }
  /**
   * 根据option, defaultOption自动判断重置与否
   * @param {object | string} [option] 参数
   * @param {object | string} [defaultOption] 默认参数
   */
  autoReset(option: any, defaultOption?: any) {
    option = this.$formatResetOption(option, defaultOption)
    const force = this.$checkReset(option)
    this.reset(force)
  }
  /**
   * 根据defaultOption格式化option
   * @param {object | string} [option] 参数
   * @param {object | string} [defaultOption = 'load'] 默认参数
   * @returns {object}
   */
  $formatResetOption(option: any, defaultOption = 'load') {
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
  $checkReset(option: { from: true | string, act?: string } = { from: '' }) {
    const from = option.from
    let reset
    if (from === true) {
      reset = true
    } else if (this.resetOption[from] !== undefined) {
      if (this.resetOption[from] && typeof this.resetOption[from] === 'object') {
        const act = option.act
        if (!act) {
          this.$exportMsg(`$checkReset函数中对应的from:${from}未定义act,可定义:${Object.keys(this.resetOption[from])}`)
        } else if ((this.resetOption[from] as ResetOptionItem)[act] !== undefined) {
          reset = (this.resetOption[from] as ResetOptionItem)[act]
        } else {
          this.$exportMsg(`$checkReset函数中对应的from:${from}中不存在act:${act},可定义:${Object.keys(this.resetOption[from])}`)
        }
      } else {
        reset = this.resetOption[from]
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
  $install (target: BaseData<any>) {
    super.$install(target)
    target.$onLife('beforeReload', {
      id: this.$getId('BeforeReload'),
      data: (instantiater, resetOption) => {
        if (target.$module.dictionary) {
          this.idProp = target.$module.dictionary.$getPropData('prop', 'id')
        }
        this.autoReset(resetOption.choice)
      }
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
  $uninstall(target: BaseData<any>) {
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
