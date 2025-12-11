import { isArray } from 'complex-utils'
import { editPayloadType } from './../lib/DictionaryValue';
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
  complexDisabledDate: boolean
  disabledDate?: (value: any, payload?: editPayloadType, rangeLimit?: number) => boolean
  time?: {
    format: string
    showFormat: string
    defaultValue: string
  }
}

export interface PartialBaseSimpleDateEditOption {
  format?: string
  showFormat?: string
  hideClear?: boolean
  complexDisabledDate?: boolean
  disabledDate?: dateConfig | ((value: any, payload?: editPayloadType, rangeLimit?: number) => boolean)
  time?: {
    format?: string
    showFormat?: string
    defaultValue?: string
  }
}

export interface RangeSimpleDateEditOption {
  separator?: string
  rangeLimit?: number // 时间范围时间间隔字段，仅range模式下生效，按照秒限制时间范围选择
  endProp?: string // 结束时间字段，存在则将数组解析，仅range模式下生效
  time?: {
    defaultEndValue?: string
  }
}

export type SimpleDateEditOption<R extends Boolean = false> = BaseSimpleDateEditOption & (R extends true ? RangeSimpleDateEditOption : {})

export type PartialSimpleDateEditOption<R extends Boolean = false> = PartialBaseSimpleDateEditOption & (R extends true ? RangeSimpleDateEditOption : {})

export interface SimpleDateEditInitOption<R extends Boolean = false> extends DefaultEditInitOption<false> {
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

const defaultCollect = function(this: SimpleDateEdit<false>, value: any) {
  const $constructor = (this.constructor as typeof SimpleDateEdit<false>)
  if ($constructor.$collect) {
    return $constructor.$collect(value, this.$option.format)
  } else {
    return value
  }
}

const defaultRangeParse = function(this: SimpleDateEdit<true>, valueList: string[]) {
  if (!valueList) return undefined
  const $constructor = (this.constructor as typeof SimpleDateEdit<true>)
  if ($constructor.$parse) {
    valueList = valueList.map(value => $constructor.$parse!(value, this.$option.format) as string)
  }
  return valueList
}

const defaultRangeCollect = function(this: SimpleDateEdit<true>, valueList: any[], payload: editPayloadType) {
  if (!valueList) return undefined
  const $constructor = (this.constructor as typeof SimpleDateEdit<true>)
  if ($constructor.$collect) {
    valueList = valueList.map(value => $constructor.$collect!(value, this.$option.format) as string)
  }
  if (this.$option.endProp) {
    payload.targetData[this.$option.endProp] = valueList[1]
    return valueList[0]
  } else {
    return valueList
  }
} as functionType<string | string[]>

class SimpleDateEdit<R extends Boolean = false> extends DefaultEdit<false> {
  static $name = 'SimpleDateEdit'
  static $width = undefined
  static $widthWithTime = 180
  static $widthWithoutTime = 120
  static $range = false
  static $defaultPlaceholder = (name: string) => `请选择${name}`
  static $parse: undefined | ((value: undefined | string, format: string) => undefined | any)
  static $collect: undefined | ((value: undefined | any, format: string) => undefined | string)
  static $parseDate = function(dateValue: dateConfigValue): any { return dateValue.value }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /**
   * @returns offset > 0 则other在target之后
   */
  static $compareDate = (target: any, other: any) => (other as Date).getTime() - (target as Date).getTime()
  static $disabledDate = (option: dateConfig) => (value: unknown, payload?: editPayloadType, rangeLimit?: number) => {
    const start = option.start
    const end = option.end
    let disable = false
    if (start) {
      const startOffset = SimpleDateEdit.$compareDate(SimpleDateEdit.$parseDate(start), value)
      if (startOffset < 0 || (startOffset === 0 && !start.eq)) {
        disable = true
      }
    }
    if (!disable && end) {
      const endOffset = SimpleDateEdit.$compareDate(SimpleDateEdit.$parseDate(end), value)
      if (endOffset > 0 || (endOffset === 0 && !end.eq)) {
        disable = true
      }
    }
    if (!disable && payload && rangeLimit) {
      // 时间范围选择器
      const currentRangeValue = payload.targetData[payload.prop]
      if (currentRangeValue) {
        const [startValue, endValue] = currentRangeValue
        const targetValue = startValue && endValue ? undefined : (startValue || endValue)
        if (targetValue) {
          const offset = Math.abs(SimpleDateEdit.$compareDate(targetValue, value))
          if (offset > rangeLimit * 1000) {
            disable = true
          }
        }
      }
    }
    return disable
  }
  static $parseRuleList = function($constructor: typeof DefaultEdit<boolean>, target: DefaultEdit<boolean>, formData: Record<PropertyKey, any>, _type?: string) {
    let ruleList = DefaultEdit.$parseRuleList($constructor, target, formData, _type)
    if (!ruleList && ($constructor as typeof SimpleDateEdit<boolean>).$range) {
      // 时间范围选择器
      ruleList = [
        $constructor.$parseRule({
          required: target.required,
          type: 'array',
          message: target.placeholder,
          validator(value) {
            return isArray(value) && !!value[0] && !!value[1]
          }
        }, formData)
      ]
    }
    return ruleList
  }
  static $defaultOption = {
    format: 'YYYY-MM-DD',
    separator: '-',
    formatWithTime: 'YYYY-MM-DD HH:mm:ss',
    hideClear: false,
    complexDisabledDate: false,
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
      hideClear: option.hideClear ?? $defaultOption.hideClear,
      complexDisabledDate: option.complexDisabledDate ?? $defaultOption.complexDisabledDate
    }
    if ($constructor.$range) {
      (this.$option as SimpleDateEditOption<true>).separator = (option as Partial<SimpleDateEditOption<true>>).separator || $defaultOption.separator
      if ((option as Partial<SimpleDateEditOption<true>>).rangeLimit) {
        (this.$option as SimpleDateEditOption<true>).rangeLimit = (option as Partial<SimpleDateEditOption<true>>).rangeLimit
      }
      if ((option as Partial<SimpleDateEditOption<true>>).endProp) {
        (this.$option as SimpleDateEditOption<true>).endProp = (option as Partial<SimpleDateEditOption<true>>).endProp
      }
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
      this.$option.disabledDate = typeof option.disabledDate === 'object' ? $constructor.$disabledDate(option.disabledDate) : option.disabledDate
    }
    this.parse = this.parse ?? ($constructor.$range ? defaultRangeParse : defaultParse) as functionType<any>
    this.collect = this.collect ?? ($constructor.$range ? defaultRangeCollect : defaultCollect) as functionType<any>
    this.$width = this.$width ?? (this.$option.time ? $constructor.$widthWithTime : $constructor.$widthWithoutTime)
  }
}

export default SimpleDateEdit
