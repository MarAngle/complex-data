import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"

type disabledDateConfig = { start?: unknown, end?: unknown }
type disabledTimeConfig = { start?: unknown, end?: unknown }

export interface DefaultEditDateOption {
  format: string
  hideClear: boolean
  time?: {
    format: string
    defaultValue: string
  }
  disabledDate?: (value: unknown) => boolean
  disabledTime?: (value: unknown) => boolean
}

export interface PartialDefaultEditDateOption {
  format?: string
  hideClear?: boolean
  time?: {
    format?: string
    defaultValue?: string
  }
  disabledDate?: disabledDateConfig | ((value: unknown) => boolean)
  disabledTime?: disabledTimeConfig | ((value: unknown) => boolean)
}

export interface DefaultEditDateInitOption extends DefaultEditInitOption {
  type: 'date'
  option?: PartialDefaultEditDateOption
}

class DefaultEditDate extends DefaultEdit{
  static $name = 'DefaultEditDate'
  static $defaultOption = {
    format: 'YYYY-MM-DD',
    hideClear: false,
    time: {
      format: 'HH:mm:ss',
      defaultValue: '00:00:00'
    },
    disabledDate (option: disabledDateConfig) {
      return function(value: unknown) {
        return false
      }
    },
    disabledTime (option: disabledDateConfig) {
      return function(value: unknown) {
        return false
      }
    }
  }
  type: 'date'
  $option: DefaultEditDateOption
  constructor(initOption: DefaultEditDateInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    const $defaultOption = (this.constructor as typeof DefaultEditDate).$defaultOption
    this.$option = {
      format: option.format || $defaultOption.format,
      hideClear: option.hideClear === undefined ? $defaultOption.hideClear : option.hideClear
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
    if (option.disabledTime) {
      if (typeof option.disabledTime === 'object') {
        this.$option.disabledTime = $defaultOption.disabledTime(option.disabledTime)
      }
    }
  }
}

export default DefaultEditDate
