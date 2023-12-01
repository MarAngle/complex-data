import AttrsValue, { AttrsValueInitOption } from "./AttrsValue"

export type locationType = 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'

export type TipValueInitOption = string | {
  data: string
  getData?: (...args: unknown[]) => string
  location?: locationType
  attrs?: AttrsValueInitOption
}

class TipValue {
  static $name = 'TipValue'
  data?: string
  getData?: (...args: unknown[]) => string
  location: locationType
  $attrs?: AttrsValue
  constructor(initOption?: TipValueInitOption) {
    if (initOption === undefined || typeof initOption === 'string') {
      this.data = initOption
      this.location = 'top'
    } else {
      this.data = initOption.data
      this.getData = initOption.getData
      this.location = initOption.location || 'top'
      this.$attrs = initOption.attrs ? new AttrsValue(initOption.attrs) : undefined
    }
  }
}

export default TipValue
