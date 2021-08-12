import _func from 'complex-func'
import moment from 'moment'

_func.current.setCallback(function(currentDate, from) {
  _func.current.setData(moment(currentDate), 'moment')
})
_func.current.setOffset(1000 * 60)

// 重要，此处函数基本赋值操作，this指向不确定，引用时不能使用this
let secRate = 1000
let minRate = secRate * 60
let hourRate = minRate * 60
let dayRate = hourRate * 24

const timeOption = {
  sec: {
    name: '秒',
    rate: secRate,
    format: 'YYYYMMDDHHmmss'
  },
  min: {
    name: '分',
    rate: minRate,
    format: 'YYYYMMDDHHmm'
  },
  hour: {
    name: '时',
    rate: hourRate,
    format: 'YYYYMMDDHH'
  },
  day: {
    name: '天',
    rate: dayRate,
    format: 'YYYYMMDD'
  }
}

const timeUtils = {
  getFormat: function (format = 'min') {
    if (timeOption[format]) {
      return timeOption[format].format
    } else {
      return format
    }
  },
  getTime: function (time) {
    if (time == 'current') {
      return _func.current.getData('moment')
    } else {
      return time
    }
  },
  funcEdit: function(data, format) {
    if (data && !moment.isMoment(data)) {
      data = moment(data, format)
    }
    return data
  },
  funcEditRange: function(data, format) {
    if (data && data.length > 0) {
      for (let n = 0; n < data.length; n++) {
        data[n] = timeUtils.funcEdit(data[n], format)
      }
    }
    return data
  },
  funcUnEdit: function(data, format) {
    return data ? data.format(format) : data
  },
  funcUnEditRange: function(data, format) {
    if (data && data.length > 0) {
      for (let n = 0; n < data.length; n++) {
        data[n] = timeUtils.funcUnEdit(data[n], format)
      }
    }
    return data
  },
  // 时间设置格式化
  timeOptionFormat(option, range) {
    if (option) {
      let defaultValue = '00:00:00'
      if (option === true) {
        option = {}
      }
      if (!option.format) {
        option.format = 'HH:mm:ss'
      }
      if (range) {
        if (!option.defaultValue) {
          option.defaultValue = [defaultValue, defaultValue]
        }
      } else {
        if (!option.defaultValue) {
          option.defaultValue = defaultValue
        }
      }
    } else {
      option = false
    }
    return option
  },
  // 时间可用判断设置项格式化总
  timeCheckOptionFormat: function (option) {
    if (option) {
      option.start = timeUtils.timeCheckOptionFormatNext(option.start)
      option.end = timeUtils.timeCheckOptionFormatNext(option.end)
      option.format = timeUtils.getFormat(option.format)
    }
    return option
  },
  // 时间可用判断设置项格式化
  timeCheckOptionFormatNext: function (timeOption) {
    if (timeOption) {
      if (timeOption === 'current') {
        timeOption = {
          data: 'current'
        }
      } else if (moment.isMoment(moment)) {
        timeOption = {
          data: timeOption
        }
      } else {
        let type = _func.getType(timeOption)
        if (type !== 'object') {
          timeOption = {
            data: moment(timeOption)
          }
        }
      }
      if (timeOption.eq === undefined) {
        timeOption.eq = false
      }
    } else {
      timeOption = false
    }
    return timeOption
  },
  // 时间可用判断函数=>根据设置项
  timeCheck: function (value, { start, end, format }) {
    let disabled = false
    if (value) {
      if (start) {
        let startLimit = timeUtils.getTime(start.data)
        // 当前时间在开始时间前则禁止
        if (!start.eq) {
          disabled = value.format(format) - startLimit.format(format) < 0
        } else {
          // 当前时间不能等于开始时间
          disabled = value.format(format) - startLimit.format(format) <= 0
        }
      }
      // 开始时间通过后继续检查结束时间
      if (!disabled && end) {
        let endLimit = timeUtils.getTime(end.data)
        // 当前时间在结束时间后则禁止
        if (!end.eq) {
          disabled = value.format(format) - endLimit.format(format) > 0
        } else {
          // 当前时间不能等于结束时间
          disabled = value.format(format) - endLimit.format(format) >= 0
        }
      }
    }
    return disabled
  },
  formatLimitOption(editLimitOption) {
    let type = _func.getType(editLimitOption)
    let limitOption
    if (type !== 'object') {
      limitOption = {
        num: editLimitOption
      }
    } else {
      limitOption = editLimitOption
    }
    if (!limitOption.type) {
      limitOption.type = 'day'
    }
    if (!limitOption.current) {
      limitOption.current = null
    }
    // if (limitOption.msg === undefined) {
    //   limitOption.msg = `时间间隔最大为${limitOption.num}${timeOption[limitOption.type].name}!`
    // }
    return limitOption
  },
  dateLimitCheck(value, limitOption) {
    if (limitOption.current) {
      let offset = timeUtils.getDateOffset(value, limitOption.current, limitOption.type)
      if (limitOption.eq) {
        return offset >= limitOption.num
      } else {
        return offset > limitOption.num
      }
    } else {
      return false
    }
  },
  timeLimitCheck(option, start, end, partial, limitOption) {
    // if (start && end) {
    //   if (limitOption) {

    //   }
    //   let offset = timeUtils.getDateOffset(start, end, limitOption)
    // }
  },
  getDateOffset(value, current, type) {
    if (value && current) {
      let option = timeOption[type]
      let formatValue = moment(_func.fillString(value.format(option.format), 14, 'end'), 'YYYYMMDDHHmmss')
      let currentValue = moment(_func.fillString(current.format(option.format), 14, 'end'), 'YYYYMMDDHHmmss')
      let offset = Math.abs(formatValue - currentValue) / option.rate
      return offset
    } else {
      return 0
    }
  }
}

export default timeUtils
