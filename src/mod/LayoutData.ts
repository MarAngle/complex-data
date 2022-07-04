import $func from 'complex-func'
import config from '../../config'
import Data from './../data/Data'
import InterfaceData from './InterfaceData'




export type LayoutDataDataTypeObject = {
  span: number,
  offset?: number,
  pull?: number,
  push?: number,
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  xxl?: number
}
export type LayoutDataDataType = number | LayoutDataDataTypeObject

export interface LayoutDataInitOptionType {
  type?: string,
  grid?: number,
  label?: LayoutDataDataType,
  content?: LayoutDataDataType
}

export interface LayoutDataFormatData {
  type: string,
  grid: number,
  label: LayoutDataDataType,
  content: LayoutDataDataType
}

export interface LayoutDataInitOption {
  default: LayoutDataInitOptionType,
  [prop: string]: LayoutDataInitOptionType
}

class LayoutData extends Data {
  data!: InterfaceData<LayoutDataFormatData>
  constructor (initOption?: LayoutDataInitOption) {
    super()
    this.initData(initOption)
  }
  /**
   * 加载
   * @param {*} initOption 参数
   */
  initData (initOption?: LayoutDataInitOption) {
    if (!initOption) {
      initOption = {
        default: undefined
      } as any
    }
    for (const n in initOption) {
      initOption[n] = this.formatLayout(initOption[n])
    }
    this.data = new InterfaceData((initOption as {
      [prop: string]: LayoutDataFormatData
    }))
  }
  /**
   * 格式化布局数据
   * @param {object} [data] 布局数据
   * @returns {object}
   */
  formatLayout(data?: LayoutDataInitOptionType): LayoutDataFormatData {
    if (!data) {
      data = {}
    }
    if (!data.type) {
      data.type = 'grid'
    }
    if (data.grid === undefined) {
      data.grid = config.LayoutData.grid
    }
    if (data.label === undefined) {
      data.label = {
        span: config.LayoutData.label
      }
    } else if ($func.getType(data.label) !== 'object') {
      data.label = {
        span: (data.label as number)
      }
    }
    if (data.content === undefined) {
      data.content = {
        span: config.LayoutData.content
      }
    } else if ($func.getType(data.content) !== 'object') {
      data.content = {
        span: (data.content as number)
      }
    }
    return data as LayoutDataFormatData
  }
  /**
   * 设置指定布局
   * @param {string} prop 指定属性
   * @param {*} data 布局数据
   */
  setData (prop: string, data: LayoutDataInitOptionType) {
    this.data.setData(prop, this.formatLayout(data))
  }
  /**
   * 获取指定布局
   * @param {string} prop 指定属性
   * @returns {*}
   */
  getData (prop?: string):LayoutDataFormatData  {
    return this.data.getData(prop) as LayoutDataFormatData
  }
  /**
   * 获取布局全数据
   * @returns {object}
   */
  getMain () {
    return this.data.getMain()
  }
}

LayoutData.$name = 'LayoutData'

export default LayoutData
