/* eslint-disable @typescript-eslint/no-explicit-any */
import { setDataByDefault } from 'complex-utils'
import { dateDisabledDateOption, dateDisabledDateOptionValue, dateTimeOption } from './mod/DefaultEdit'
import dayjs, { Dayjs } from 'dayjs'
import { date } from 'complex-plugin'

date.setCallback((currentDate) => {
  date.setData(dayjs(currentDate), 'dayjs')
  date.setData(date.getData('today:start'), 'dayjs:today:start')
  date.setData(date.getData('today:end'), 'dayjs:today:end')
  date.setData(date.getData('nextday:start'), 'dayjs:nextday:start')
  date.setData(date.getData('nextday:end'), 'dayjs:nextday:end')
}, true)

export const formatInitOption = function(initOption?: any, defaultInitOption?: any, emptyErrorMsg?: any) {
  if (!initOption) {
    if (emptyErrorMsg) {
      throw new Error(emptyErrorMsg)
    } else {
      initOption = {}
    }
  } else if (initOption === true) {
    initOption = {}
  }
  if (defaultInitOption) {
    setDataByDefault(initOption, defaultInitOption)
  }
  return initOption
}

export const buildOptionData = function<D>(structData: D, initData?: Partial<D>) {
  if (initData) {
    for (const prop in initData) {
      structData[prop] = initData[prop]!
    }
  }
  return structData
}

export const dateConfig = {
  parseTime(time?: Partial<dateTimeOption>): undefined | dateTimeOption {
    if (time) {
      if (!time.show) {
        time.show = 'HH:mm:ss'
      }
      if (!time.defaultValue) {
        time.defaultValue = '00:00:00'
      }
      return time as dateTimeOption
    } else {
      return undefined
    }
  },
  parseDisabledOption(value: dateDisabledDateOptionValue['data']): Dayjs {
    if (value === 'current') {
      return date.getData('dayjs')
    } else if (value === 'today:start') {
      return date.getData('dayjs:today:start')
    } else if (value === 'today:end') {
      return date.getData('dayjs:today:end')
    } else if (value === 'nextday:start') {
      return date.getData('dayjs:nextday:start')
    } else if (value === 'nextday:end') {
      return date.getData('dayjs:nextday:end')
    } else {
      return value
    }
  },
  disabledDate(value: Dayjs, { start, end }: dateDisabledDateOption) {
    let disabled = false
    if (start) {
      const startDate = this.parseDisabledOption(start.data)
      if (value.isBefore(startDate)) {
        // 当前时间在开始时间前，则为禁用
        disabled = true
      } else if (start.eq && value.isSame(startDate)) {
        // 当前时间不能等于开始时间
        disabled = true
      }
    }
    if (!disabled && end) {
      const endDate = this.parseDisabledOption(end.data)
      if (value.isAfter(endDate)) {
        // 当前时间在结束时间后，则为禁用
        disabled = true
      } else if (end.eq && value.isSame(endDate)) {
        // 当前时间不能等于结束时间
        disabled = true
      }
    }
    return disabled
  }
}
