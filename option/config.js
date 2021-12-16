let config = {
  option: {
    valuePropList: ['initValue', 'defaultValue', 'resetValue'],
    data: {
      $input: {
        defaultValue: '',
        placeholder: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请输入${labeldata[prop]}`
          })
          return data
        }
      },
      $inputNumber: {
        defaultValue: '',
        placeholder: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请输入${labeldata[prop]}`
          })
          return data
        }
      },
      $textArea: {
        defaultValue: '',
        placeholder: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请输入${labeldata[prop]}`
          })
          return data
        }
      },
      $switch: {
        width: 'auto',
        defaultValue: false
      },
      $select: {
        defaultValue: undefined,
        placeholder: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请选择${labeldata[prop]}`
          })
          return data
        }
      },
      $cascader: {
        defaultValue: undefined,
        placeholder: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请选择${labeldata[prop]}`
          })
          return data
        }
      },
      $date: {
        defaultValue: undefined,
        placeholder: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `请选择${labeldata[prop]}`
          })
          return data
        }
      },
      $dateRange: {
        defaultValue: [],
        placeholder: function (label) {
          let data = {
            default: [`开始时间`, `结束时间`]
          }
          return data
        }
      },
      $file: {
        width: 'auto',
        defaultValue: undefined,
        placeholder: function (label) {
          let data = {}
          label.map((labeldata, prop) => {
            data[prop] = `上传${labeldata[prop]}`
          })
          return data
        }
      },
      $button: {
        width: 'auto',
        defaultValue: undefined,
        placeholder: function (label) {
          return label.getMain()
        }
      },
      $slot: {
        defaultValue: undefined
      }
    },
    getData(name) {
      let prop = '$' + name
      if (this.data[prop]) {
        return this.data[prop]
      } else {
        console.error(`未找到对应的编辑逻辑:${name}`)
        return null
      }
    }
  },
  antd: {
    edit: {
      data: {
        $input: {
          option: {
            maxLength: 20,
            hideClear: false
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
        $inputNumber: {
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
        $textArea: {
          option: {
            maxLength: 100,
            autoSize: false,
            allowClear: false
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
        $switch: {
          eventList: ['change']
        },
        $select: {
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
        $cascader: {
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
        $date: {
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
        $dateRange: {
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
        $file: {
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
        $button: {
          eventList: ['click'],
          placeholder: function (label) {
            return label.getMain()
          }
        },
        $slot: {
        }
      },
      getData(name) {
        let prop = '$' + name
        if (this.data[prop]) {
          return this.data[prop]
        } else {
          console.error(`未找到对应的编辑逻辑:${name}`)
          return null
        }
      }
    },
    format: {
      list: {
        width: 100,
        scrollWidth: 100,
        ellipsis: true,
        autoText: true
      }
    }
  }
}

export default config
