import InterfaceData from "./src/lib/InterfaceData"

export interface DictType {
  default: any,
  width?: string,
  option?: Record<PropertyKey, any>,
  placeholder?: (label: InterfaceData<string>) => Record<PropertyKey, string>,
  message?: (label: InterfaceData<string>) => Record<PropertyKey, string>
}

const config = {
  BaseData: {
    active: {
      data: 'actived',
      auto: true
    }
  },
  SearchData: {
    menu: [
      {
        type: 'primary',
        icon: 'search',
        name: '查询',
        act: 'search'
      },
      {
        type: 'default',
        icon: 'reload',
        name: '重置',
        act: 'reset'
      }
    ]
  },
  PaginationData: {
    size: {
      current: 10,
      list: ['10', '20', '50', '100'],
      change: true
    },
    jumper: {
      change: true
    }
  },
  LayoutData: {
    grid: 24,
    label: 8,
    content: 16
  },
  UpdateData: {
    offset: 10000
  },
  DictionaryList: {
    format: {
      depth: Symbol('depth')
    }
  },
  StatusItem: {
    data: {
      load: {
        trigger: {
          start: {
            from: ['un', 'fail'],
            to: 'ing'
          },
          success: {
            from: ['ing'],
            to: 'success'
          },
          fail: {
            from: ['ing'],
            to: 'fail'
          }
        },
        list: ['un', 'ing', 'success', 'fail']
      },
      operate: {
        trigger: {
          start: {
            from: ['un'],
            to: 'ing'
          },
          success: {
            from: ['ing'],
            to: 'un'
          },
          fail: {
            from: ['ing'],
            to: 'un'
          }
        },
        list: ['un', 'ing'],
        option: {
          type: 'count'
        }
      },
      end: {
        trigger: {
          start: {
            from: ['un', 'end'],
            to: 'ing'
          },
          success: {
            from: ['ing'],
            to: 'end'
          },
          fail: {
            from: ['ing'],
            to: 'un'
          }
        },
        list: ['un', 'ing', 'end']
      }
    }
  },
  DefaultEdit: {
    option: {
      valuePropList: ['init', 'default', 'reset'],
      data: {
        $input: {
          default: '',
          option: {
            maxLength: 100,
            hideClear: false
          },
          placeholder: function (label: InterfaceData<string>) {
            const data: Record<PropertyKey, string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `请输入${labeldata[prop]}`
            })
            return data
          }
        },
        $inputNumber: {
          default: '',
          placeholder: function (label: InterfaceData<string>) {
            const data: Record<PropertyKey, string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `请输入${labeldata[prop]}`
            })
            return data
          }
        },
        $textArea: {
          default: '',
          option: {
            maxLength: 500,
            autoSize: false,
            hideClear: false
          },
          placeholder: function (label: InterfaceData<string>) {
            const data: Record<PropertyKey, string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `请输入${labeldata[prop]}`
            })
            return data
          }
        },
        $switch: {
          width: 'auto',
          default: false
        },
        $select: {
          default: undefined,
          option: {
            search: {
              reload: false
            }
          },
          placeholder: function (label: InterfaceData<string>) {
            const data: Record<PropertyKey, string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `请选择${labeldata[prop]}`
            })
            return data
          }
        },
        $cascader: {
          default: undefined,
          placeholder: function (label: InterfaceData<string>) {
            const data: Record<PropertyKey, string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `请选择${labeldata[prop]}`
            })
            return data
          }
        },
        $date: {
          default: undefined,
          placeholder: function (label: InterfaceData<string>) {
            const data: Record<PropertyKey, string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `请选择${labeldata[prop]}`
            })
            return data
          }
        },
        $dateRange: {
          default: [],
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          placeholder: function (label: InterfaceData<string>) {
            const data = {
              default: [`开始时间`, `结束时间`]
            }
            return data
          }
        },
        $file: {
          default: undefined,
          placeholder: function (label: InterfaceData<string>) {
            const data: Record<PropertyKey, string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `上传${labeldata[prop]}`
            })
            return data
          }
        },
        $button: {
          width: 'auto',
          default: undefined,
          placeholder: function (label: InterfaceData<string>) {
            return label.getMain()
          }
        },
        $customize: {
          default: undefined,
          placeholder: function (label: InterfaceData<string>) {
            const data: Record<PropertyKey, string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `请选择${labeldata[prop]}`
            })
            return data
          }
        },
        $text: {
          default: undefined
        },
        $slot: {
          default: undefined
        }
      },
      getData(name: string): undefined | DictType {
        const prop = '$' + name
        if ((this.data as any)[prop]) {
          return (this.data as any)[prop]
        } else {
          console.error(`未找到对应的编辑逻辑:${name}`)
          return undefined
        }
      }
    }
  },
  DefaultList: {
    width: 100,
    ellipsis: true,
    auto: true
  },
  DefaultInfo: {
  }
}

export default config
