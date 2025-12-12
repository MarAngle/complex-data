import SimpleDateEdit, { SimpleDateEditInitOption } from "./SimpleDateEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface DateRangeEditInitOption extends SimpleDateEditInitOption<true> {
  type: 'dateRange'
  endPlaceholder?: string
}

class DateRangeEdit extends SimpleDateEdit<true>{
  static $name = 'DateRangeEdit'
  static $widthWithTime = 345
  static $widthWithoutTime = 225
  static $range = true
  static $defaultRuleMessage = '请正确选择开始结束时间'
  static $defaultPlaceholder = function (_name: string) {
    return `开始日期`
  }
  static $defaultEndPlaceholder = function (_name: string) {
    return `结束日期`
  }
  type: 'dateRange'
  endPlaceholder: string
  constructor(initOption: DateRangeEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    const $constructor = (this.constructor as typeof DateRangeEdit)
    this.type = initOption.type
    this.endPlaceholder = initOption.endPlaceholder ?? $constructor.$defaultEndPlaceholder(this.$name)
  }
}

export default DateRangeEdit
