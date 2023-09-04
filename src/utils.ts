/* eslint-disable @typescript-eslint/no-explicit-any */
import { setDataByDefault } from 'complex-utils'
import { dateDisabledDateOption, dateTimeOption } from './mod/DefaultEdit'

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
  disabledDate(value: Date, { start, end }: dateDisabledDateOption) {
    // let disabled = false
    // if (start) {
    //   if (start === 'current') {
    //     date
    //   }
    // }
    // return disabled
  }
}
