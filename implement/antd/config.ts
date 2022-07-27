import InterfaceData from "../../src/mod/InterfaceData"
import { baseObject, objectAny } from "../../ts"

export interface dictType {
  option?: objectAny,
  eventList?: string[],
  rule?: {
    trigger: string[],
    autoTrigger: string[],
    message: (label: InterfaceData<string>) => baseObject<string>
  }
}

const config = {
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
          message: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
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
          message: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
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
          message: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
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
        option: {
          search: {
            reload: false
          }
        },
        eventList: ['change'],
        rule: {
          trigger: ['blur'],
          autoTrigger: ['change', 'select'],
          message: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
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
          message: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
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
          message: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
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
          message: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
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
          message: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `上传${labeldata[prop]}`
            })
            return data
          }
        }
      },
      $button: {
        eventList: ['click']
      },
      $customize: {
        eventList: ['change'],
        rule: {
          trigger: ['blur'],
          autoTrigger: ['change'],
          message: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `请选择${labeldata[prop]}`
            })
            return data
          }
        }
      },
      $text: {
      },
      $slot: {
      }
    },
    getData(name: string): null | dictType {
      const prop = '$' + name
      if ((this.data as any)[prop]) {
        return (this.data as any)[prop]
      } else {
        console.error(`未找到对应的编辑逻辑:${name}`)
        return null
      }
    }
  },
  format: {
    list: {
      width: 100,
      ellipsis: true,
      autoText: true
    }
  }
}

export default config
