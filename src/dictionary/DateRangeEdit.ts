import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DateEdit, { dateConfig } from "./DateEdit"
import DictionaryValue, { functionType } from "../lib/DictionaryValue"

export interface DateRangeEditOption {
  format: string
  showFormat: string
  separator: string
  hideClear: boolean
  time?: {
    format: string
    showFormat: string
    defaultValue: string[]
  }
  disabledDate?: (value: unknown) => boolean
}

export interface PartialDateRangeEditOption {
  format?: string
  showFormat?: string
  separator?: string
  hideClear?: boolean
  time?: {
    format?: string
    showFormat?: string
    defaultValue?: string[]
  }
  disabledDate?: dateConfig | ((value: unknown) => boolean)
}

export interface DateRangeEditInitOption extends DefaultEditInitOption {
  type: 'dateRange'
  option?: PartialDateRangeEditOption
}

class DateRangeEdit extends DefaultEdit{
  static $name = 'DateRangeEdit'
  static $edit: undefined | ((value: undefined | string, format: string) => undefined | unknown)
  static $post: undefined | ((value: undefined | unknown, format: string) => undefined | string)
  static $defaultOption = {
    format: undefined as undefined | string,
    formatWithTime: undefined as undefined | string,
    separator: '-',
    hideClear: undefined as undefined | boolean,
    time: {
      format: undefined as undefined | string,
      defaultValue: ['00:00:00', '23:59:59']
    }
  }
  type: 'dateRange'
  $option: DateRangeEditOption
  constructor(initOption: DateRangeEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    const $constructor = (this.constructor as typeof DateRangeEdit)
    const $defaultOption = $constructor.$defaultOption
    const format = option.format || option.time ? ($defaultOption.formatWithTime || DateEdit.$defaultOption.formatWithTime) : ($defaultOption.format || DateEdit.$defaultOption.format)
    this.$option = {
      format: format,
      showFormat: option.showFormat || format,
      separator: option.separator || $defaultOption.separator,
      hideClear: option.hideClear === undefined ? ($defaultOption.hideClear === undefined ? DateEdit.$defaultOption.hideClear : $defaultOption.hideClear) : option.hideClear
    }
    if (option.time) {
      const timeFormat = option.time.format || $defaultOption.time.format || DateEdit.$defaultOption.time.format
      this.$option.time = {
        format: timeFormat,
        showFormat: option.time.showFormat || timeFormat,
        defaultValue: option.time.defaultValue || $defaultOption.time.defaultValue
      }
    }
    if (option.disabledDate) {
      if (typeof option.disabledDate === 'object') {
        this.$option.disabledDate = DateEdit.$disabledDate(option.disabledDate)
      } else {
        this.$option.disabledDate = option.disabledDate
      }
    }
    if (this.edit === undefined) {
      this.edit = function(this: DateRangeEdit, value: string) {
        if ($constructor.$edit) {
          $constructor.$edit(value, this.$option.format)
        } else if (DateEdit.$edit) {
          DateEdit.$edit(value, this.$option.format)
        } else {
          return value
        }
      } as functionType<unknown>
    }
    if (this.post === undefined) {
      this.post = function(this: DateRangeEdit, value: string) {
        if ($constructor.$post) {
          $constructor.$post(value, this.$option.format)
        } else if (DateEdit.$post) {
          DateEdit.$post(value, this.$option.format)
        } else {
          return value
        }
      } as functionType<unknown>
    }
  }
}

export default DateRangeEdit
