import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue, { functionType } from "../lib/DictionaryValue"

type disabledDateConfig = { start?: unknown, end?: unknown }
type disabledTimeConfig = { start?: unknown, end?: unknown }

export interface DefaultEditDateOption {
  format: string
  showFormat: string
  hideClear: boolean
  time?: {
    format: string
    showFormat: string
    defaultValue: string
  }
  disabledDate?: (value: unknown) => boolean
  disabledTime?: (value: unknown) => boolean
}

export interface PartialDefaultEditDateOption {
  format?: string
  showFormat?: string
  hideClear?: boolean
  time?: {
    format?: string
    showFormat?: string
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
  static $edit: undefined | ((value: undefined | string, format: string) => undefined | unknown)
  static $post: undefined | ((value: undefined | unknown, format: string) => undefined | string)
  static $defaultOption = {
    format: 'YYYY-MM-DD',
    formatWithTime: 'YYYY-MM-DD HH:mm:ss',
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
    const $constructor = (this.constructor as typeof DefaultEditDate)
    const $defaultOption = $constructor.$defaultOption
    const format = option.format || option.time ? $defaultOption.formatWithTime : $defaultOption.format
    this.$option = {
      format: format,
      showFormat: option.showFormat || format,
      hideClear: option.hideClear === undefined ? $defaultOption.hideClear : option.hideClear
    }
    if (option.time) {
      const timeFormat = option.time.format || $defaultOption.time.format
      this.$option.time = {
        format: timeFormat,
        showFormat: option.time.showFormat || timeFormat,
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
    if (this.edit === undefined) {
      this.edit = function(this: DefaultEditDate, value: string) {
        if ($constructor.$edit) {
          return $constructor.$edit(value, this.$option.format)
        } else {
          return value
        }
      } as functionType<unknown>
    }
    if (this.post === undefined) {
      this.post = function(this: DefaultEditDate, value: string) {
        if ($constructor.$post) {
          return $constructor.$post(value, this.$option.format)
        } else {
          return value
        }
      } as functionType<unknown>
    }
  }
}

export default DefaultEditDate
