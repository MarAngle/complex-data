import AttributeValue, { AttributeValueInitOption } from "./AttributeValue"

export type locationType = 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'

export type TipValueInitOption = string | {
  data: string
  getData?: (...args: unknown[]) => string
  location?: locationType
  local?: AttributeValueInitOption
}

class TipValue {
  static $name = 'TipValue'
  data?: string
  getData?: (...args: unknown[]) => string
  location: locationType
  $local?: AttributeValue
  constructor(initOption?: TipValueInitOption) {
    if (initOption === undefined || typeof initOption === 'string') {
      this.data = initOption
      this.location = 'top'
    } else {
      this.data = initOption.data
      this.getData = initOption.getData
      this.location = initOption.location || 'top'
      this.$local = initOption.local ? new AttributeValue(initOption.local) : undefined
    }
  }
}

export default TipValue
