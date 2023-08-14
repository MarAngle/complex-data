/* eslint-disable @typescript-eslint/no-explicit-any */
import { getType } from 'complex-utils'
import config from '../../config'
import Data from './../data/Data'
import InterfaceData from './InterfaceData'

export interface HasLayoutData {
  $setLayout: (layout: LayoutDataInitOption) => void
  $getLayout: (prop?: string) => LayoutDataFormatData
  $getLayoutData: () => LayoutData
}

export type LayoutDataDataTypeObject = {
  span: number
  offset?: number
  pull?: number
  push?: number
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
  grid?: LayoutDataDataType,
  label?: LayoutDataDataType,
  content?: LayoutDataDataType
}

export interface LayoutDataFormatData {
  type: string,
  grid: LayoutDataDataTypeObject,
  label: LayoutDataDataTypeObject,
  content: LayoutDataDataTypeObject
}

export interface LayoutDataInitOptionOption {
  default: LayoutDataInitOptionType,
  [prop: string]: LayoutDataInitOptionType
}

export type LayoutDataInitOption = LayoutDataInitOptionOption | LayoutData

class LayoutData extends Data {
  static $name = 'LayoutData'
  data!: InterfaceData<LayoutDataFormatData>
  constructor(initOption?: LayoutDataInitOption) {
    if (initOption && initOption.constructor === LayoutData) {
      return initOption
    } else {
      super()
      this.initData(initOption as LayoutDataInitOptionOption)
    }
  }
  /**
   * 加载
   * @param {*} initOption 参数
   */
  initData(initOption?: LayoutDataInitOptionOption) {
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
      data.grid = {
        span: config.LayoutData.grid
      }
    } else if (getType(data.grid) !== 'object') {
      data.grid = {
        span: data.grid as number
      }
    }
    if (data.label === undefined) {
      data.label = {
        span: config.LayoutData.label
      }
    } else if (getType(data.label) !== 'object') {
      data.label = {
        span: data.label as number
      }
    }
    if (data.content === undefined) {
      data.content = {
        span: config.LayoutData.content
      }
    } else if (getType(data.content) !== 'object') {
      data.content = {
        span: data.content as number
      }
    }
    return data as LayoutDataFormatData
  }
  /**
   * 设置指定布局
   * @param {string} prop 指定属性
   * @param {*} data 布局数据
   */
  setData(prop: string, data: LayoutDataInitOptionType) {
    this.data.setData(prop, this.formatLayout(data))
  }
  /**
   * 获取指定布局
   * @param {string} prop 指定属性
   * @returns {*}
   */
  getData(prop?: string): LayoutDataFormatData {
    return this.data.getData(prop) as LayoutDataFormatData
  }
  /**
   * 获取布局全数据
   * @returns {object}
   */
  getMain() {
    return this.data.getMain()
  }
}

export default LayoutData
