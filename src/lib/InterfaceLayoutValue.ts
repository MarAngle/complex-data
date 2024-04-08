import InterfaceValue from "./InterfaceValue"
import LayoutValue, { LayoutValueInitOption } from "./LayoutValue"

export interface InterfaceLayoutValueInitOption {
  [prop: string]: LayoutValueInitOption
}

class InterfaceLayoutValue {
  static $name = 'InterfaceLayoutValue'
  data: InterfaceValue<LayoutValue>
  constructor(initOption?: InterfaceLayoutValueInitOption) {
    if (!initOption) {
      this.data = new InterfaceValue()
    } else {
      const data: {
        [prop: string]: LayoutValue
      } = {}
      for (const prop in (initOption as InterfaceLayoutValueInitOption)) {
        data[prop] = new LayoutValue((initOption as InterfaceLayoutValueInitOption)[prop])
      }
      this.data = new InterfaceValue(data)
    }
  }
  getValue(prop?: string) {
    return this.data.getValue(prop)
  }
}

export default InterfaceLayoutValue
