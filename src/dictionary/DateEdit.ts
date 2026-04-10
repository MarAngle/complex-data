import SimpleDateEdit from "./SimpleDateEdit"
import type { SimpleDateEditInitOption } from "./SimpleDateEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface DateEditInitOption extends SimpleDateEditInitOption {
  type: 'date'
}

class DateEdit extends SimpleDateEdit<false>{
  static $name = 'DateEdit'
  type: 'date'
  constructor(initOption: DateEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
  }
}

export default DateEdit
