import ResetData, { ResetDataInitOption } from './ResetData'

export interface SortDataInitOption extends ResetDataInitOption {
  prop?: PropertyKey[]
  sort?: (a: any, b: any) => boolean
}

type sortType = 'asc' | 'desc'

class SortData extends ResetData {
  static $name = 'SortData'
  static $formatConfig = { name: 'SortData', level: 50, recommend: true }
  prop: PropertyKey[]
  sort?: (a: any, b: any) => boolean
  data: {
    value: undefined | PropertyKey
    sort: undefined | sortType
  }
  constructor (initOption: SortDataInitOption) {
    super('sort', initOption)
    this.prop = initOption.prop || []
    this.sort = initOption.sort
    this.data = {
      value: undefined,
      sort: undefined
    }
  }
  setData(value: undefined | PropertyKey, sort: undefined | sortType) {
    this.data.value = value
    this.data.sort = sort
  }
  getData() {
    return {
      value: this.data.value,
      sort: this.data.sort
    }
  }
  /**
   * 重置操作
   * @param {boolean} force 重置判断值
   */
  reset(force?: boolean) {
    if (force !== false) {
      this.setData(undefined, undefined)
    }
  }
  destroy(force?: boolean) {
    if (force !== false) {
      this.reset(force)
    }
  }
}

export default SortData
