import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue, { functionType } from "../lib/DictionaryValue"

export type dateConfigValue = {
  value: unknown
  eq?: boolean
}

export type dateConfig = { start?: dateConfigValue, end?: dateConfigValue }

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
  disabledDate?: dateConfig | ((value: unknown) => boolean)
}

export interface DefaultEditDateInitOption extends DefaultEditInitOption {
  type: 'date'
  option?: PartialDefaultEditDateOption
}

class DefaultEditDate extends DefaultEdit{
  static $name = 'DefaultEditDate'
  static $edit: undefined | ((value: undefined | string, format: string) => undefined | unknown)
  static $post: undefined | ((value: undefined | unknown, format: string) => undefined | string)
  static $parseDate = function(dateValue: dateConfigValue): unknown { return dateValue.value }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static $compareDate = function(target: unknown, other: unknown): 'before' | 'same' | 'after' {
    // 判断other相对于target的状态
    const targetTime = (target as Date).getTime()
    const otherTime = (other as Date).getTime()
    const offset = otherTime - targetTime
    return offset > 0 ? 'after' : offset === 0 ? 'same' : 'before'
  }
  static $disabledDate = function(option: dateConfig) {
    const start = option.start
    const end = option.end
    return function(value: unknown) {
      let disable = false
      if (start) {
        const startCompare = DefaultEditDate.$compareDate(DefaultEditDate.$parseDate(start), value)
        if (startCompare === 'before') {
          // 当前时间在开始时间之前则禁用
          disable = true
        } else if (startCompare === 'same' && !start.eq) {
          disable = true
        }
      }
      if (!disable && end) {
        const endCompare = DefaultEditDate.$compareDate(DefaultEditDate.$parseDate(end), value)
        if (endCompare === 'after') {
          // 当前时间在结束时间之后则禁用
          disable = true
        } else if (endCompare === 'same' && !end.eq) {
          disable = true
        }
      }
      return disable
    }
  }
  static $defaultOption = {
    format: 'YYYY-MM-DD',
    formatWithTime: 'YYYY-MM-DD HH:mm:ss',
    hideClear: false,
    time: {
      format: 'HH:mm:ss',
      defaultValue: '00:00:00'
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
        this.$option.disabledDate = $constructor.$disabledDate(option.disabledDate)
      } else {
        this.$option.disabledDate = option.disabledDate
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
