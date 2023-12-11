
export type LayoutValueGridType = {
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

export interface LayoutValueInitOption {
  width?: {
    main?: number | string
    data?: number | string
    [prop: string]: undefined | number | string
  }
  grid?: {
    main?: LayoutValueGridType
    label?: LayoutValueGridType
    content?: LayoutValueGridType
    [prop: string]: undefined | LayoutValueGridType
  }
}

class LayoutValue {
  static $name = 'LayoutValue'
  width: {
    main?: string
    data?: string
    [prop: string]: undefined | string
  }
  grid: {
    main?: LayoutValueGridType
    label?: LayoutValueGridType
    content?: LayoutValueGridType
    [prop: string]: undefined | LayoutValueGridType
  }
  constructor(initOption: LayoutValueInitOption = {}) {
    this.width = {}
    if (initOption.width) {
      for (const prop in initOption.width) {
        const widthValue = initOption.width[prop]
        this.width[prop] = typeof widthValue === 'number' ? widthValue + 'px' : widthValue
      }
    }
    this.grid = {
      ...initOption.grid
    }
  }
}


export default LayoutValue
