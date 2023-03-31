import { getType, hasProp } from 'complex-utils'
import BaseData, { BaseDataInitOption } from '../data/BaseData'
import InterfaceData, { InterfaceDataInitOption } from '../lib/InterfaceData'
import config, { DictType } from '../../config'
import DictionaryData, { baseFunction, DictionanyModInitType } from '../lib/DictionaryData'

interface valueType {
  default?: any,
  init?: any,
  reset?: any,
  [prop: PropertyKey]: any
}

export interface DefaultEditInitOption extends BaseDataInitOption, DictionanyModInitType {
  type?: string
  reload?: boolean
  trim?: boolean
  multiple?: boolean
  required?: InterfaceDataInitOption<boolean>
  disabled?: InterfaceDataInitOption<boolean>
  placeholder?: InterfaceDataInitOption<string>
  message?: InterfaceDataInitOption<string>
  mainWidth?: string | number
  width?: string | number
  option?: Record<PropertyKey, any>
  localOption?: Record<PropertyKey, any>
  value?: valueType
  on?: Record<PropertyKey, (...args: any[]) => any>
  customize?: unknown
  rules?: InterfaceDataInitOption<any>
  edit?: false | baseFunction<unknown> // 数据=>编辑 格式化
  post?: false | baseFunction<unknown> // 编辑=>来源 格式化
  tips?: string | {
    data: string,
    location?: string,
    localOption?: Record<PropertyKey, any>
  }
  slot?: {
    type?: string,
    name?: string,
    label?: string,
    render?: (...args: any[]) => any
  }
}

