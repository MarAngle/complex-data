import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "./DictionaryValue"

type disabledDateConfig = { start?: unknown, end?: unknown }

export interface DefaultEditDateOption {
  format: string
  time?: {
    format: string
    defaultValue: string
  }
  disabledDate?: (value: unknown) => boolean
}

export interface PartialDefaultEditDateOption {
  format?: string
  time?: {
    format?: string
    defaultValue?: string
  }
  disabledDate?: disabledDateConfig | ((value: unknown) => boolean)
}

export interface DefaultEditDateInitOption extends DefaultEditInitOption {
  type: 'date'
  option?: PartialDefaultEditDateOption
}

class DefaultEditDate extends DefaultEdit{
  static $name = 'DefaultEditDate'
  static $defaultOption = {
    format: 'YYYY-MM-DD',
    time: {
      format: 'HH:mm:ss',
      defaultValue: '00:00:00'
    },
    disabledDate (option: disabledDateConfig) {
      return function(value: unknown) {
        //
      }
    }
  }
  type: 'date'
  $option: DefaultEditDateOption
  constructor(initOption: DefaultEditDateInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.type = initOption.type
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof DefaultEditDate).$defaultOption
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

export default DefaultEditDate
