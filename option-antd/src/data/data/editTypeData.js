import _func from 'complex-func'
import timeUtils from './timeUtils'

let editTypeData = {
  data: {
    type_input: {
      defaultdata: '',
      placeholder: function (label) {
        let data = {}
        label.map((labeldata, prop) => {
          data[prop] = `请输入${labeldata[prop]}`
        })
        return data
      },
      eventList: ['change'],
      rule: {
        trigger: ['blur'],
        autoTrigger: ['input', 'change'],
        message: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请输入${labeldata[prop]}`
          })
          return data
        }
      }
    },
    type_inputNumber: {
      defaultdata: '',
      placeholder: function (label) {
        let data = {}
        label.map((labeldata, prop) => {
          data[prop] = `请输入${labeldata[prop]}`
        })
        return data
      },
      eventList: ['change'],
      rule: {
        trigger: ['blur'],
        autoTrigger: ['input', 'change'],
        message: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请输入${labeldata[prop]}`
          })
          return data
        }
      }
    },
    type_switch: {
      defaultdata: false,
      eventList: ['change']
    },
    type_select: {
      defaultdata: undefined,
      placeholder: function (label) {
        let data = {}
        label.map((labeldata, prop) => {
          data[prop] = `请选择${labeldata[prop]}`
        })
        return data
      },
      eventList: ['change'],
      rule: {
        trigger: ['blur'],
        autoTrigger: ['change', 'select'],
        message: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请选择${labeldata[prop]}`
          })
          return data
        }
      }
    },
    type_date: {
      defaultdata: undefined,
      timeOptionFormat: timeUtils.timeOptionFormat,
      timeCheck: timeUtils.timeCheck,
      funcEdit: timeUtils.funcEdit,
      funcUnEdit: timeUtils.funcUnEdit,
      timeCheckOptionFormat: timeUtils.timeCheckOptionFormat,
      placeholder: function (label) {
        let data = {}
        label.map((labeldata, prop) => {
          data[prop] = `请选择${labeldata[prop]}`
        })
        return data
      },
      eventList: ['change'],
      rule: {
        trigger: 'change',
        autoTrigger: ['ok'],
        message: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请选择${labeldata[prop]}`
          })
          return data
        }
      }
    },
    type_dateRange: {
      defaultdata: [],
      timeOptionFormat: timeUtils.timeOptionFormat,
      timeCheck: timeUtils.timeCheck,
      funcEdit: timeUtils.funcEditRange,
      funcUnEdit: timeUtils.funcUnEditRange,
      timeCheckOptionFormat: timeUtils.timeCheckOptionFormat,
      placeholder: function (label) {
        let data = {
          default: [`开始时间`, `结束时间`]
        }
        return data
      },
      eventList: ['change'],
      rule: {
        trigger: 'change',
        autoTrigger: ['ok'],
        message: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请选择${labeldata[prop]}`
          })
          return data
        }
      }
    },
    type_file: {
      defaultdata: undefined,
      placeholder: function (label) {
        let data = {}
        label.map((labeldata, prop) => {
          data[prop] = `上传${labeldata[prop]}`
        })
        return data
      },
      eventList: ['change'],
      rule: {
        trigger: ['input', 'change'],
        autoTrigger: [],
        message: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `上传${labeldata[prop]}`
          })
          return data
        }
      }
    },
    type_button: {
      defaultdata: undefined,
      eventList: ['click'],
      placeholder: function (label) {
        return label.getMain()
      }
    },
    type_slot: {
      defaultdata: undefined
    }
  }
}

editTypeData.getData = function (type) {
  let prop = 'type_' + type
  if (this.data[prop]) {
    return this.data[prop]
  } else {
    console.error(`未找到对应的编辑逻辑:${type}`)
    return null
  }
}

export default editTypeData
