import _func from 'complex-func'
import moment from 'moment'

// 创建事件更新回调，保存当前moment
_func.current.setCallback(function(currentDate, from) {
  _func.current.setData(moment(currentDate), 'moment')
})
_func.current.setOffset(1000 * 60)

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

// 重要，此处函数基本赋值操作，this指向不确定，引用时不能使用this
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
    let res
    if (data && !moment.isMoment(data)) {
      res = moment(data, format)
    }
    return res
  },
  funcEditRange: function(data, format) {
    let res
    if (data && data.length > 0) {
      res = []
      for (let n = 0; n < data.length; n++) {
        res[n] = timeUtils.funcEdit(data[n], format)
      }
    }
    return res
  },
  funcUnEdit: function(data, format) {
    let res
    if (data) {
      res = data.format(format)
    }
    return res
  },
  funcUnEditRange: function(data, format) {
    let res
    if (data && data.length > 0) {
      res = []
      for (let n = 0; n < data.length; n++) {
        res[n] = timeUtils.funcUnEdit(data[n], format)
      }
    }
    return res
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
  /**
   * 格式化时间限制设置
   * @param {object} editLimitOption
   * @returns {object}
   */
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
    if (limitOption.msg === undefined) {
      limitOption.msg = `时间间隔最大为${limitOption.num}${timeOption[limitOption.type].name}!`
    }
    if (!limitOption.disabledNext) {
      limitOption.disabledNext = function(value, strValue, msg) {
        _func.clearArray(value)
        _func.clearArray(strValue)
        if (msg) {
          _func.showmsg(msg, 'error')
        }
      }
    }
    return limitOption
  },
  /**
   * 检查value时间是否能通过时间限制
   * @param {*} value 时间
   * @param {*} limitOption 时间限制参数
   * @returns {boolean}
   */
  dateLimitCheck(value, limitOption) {
    return timeUtils.checkDateLimitByOption(value, limitOption.current, limitOption)
  },
  /**
   * 根据option检查开始结束时间是否不符合要求
   * @param {*} start 开始时间
   * @param {*} end 结束时间
   * @param {*} option 时间限制参数
   * @returns {boolean}
   */
  checkDateLimitByOption(start, end, option) {
    if (start && end) {
      let offset = timeUtils.getDateOffset(start, end, option.type)
      if (option.eq) {
        // eq(可相等)情况下限制条件会在相等时判断为否，通过限制判断
        return offset > option.num
      } else {
        // 不可相等（默认）情况下，相等时判断为否，不通过判断
        return offset >= option.num
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
  /**
   * 根据type获取时间间隔
   * @param {*} value 时间1
   * @param {*} current 时间2
   * @param {string} type 类型
   * @returns {number}
   */
  getDateOffset(value, current, type) {
    if (value && current) {
      let option = timeOption[type]
      let formatValue = moment(_func.fillString(value.format(option.format), 14, 'end'), 'YYYYMMDDHHmmss')
      let currentValue = moment(_func.fillString(current.format(option.format), 14, 'end'), 'YYYYMMDDHHmmss')
      // let offset = Math.abs(formatValue - currentValue) / option.rate
      let offset = Math.abs(formatValue.diff(currentValue)) / option.rate
      return offset
    } else {
      return 0
    }
  }
}

export default timeUtils
