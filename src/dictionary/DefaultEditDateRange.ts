import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "./DictionaryValue"

type disabledDateConfig = { start?: unknown, end?: unknown }

export interface DefaultEditDateRangeOption {
  format: string
  time?: {
    format: string
    defaultValue: string[]
  }
  disabledDate?: (value: unknown) => boolean
}

export interface PartialDefaultEditDateRangeOption {
  format?: string
  time?: {
    format?: string
    defaultValue?: string[]
  }
  disabledDate?: disabledDateConfig | ((value: unknown) => boolean)
}

export interface DefaultEditDateRangeInitOption extends DefaultEditInitOption {
  type: 'dateRange'
  option?: PartialDefaultEditDateRangeOption
}

class DefaultEditDateRange extends DefaultEdit{
  static $name = 'DefaultEditDateRange'
  static $defaultOption = {
    format: 'YYYY-MM-DD',
    time: {
      format: 'HH:mm:ss',
      defaultValue: ['00:00:00', '23:59:59']
    },
    disabledDate (option: disabledDateConfig) {
      return function(value: unknown) {
        return false
      }
    }
  }
  type: 'dateRange'
  $option: DefaultEditDateRangeOption
  constructor(initOption: DefaultEditDateRangeInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = initOption.type
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof DefaultEditDateRange).$defaultOption
    this.$option = {
      format: option.format || $defaultOption.format
    }
    if (option.time) {
      this.$option.time = {
        format: option.time.format || $defaultOption.time.format,
        defaultValue: option.time.defaultValue || $defaultOption.time.defaultValue
      }
    }
    if (option.disabledDate) {
      if (typeof option.disabledDate === 'object') {
        this.$option.disabledDate = $defaultOption.disabledDate(option.disabledDate)
      }
    }
  }
}

export default DefaultEditDateRange
