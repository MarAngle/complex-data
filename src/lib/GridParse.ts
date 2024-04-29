
export interface GridParseInitOption {
  line: number
  label: number
  content: number
}

export interface GridParseValueType {
  data: number
  label: number
  content: number
}

export interface GridValue {
  line: number
  customize?: boolean
  offset?: number // 栅格左侧的间隔格数，间隔内不可以有栅格
  pull?: number // 栅格向左移动格数
  push?: number // 栅格向右移动格数
}

export const createGridValue = function(gridValue?: GridValue) {
  return gridValue
}

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
  _default: GridParseValueType
  constructor(initOption?: GridParseInitOption) {
    if (!initOption) {
      initOption = (this.constructor as typeof GridParse).$defaultOption
    }
    this.line = initOption.line
    this._offset = (24 - initOption.label - initOption.content) / initOption.line
    this.label = initOption.label / initOption.line
    this.content = 24 - this.label - this._offset
    this._default = this._getData(this.line)
  }
  protected _getData(line: number) {
    const label = this.label * line
    const offset = this._offset * line
    const content = 24 - label - offset
    return {
      data: 24 / line,
      label,
      content
    }
  }
  parseData(gridValue?: GridValue) {
    if (!gridValue) {
      return this._default
    } else {
      return {
        ...this._getData(gridValue.line),
        ...gridValue
      }
    }
  }
}


export default GridParse