import SimpleDateEdit, { SimpleDateEditInitOption } from "./SimpleDateEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface DateRangeEditInitOption extends SimpleDateEditInitOption {
  type: 'dateRange'
}

class DateRangeEdit extends SimpleDateEdit{
  static $name = 'DateRangeEdit'
  static $range = true
  type: 'dateRange'
  constructor(initOption: DateRangeEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
  }
}

export default DateRangeEdit
