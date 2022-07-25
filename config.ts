import InterfaceData from "./src/mod/InterfaceData"
import { baseObject } from "./ts"

export interface DictType {
  default: any,
  width?: string,
  placeholder?: (label: InterfaceData<string>) => baseObject<string>
}

const config = {
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
    size: 10,
    sizeList: ['10', '20', '50', '100'],
    jumperChange: true,
    sizeChange: true
  },
  LayoutData: {
    grid: 24,
    label: 8,
    content: 16
  },
  UpdateData: {
    offset: 10000
  },
  StatusData: {
    list: [
      {
        prop: 'load',
        data: {
          list: [
            {
              value: 'unload',
              label: '未加载'
            },
            {
              value: 'loading',
              label: '加载中'
            },
            {
              value: 'loaded',
              label: '已加载'
            }
          ]
        }
      },
      {
        prop: 'update',
        data: {
          list: [
            {
              value: 'updated',
              label: '等待更新'
            },
            {
              value: 'updating',
              label: '更新中'
            }
          ]
        }
      },
      {
        prop: 'operate',
        data: {
          list: [
            {
              value: 'operated',
              label: '等待操作'
            },
            {
              value: 'operating',
              label: '操作中'
            }
          ],
          option: {
            type: 'count',
            prop: 'operating'
          }
        }
      }
    ]
  },
  DefaultEdit: {
    option: {
      valuePropList: ['init', 'default', 'reset'],
      data: {
        $input: {
          default: '',
          placeholder: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `请输入${labeldata[prop]}`
            })
            return data
          }
        },
        $inputNumber: {
          default: '',
          placeholder: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `请输入${labeldata[prop]}`
            })
            return data
          }
        },
        $textArea: {
          default: '',
          placeholder: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
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
          placeholder: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `请选择${labeldata[prop]}`
            })
            return data
          }
        },
        $cascader: {
          default: undefined,
          placeholder: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `请选择${labeldata[prop]}`
            })
            return data
          }
        },
        $date: {
          default: undefined,
          placeholder: function (label: InterfaceData<string>) {
            const data: baseObject<string> = {}
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
            const data: baseObject<string> = {}
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
            const data: baseObject<string> = {}
            label.map((labeldata, prop) => {
              data[prop] = `请选择${labeldata[prop]}`
            })
            return data
          }
        },
        $slot: {
          default: undefined
        }
      },
      getData(name: string): null | DictType {
        const prop = '$' + name
        if ((this.data as any)[prop]) {
          return (this.data as any)[prop]
        } else {
          console.error(`未找到对应的编辑逻辑:${name}`)
          return null
        }
      }
    }
  }
}

export default config
