import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue, { functionType } from "../lib/DictionaryValue"

export type dateConfigValue = {
  value: any
  eq?: boolean
}

export type dateConfig = { start?: dateConfigValue, end?: dateConfigValue }

export interface BaseSimpleDateEditOption {
  format: string
  showFormat: string
  hideClear: boolean
  time?: {
    format: string
    showFormat: string
    defaultValue: string
  }
  disabledDate?: (value: any) => boolean
}

export interface RangeSimpleDateEditOption {
  separator?: string
  time?: {
    defaultEndValue?: string
  }
}

export type SimpleDateEditOption<R extends Boolean = false> = BaseSimpleDateEditOption & (R extends true ? RangeSimpleDateEditOption : {});

export type PartialSimpleDateEditOption<R extends Boolean = false> = Partial<SimpleDateEditOption<R>>

export interface SimpleDateEditInitOption<R extends Boolean = false> extends DefaultEditInitOption {
  option?: PartialSimpleDateEditOption<R>
}

const defaultParse = function(this: SimpleDateEdit<false>, value: string) {
  const $constructor = (this.constructor as typeof SimpleDateEdit<false>)
  if ($constructor.$parse) {
    return $constructor.$parse(value, this.$option.format) as string
  } else {
    return value
  }
}

const defaultRangeParse = function(this: SimpleDateEdit<true>, valueList: string[]) {
  const $constructor = (this.constructor as typeof SimpleDateEdit<true>)
  if ($constructor.$parse) {
    if (valueList) {
      return valueList.map(value => $constructor.$parse!(value, this.$option.format) as string)
    } else {
      return undefined
    }
  } else {
    return valueList
  }
}

const defaultFetch = function(this: SimpleDateEdit<false>, value: any) {
  const $constructor = (this.constructor as typeof SimpleDateEdit<false>)
  if ($constructor.$fetch) {
    return $constructor.$fetch(value, this.$option.format)
  } else {
    return value
  }
}

const defaultRangeFetch = function(this: SimpleDateEdit<true>, valueList: any[]) {
  const $constructor = (this.constructor as typeof SimpleDateEdit<true>)
  if ($constructor.$fetch) {
    if (valueList) {
      return valueList.map(value => $constructor.$fetch!(value, this.$option.format) as string)
    } else {
      return undefined
    }
  } else {
    return valueList
  }
}
class SimpleDateEdit<R extends Boolean = false> extends DefaultEdit{
  static $name = 'SimpleDateEdit'
  static $range = false
  static $defaultPlaceholder = function (name: string) {
    return `请选择${name}`
  }
  static $parse: undefined | ((value: undefined | string, format: string) => undefined | any)
  static $fetch: undefined | ((value: undefined | any, format: string) => undefined | string)
  static $parseDate = function(dateValue: dateConfigValue): any { return dateValue.value }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static $compareDate = function(target: any, other: any): 'before' | 'same' | 'after' {
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
        const startCompare = SimpleDateEdit.$compareDate(SimpleDateEdit.$parseDate(start), value)
        if (startCompare === 'before') {
          // 当前时间在开始时间之前则禁用
          disable = true
        } else if (startCompare === 'same' && !start.eq) {
          disable = true
        }
      }
      if (!disable && end) {
        const endCompare = SimpleDateEdit.$compareDate(SimpleDateEdit.$parseDate(end), value)
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
    separator: '-',
    formatWithTime: 'YYYY-MM-DD HH:mm:ss',
    hideClear: false,
    time: {
      format: 'HH:mm:ss',
      defaultValue: '00:00:00',
      defaultEndValue: '23:59:59'
    }
  }
  $option: SimpleDateEditOption<R>
  constructor(initOption: SimpleDateEditInitOption<R>, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    const option = initOption.option || {} as Partial<SimpleDateEditOption<R>>
    const $constructor = (this.constructor as typeof SimpleDateEdit)
    const $defaultOption = $constructor.$defaultOption
    const format = option.format || option.time ? $defaultOption.formatWithTime : $defaultOption.format
    this.$option = {
      format: format,
      showFormat: option.showFormat || format,
      hideClear: option.hideClear === undefined ? $defaultOption.hideClear : option.hideClear
    }
    if ($constructor.$range) {
      (this.$option as SimpleDateEditOption<true>).separator = (option as Partial<SimpleDateEditOption<true>>).separator || $defaultOption.separator
    }
    if (option.time) {
      const timeFormat = option.time.format || $defaultOption.time.format
      this.$option.time = {
        format: timeFormat,
        showFormat: option.time.showFormat || timeFormat,
        defaultValue: option.time.defaultValue || $defaultOption.time.defaultValue
      }
      if ($constructor.$range) {
        (this.$option as SimpleDateEditOption<true>).time!.defaultEndValue = (option as Partial<SimpleDateEditOption<true>>).time!.defaultEndValue || $defaultOption.time.defaultEndValue
      }
    }
    if (option.disabledDate) {
      if (typeof option.disabledDate === 'object') {
        this.$option.disabledDate = $constructor.$disabledDate(option.disabledDate)
      } else {
        this.$option.disabledDate = option.disabledDate
      }
    }
    if (this.parse === undefined) {
      this.parse = $constructor.$range ? defaultRangeParse as functionType<any> : defaultParse as functionType<any>
    }
    if (this.fetch === undefined) {
      this.fetch = $constructor.$range ? defaultRangeFetch as functionType<any> : defaultFetch as functionType<any>
    }
  }
}

export default SimpleDateEdit
