import config from "../../config"

export interface WidthValueType {
  main?: string
  data?: string
  [prop: string]: undefined | string
}

export interface WidthValueInitOption {
  main?: number | string
  data?: number | string
  [prop: string]: undefined | number | string
}

class WidthValue {
static $name = 'WidthValue'
data: WidthValueType
constructor(initOption: WidthValueInitOption = {}) {
  this.data = {}
  for (const prop in initOption) {
    const widthValue = initOption[prop]
      this.data[prop] = typeof widthValue === 'number' ? config.formatPixel(widthValue) : widthValue
    }
  }
}

export default WidthValue
