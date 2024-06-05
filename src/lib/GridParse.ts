
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
    return {
      line: gridValue
    }
  } else {
    return gridValue
  }
}

const parseDict = {
  main: '_getMain',
  label: '_getLabel',
  content: '_getContent',
} as const

class GridParse {
  static $name = 'GridParse'
  static $defaultOption = {
    line: 1,
    label: 8,
    content: 16
  } as GridParseInitOption
  line: number
  label: number
  content: number
  _offset: number
  _default: GridMainValue
  constructor(initOption?: GridParseInitOption) {
    if (!initOption) {
      initOption = (this.constructor as typeof GridParse).$defaultOption
    }
    this.line = initOption.line
    this._offset = (24 - initOption.label - initOption.content) / initOption.line
    this.label = initOption.label / initOption.line
    this.content = 24 - this.label - this._offset
    this._default = {
      main: {
        span: this._getMain(this.line)
      },
      label: {
        span: this._getLabel(this.line)
      },
      content: {
        span: this._getContent(this.line)
      }
    }
  }
  protected _getMain(line: number) {
    return 24 / line
  }
  protected _getLabel(line: number) {
    return this.label * line
  }
  protected _getContent(line: number) {
    return 24 - this._getLabel(line) - this._offset * line
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