class DefaultEdit extends BaseData {
  static $name = 'DefaultEdit'
  type: string
  reload: boolean
  trim: boolean
  multiple!: boolean
  required: InterfaceData<boolean>
  disabled: InterfaceData<boolean>
  placeholder?: InterfaceData<string>
  message!: InterfaceData<string | undefined>
  $mainWidth?: string
  $width?: string
  $rules!: InterfaceData<any>
  $value!: {
    default: any,
    init: any,
    reset: any,
    [prop: PropertyKey]: any
  }
  $option: Record<PropertyKey, any>
  $localOption: Record<PropertyKey, any>
  edit?: false | baseFunction<unknown>
  post?: false | baseFunction<unknown>
  $on: Record<PropertyKey, (...args: any[]) => any>
  $tips!: {
    data: string,
    location: string,
    localOption: Record<PropertyKey, any>
  }
  $slot!: {
    type: string,
    name: string,
    label: string,
    render?: (...args: any[]) => any
  }
  $customize?: unknown
  constructor(initOption: DefaultEditInitOption) {
    if (!initOption) {
      throw new Error('编辑数据模块初始化参数为空！')
    }
    if (initOption.module && initOption.module.pagination === true) {
      initOption.module.pagination = {
        size: {
          change: false,
          current: 10
        },
        jumper: false
      }
    }
    super(initOption)
    this.$triggerCreateLife('DefaultEdit', 'beforeCreate', initOption)
    this.type = initOption.type || 'input'
    this.trim = !!initOption.trim
    this.reload = initOption.reload || false // 异步二次加载判断值
    this.required = new InterfaceData(initOption.required || false)
    this.disabled = new InterfaceData(initOption.disabled || false)
    this.$option = {}
    this.$tips = {
      data: '',
      location: '',
      localOption: {}
    }
    if (!initOption.tips) {
      this.$tips = {
        data: '',
        location: '',
        localOption: {}
      }
    } else {
      if (typeof initOption.tips != 'object') {
        this.$tips = {
          data: initOption.tips || '',
          location: 'top',
          localOption: {}
        }
      } else {
        this.$tips = {
          data: initOption.tips.data,
          location: initOption.tips.location || 'top',
          localOption: initOption.tips.localOption || {}
        }
      }
    }
    // 组件事件监控
    this.$on = initOption.on || {}
    // 插件单独的设置，做特殊处理时使用，尽可能的将所有能用到的数据通过option做兼容处理避免问题
    // main = { props: {} } item = { props: {} }
    this.$localOption = initOption.localOption || {}
    const defaultOption = config.DefaultEdit.option.getData(this.type)
    if (!defaultOption) {
      this.$exportMsg(`对应的${this.type}不存在预定义，请检查代码或进行扩展！`)
    }
    if (defaultOption) {
      // 格式化占位符和检验规则
      if (defaultOption.placeholder) {
        if (!initOption.placeholder) {
          this.placeholder = new InterfaceData(defaultOption.placeholder((this.$getParent() as DictionaryData).$getInterfaceData('label')))
        } else {
          this.placeholder = new InterfaceData(initOption.placeholder)
        }
      }
    }
    // 宽度设置
    if (initOption.mainWidth) {
      const type = getType(initOption.mainWidth)
      if (type == 'number') {
        this.$mainWidth = initOption.mainWidth + 'px'
      } else {
        this.$mainWidth = initOption.mainWidth as string
      }
    }
    if (initOption.width) {
      const type = getType(initOption.width)
      if (type == 'number') {
        this.$width = initOption.width + 'px'
      } else {
        this.$width = initOption.width as string
      }
    } else if (initOption.width === undefined && defaultOption && defaultOption.width) {
      this.$width = defaultOption.width
    }
    const initOptionValue = initOption.value || {}
    const defaultValue = hasProp(initOptionValue, 'default') ? initOptionValue.default : defaultOption ? defaultOption.default : undefined
    const initValue = hasProp(initOptionValue, 'init') ? initOptionValue.init : defaultValue
    const resetValue = hasProp(initOptionValue, 'reset') ? initOptionValue.reset : defaultValue
    this.$value = {
      default: defaultValue,
      init: initValue,
      reset: resetValue
    }
    this.setMultiple(initOption.multiple || false, true)
    this.$slot = initOption.slot || {} as any
    if (!this.$slot.type) { // slot类型 auto/main/item/model
      this.$slot.type = 'auto'
    }
    if (!this.$slot.name) { // name=>插槽默认名
      this.$slot.name = this.$prop
    }
    if (!this.$slot.label) { // label=>title
      this.$slot.label = this.$slot.name + '-label'
    }
    this.$initOption(initOption, defaultOption, true)
    this.$initRules(initOption, defaultOption)
    this.$triggerCreateLife('DefaultEdit', 'created')
  }
  setMultiple(data: boolean, unTriggerSync?: boolean) {
    if (this.multiple !== data) {
      this.multiple = data
      if (this.multiple) {
        this.$initMultipleValue(true)
      }
      if (!unTriggerSync) {
        this.$syncData(true, 'setMultiple')
      }
    }
  }
  $initMultipleValue(unTriggerSync?: boolean) {
    for (let n = 0; n < config.DefaultEdit.option.valuePropList.length; n++) {
      const prop = config.DefaultEdit.option.valuePropList[n]
      const type = getType(this.getValueData(prop))
      if (type != 'array') {
        this.setValueData([], prop, true)
      }
    }
    if (!unTriggerSync) {
      this.$syncData(true, '$initMultipleValue')
    }
  }
  $initOption(initOption: DefaultEditInitOption, defaultOption?: DictType, unTriggerSync?: boolean) {
    if (!initOption.option) {
      initOption.option = {}
    }
    if (this.type == 'input') {
      // 输入框
      this.$option.type = initOption.option.type || 'text'
      this.$option.maxLength = initOption.option.maxLength || defaultOption!.option!.maxLength
      this.$option.hideClear = initOption.option.hideClear || defaultOption!.option!.hideClear
    } else if (this.type == 'inputNumber') {
      // 数字输入框
      this.$option.max = initOption.option.max === undefined ? Infinity : initOption.option.max
      this.$option.min = initOption.option.min === undefined ? -Infinity : initOption.option.min
      this.$option.precision = initOption.option.precision === undefined ? 0 : initOption.option.precision // 精确到几位小数，接受非负整数
      this.$option.step = initOption.option.step === undefined ? 1 : initOption.option.step // 点击步进
    } else if (this.type == 'textArea') {
      // 文本域
      this.$option.maxLength = initOption.option.maxLength || defaultOption!.option!.maxLength
      this.$option.autoSize = initOption.option.autoSize || defaultOption!.option!.autoSize
      this.$option.allowClear = initOption.option.allowClear || defaultOption!.option!.allowClear
    } else if (this.type == 'switch') {
      // 开关
    } else if (this.type == 'select') {
      // 选择器
      // =>避免后期修改时存在的问题，基本数据结构提前生成，非当前必要字段也应生成
      this.$option.list = initOption.option.list || []
      this.$option.optionValue = initOption.option.optionValue || 'value'
      this.$option.optionLabel = initOption.option.optionLabel || 'label'
      this.$option.optionDisabled = initOption.option.optionDisabled || 'disabled'
      this.$option.hideArrow = initOption.option.hideArrow || false
      this.$option.hideClear = initOption.option.hideClear || false
      this.$option.autoWidth = initOption.option.autoWidth || false // 宽度自适应
      this.$option.noDataContent = initOption.option.noDataContent // 无数据时文字显示 == 默认不传使用antd的默认模板
      // if (this.$module.pagination) {
      //   // 存在分页相关设置
      //   if (!this.$func.page) {
      //     if (!this.$getData) {
      //       this.$exportMsg('选择器存在分页器时需要定义page回调或者$getData函数供分页时调用')
      //     }
      //     this.$func.page = (act, data) => {
      //       this.$loadData(true, this.$option.search.value).then(() => {
      //         //
      //       }, err => { this.$exportMsg('loadData失败！', 'error', { data: err }) })
      //     }
      //   }
      // }
      // // 添加默认的重置选项数据
      // if (!this.$func.resetList) {
      //   this.$func.resetList = () => {
      //     this.$option.list = []
      //     this.$resetPagination()
      //   }
      // }
    } else if (this.type == 'cascader') {
      // 级联选择
      this.$option.list = initOption.option.list || []
      this.$option.hideArrow = initOption.option.hideArrow || false
      this.$option.hideClear = initOption.option.hideClear || false
      this.setMultiple(true)
    } else if (this.type == 'date') {
      // 日期选择
    } else if (this.type == 'dateRange') {
      // 日期范围选择
    } else if (this.type == 'file') {
      // 文件
      this.$option.accept = initOption.option.accept || ''
      this.$option.multipleAppend = initOption.option.multipleAppend || false // 多选状态下多个文件中一个存在问题时的操作
      this.$option.maxNum = initOption.option.maxNum || 0
      this.$option.minNum = initOption.option.minNum || 0
      this.$option.maxSize = initOption.option.maxSize || 0
      this.$option.upload = initOption.option.upload || false
      this.$option.fileUpload = initOption.option.fileUpload || false
      this.$option.layout = initOption.option.layout === undefined ? 'auto' : initOption.option.layout
      if (this.$option.upload && !this.$option.fileUpload) {
        this.$exportMsg('上传插件需要定义上传方法:fileUpload=>option')
      }
    } else if (this.type == 'button') {
      // 按钮
      this.$option.loading = initOption.option.loading || false
      this.$option.type = initOption.option.type || 'default'
      this.$option.icon = initOption.option.icon || ''
      this.$option.name = initOption.option.name ? new InterfaceData(initOption.option.name) : this.placeholder
    } else if (this.type == 'text') {
      // 文字
      this.$option.data = initOption.option.data
      this.$option.style = initOption.option.style || {}
    } else if (this.type == 'customize') {
      // 自定义
      this.$customize = initOption.customize
      this.$option = initOption.option
    } else if (this.type == 'slot') {
      // 插槽
    }
    if (!unTriggerSync) {
      this.$syncData(true, '$initOption')
    }
  }
  $initRules(initOption: DefaultEditInitOption, defaultOption?: DictType, unTriggerSync?: boolean) {
    if (initOption.rules) {
      this.$rules = new InterfaceData(initOption.rules)
    } else {
      this.$rules = new InterfaceData([{}] as any)
    }
    let message = new InterfaceData(initOption.message)
    if (defaultOption) {
      if (!message.isInit()) {
        if (defaultOption.message) {
          message = new InterfaceData(defaultOption.message((this.$getParent() as DictionaryData).$getInterfaceData('label')))
        } else {
          message = this.placeholder as InterfaceData<string>
        }
      }
    }
    this.message = message
    this.$rules.map((data, prop) => {
      const ruleList = data[prop]
      for (const n in ruleList) {
        const rule = ruleList[n]
        if (rule.required === undefined) {
          rule.required = this.required.getData(prop)
        }
        if (rule.message === undefined && this.message.isInit()) {
          rule.message = this.message.getData(prop)
        }
      }
    })
    if (!unTriggerSync) {
      this.$syncData(true, '$initRules')
    }
  }
  setValueData(data: any, prop = 'default', unTriggerSync?: boolean) {
    this.$value[prop] = data
    if (!unTriggerSync) {
      this.$syncData(true, '$setValueData')
    }
  }
  getValueData(prop = 'default') {
    return this.$value[prop]
  }
  $checkReadyData() {
    return this.$getData
  }
  readyData() {
    if (this.$module.status && this.$module.promise && this.$checkReadyData()) {
      return this.$loadData(this.reload)
    } else {
      return Promise.resolve({ status: 'success' })
    }
  }
}

export default DefaultEdit
