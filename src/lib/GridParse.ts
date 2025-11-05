
export interface GridParseInitOption {
  line: number
  label: number
  content: number
}

export interface GridValue {
  span: number
  offset?: number // 栅格左侧的间隔格数，间隔内不可以有栅格
  pull?: number // 栅格向左移动格数
  push?: number // 栅格向右移动格数
}

export interface GridMainValue {
  main: GridValue
  label: GridValue
  content: GridValue
}

export interface GridOption {
  line: number
  local?: Partial<GridMainValue>
  custom?: (data: GridValue, position: keyof GridMainValue, gridParse: GridParse, payload: any) => GridValue
}

export const createGridOption = function(gridValue?: number | GridOption) {
  if (typeof gridValue === 'number') {
    return { line: gridValue }
  } else {
    return gridValue
  }
}

const parseDict = {
  main: 'getMain',
  label: 'getLabel',
  content: 'getContent',
} as const

/**
 * 栅格布局计算类
 * 核心思想：基于“一行总24栅格”的原则，根据一行计划排列的元素总数(line)，
 * 以及所有元素的label和content计划占用的总栅格数，
 * 计算出单个元素的label、content和offset各应占多少栅格。
 */
class GridParse {
  static $name = 'GridParse'
  static $defaultOption = {
    line: 1,
    label: 8,
    content: 16
  } as GridParseInitOption
  line: number
  label: number
  _offset: number
  _default: GridMainValue
  constructor(initOption?: GridParseInitOption) {
    if (!initOption) {
      initOption = (this.constructor as typeof GridParse).$defaultOption
    }
    this.line = initOption.line
    // 核心计算1：计算单个元素的左侧间距(offset)
    // 原理：(总宽度24 - 所有label总宽度 - 所有content总宽度) / 元素个数
    this._offset = (24 - initOption.label - initOption.content) / initOption.line
    // 核心计算2：计算单个元素的label宽度
    // 原理：所有label总宽度 / 元素个数
    this.label = initOption.label / initOption.line
    this._default = {
      main: { span: this.getMain(this.line) },
      label: { span: this.getLabel(this.line) },
      content: { span: this.getContent(this.line) }
    }
  }
  getMain(line: number) {
    return 24 / line
  }
  getLabel(line: number) {
    return this.label * line
  }
  getContent(line: number) {
    // 实时计算所有content的总宽度
    return 24 - this.getLabel(line) - this._offset * line
  }
  parseData(gridValue: undefined | GridOption, position: keyof GridMainValue, payload: any) {
    if (!gridValue) {
      return this._default[position]
    } else {
      let data = !gridValue.local ? {
        span: this[parseDict[position]](gridValue.line)
      } : {
        span: this[parseDict[position]](gridValue.line),
        ...gridValue.local[position]
      }
      if (gridValue.custom) {
        data = gridValue.custom(data, position, this, payload)
      }
      return data
    }
  }
}


export default GridParse
