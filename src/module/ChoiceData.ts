import BaseData from '../data/BaseData'
import ResetData, { ResetDataInitOption } from './ResetData'

export type ChoiceDataData = {
  id: PropertyKey[]
  list: Record<PropertyKey, any>[]
}

export interface ChoiceDataInitOption extends ResetDataInitOption {}

class ChoiceData extends ResetData {
  static $name = 'ChoiceData'
  static $formatConfig = { name: 'ChoiceData', level: 50, recommend: true }
  idProp: PropertyKey
  data: ChoiceDataData
  constructor (initOption: ChoiceDataInitOption) {
    super('choice', initOption)
    this.idProp = 'id'
    this.data = {
      id: [],
      list: []
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
  pushData(idList: PropertyKey[], list: Record<PropertyKey, any>[]) {
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
  setData(idList: PropertyKey[], list: Record<PropertyKey, any>[]) {
    this.data.id = idList
    this.data.list = list
  }
  /**
   * 重置操作
   * @param {boolean} force 重置判断值
   */
  reset(force?: boolean) {
    if (force !== false) {
      this.setData([], [])
    }
  }
  destroy(force?: boolean) {
    if (force !== false) {
      this.reset(force)
    }
  }
  /**
   * 模块加载
   * @param {object} target 加载到的目标
   */
  _install (target: BaseData) {
    super._install(target)
    target.$onCreatedLife('BaseDataCreated', () => {
      if (target.$module?.dictionary) {
        this.idProp = target.$module.dictionary.getProp('id') || 'id'
      }
    })
  }
}

export default ChoiceData
