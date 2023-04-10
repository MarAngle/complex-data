
export type TipDataInitOption = string | ((...args: any[]) => string) | {
  data: string,
  getData?: (...args: any[]) => string,
  location?: 'top' | 'bottom' | 'left' | 'right' | 'middle',
  localOption?: Record<PropertyKey, any>
}

class TipData {
  static $name = 'TipData'
  data?: string
  getData?: (...args: any[]) => string
  location: 'top' | 'bottom' | 'left' | 'right' | 'middle'
  localOption: Record<PropertyKey, any>
  constructor(initOption?: TipDataInitOption) {
    if (!initOption) {
      this.data = undefined
      this.location = 'top'
      this.localOption = {}
    } else {
      switch (typeof initOption) {
        case 'function':
          this.getData = initOption
          this.location = 'top'
          this.localOption = {}
          break;
        case 'object':
          this.data = initOption.data
          this.getData = initOption.getData
          this.location = initOption.location || 'top'
          this.localOption = initOption.localOption || {}
          break;
        default:
          this.data = initOption
          this.location = 'top'
          this.localOption = {}
          break;
      }
    }
  }
}

export default TipData
