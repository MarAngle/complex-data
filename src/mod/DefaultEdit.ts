import { getType, hasProp } from 'complex-utils'
import BaseData, { BaseDataInitOption } from '../data/BaseData'
import InterfaceData, { InterfaceDataInitOption } from '../lib/InterfaceData'
import config, { DictType } from '../../config'
import DictionaryData, { baseFunction } from '../lib/DictionaryData'
import { ObserveItem } from './ObserveList'
import TipData, { TipDataInitOption } from './TipsData'
import AttributesData, { AttributesDataInitOption } from '../lib/AttributesData'

interface valueType {
  default?: any,
  init?: any,
  reset?: any,
  [prop: PropertyKey]: any
}

export type DefaultEditTypeDict = 'input' | 'inputNumber' | 'textArea' | 'switch' | 'select' | 'cascader' | 'date' | 'dateRange' | 'file' | 'button' | 'text' | 'customize' | 'slot'

export interface DefaultEditInputType {
  type: string
  maxLength: number
  hideClear: boolean
}
export interface DefaultEditInputNumberType {
  max: number
  min: number
  precision: number
  step: number
}
export interface DefaultEditTextAreaType {
  maxLength: number
  autoSize: boolean
  allowClear: boolean
}
export interface DefaultEditSelectType {
  list: Record<PropertyKey, any>[]
  optionValue: string
  optionLabel: string
  optionDisabled: string
  optionLocal: AttributesData
  hideArrow: boolean
  hideClear: boolean
  autoWidth: boolean
  noDataContent?: string
}
export interface DefaultEditCascaderType {
  list: Record<PropertyKey, any>[]
  hideArrow: boolean
  hideClear: boolean
}
export interface DefaultEditFileType {
  accept: string
  multipleAppend: boolean
  maxNum: number
  minNum: number
  maxSize: number
  upload: boolean
  fileUpload: boolean
  layout: string
}
export interface DefaultEditButtonType {
  loading: boolean
  type: string
  icon: string
  name?: string
}
export interface DefaultEditTextType {
  data: string
  style: Record<PropertyKey, any>
}

export type DefaultEditOptionType = DefaultEditInputType | DefaultEditInputNumberType | DefaultEditTextAreaType | DefaultEditSelectType | DefaultEditCascaderType | DefaultEditFileType | DefaultEditButtonType | DefaultEditTextType

export type PartialDefaultEditOptionType = Partial<DefaultEditInputType> | Partial<DefaultEditInputNumberType> | Partial<DefaultEditTextAreaType> | Partial<DefaultEditSelectType> | Partial<DefaultEditCascaderType> | Partial<DefaultEditFileType> | Partial<DefaultEditButtonType> | Partial<DefaultEditTextType>

export interface DefaultEditInitOption extends BaseDataInitOption<DictionaryData> {
  type?: DefaultEditTypeDict
  reload?: boolean
  trim?: boolean
  colon?: boolean
  multiple?: boolean
  required?: InterfaceDataInitOption<boolean>
  disabled?: InterfaceDataInitOption<boolean>
  placeholder?: InterfaceDataInitOption<string>
  message?: InterfaceDataInitOption<string>
  mainWidth?: string | number
  width?: string | number
  option?: PartialDefaultEditOptionType
  local?: {
    parent?: AttributesDataInitOption
    target?: AttributesDataInitOption
    child?: AttributesDataInitOption
  }
  value?: valueType
  on?: Record<PropertyKey, (...args: any[]) => any>
  customize?: unknown
  rules?: InterfaceDataInitOption<any>
  edit?: false | baseFunction<unknown> // 数据=>编辑 格式化
  post?: false | baseFunction<unknown> // 编辑=>来源 格式化
  observe?: ObserveItem['$observe']
  tip?: TipDataInitOption
  slot?: {
    type?: string,
    name?: string,
    label?: string,
    render?: (...args: any[]) => any
  }
}

class DefaultEdit extends BaseData<DictionaryData> implements ObserveItem{
  static $name = 'DefaultEdit'
  declare parent: DictionaryData
  prop: string
  type: DefaultEditTypeDict
  reload: boolean
  trim: boolean
  colon: boolean
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
  $option!: DefaultEditOptionType
  $local: {
    parent: AttributesData
    target: AttributesData
    child: AttributesData
  }
  edit?: false | baseFunction<unknown>
  post?: false | baseFunction<unknown>
  $on: Record<PropertyKey, (...args: any[]) => any>
  $observe?: ObserveItem['$observe']
  tip: TipData
  $slot!: {
    type: string,
    name: string,
    label: string,
    render?: (...args: any[]) => any
  }
  $customize?: unknown
  constructor(initOption: DefaultEditInitOption, modName: string, parent: DictionaryData) {
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
    initOption.parent = parent
    super(initOption)
    this.$triggerCreateLife('DefaultEdit', 'beforeCreate', initOption)
    this.prop = parent.$prop
    this.type = initOption.type || 'input'
    this.trim = !!initOption.trim
    this.colon = !!initOption.colon
    this.reload = initOption.reload || false // 异步二次加载判断值
    this.required = new InterfaceData(initOption.required || false)
    this.disabled = new InterfaceData(initOption.disabled || false)
    this.$option = {} as any
    this.tip = new TipData(initOption.tip)
    // 组件事件监控
    this.$on = initOption.on || {}
    // 插件单独的设置，做特殊处理时使用，尽可能的将所有能用到的数据通过option做兼容处理避免问题
    // main = { props: {} } item = { props: {} }
    const local = initOption.local || {}
    this.$local = {
      parent: new AttributesData(local.parent),
      target: new AttributesData(local.target),
      child: new AttributesData(local.child)
    }
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
      this.$slot.name = this.prop
    }
    if (!this.$slot.label) { // label=>title
      this.$slot.label = this.$slot.name + '-label'
    }
    this.$observe = initOption.observe
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
      (this.$option as DefaultEditInputType).type = (initOption.option as Partial<DefaultEditInputType>).type || 'text';
      (this.$option as DefaultEditInputType).maxLength = (initOption.option as Partial<DefaultEditInputType>).maxLength || defaultOption!.option!.maxLength;
      (this.$option as DefaultEditInputType).hideClear = (initOption.option as Partial<DefaultEditInputType>).hideClear || defaultOption!.option!.hideClear;
    } else if (this.type == 'inputNumber') {
      // 数字输入框
      (this.$option as DefaultEditInputNumberType).max = (initOption.option as Partial<DefaultEditInputNumberType>).max === undefined ? Infinity : (initOption.option as DefaultEditInputNumberType).max;
      (this.$option as DefaultEditInputNumberType).min = (initOption.option as Partial<DefaultEditInputNumberType>).min === undefined ? -Infinity : (initOption.option as DefaultEditInputNumberType).min;
      (this.$option as DefaultEditInputNumberType).precision = (initOption.option as Partial<DefaultEditInputNumberType>).precision === undefined ? 0 : (initOption.option as DefaultEditInputNumberType).precision; // 精确到几位小数，接受非负整数
      (this.$option as DefaultEditInputNumberType).step = (initOption.option as Partial<DefaultEditInputNumberType>).step === undefined ? 1 : (initOption.option as DefaultEditInputNumberType).step; // 点击步进
    } else if (this.type == 'textArea') {
      // 文本域
      (this.$option as DefaultEditTextAreaType).maxLength = (initOption.option as Partial<DefaultEditTextAreaType>).maxLength || defaultOption!.option!.maxLength;
      (this.$option as DefaultEditTextAreaType).autoSize = (initOption.option as Partial<DefaultEditTextAreaType>).autoSize || defaultOption!.option!.autoSize;
      (this.$option as DefaultEditTextAreaType).allowClear = (initOption.option as Partial<DefaultEditTextAreaType>).allowClear || defaultOption!.option!.allowClear;
    } else if (this.type == 'switch') {
      // 开关
    } else if (this.type == 'select') {
      // 选择器
      // =>避免后期修改时存在的问题，基本数据结构提前生成，非当前必要字段也应生成
      (this.$option as DefaultEditSelectType).list = (initOption.option as Partial<Partial<DefaultEditSelectType>>).list || [];
      (this.$option as DefaultEditSelectType).optionValue = (initOption.option as Partial<Partial<DefaultEditSelectType>>).optionValue || 'value';
      (this.$option as DefaultEditSelectType).optionLabel = (initOption.option as Partial<Partial<DefaultEditSelectType>>).optionLabel || 'label';
      (this.$option as DefaultEditSelectType).optionDisabled = (initOption.option as Partial<Partial<DefaultEditSelectType>>).optionDisabled || 'disabled';
      (this.$option as DefaultEditSelectType).hideArrow = (initOption.option as Partial<Partial<DefaultEditSelectType>>).hideArrow || false;
      (this.$option as DefaultEditSelectType).hideClear = (initOption.option as Partial<Partial<DefaultEditSelectType>>).hideClear || false;
      (this.$option as DefaultEditSelectType).autoWidth = (initOption.option as Partial<Partial<DefaultEditSelectType>>).autoWidth || false; // 宽度自适应
      (this.$option as DefaultEditSelectType).noDataContent = (initOption.option as Partial<Partial<DefaultEditSelectType>>).noDataContent; // 无数据时文字显示 == 默认不传使用antd的默认模板
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
      (this.$option as DefaultEditCascaderType).list = (initOption.option as Partial<DefaultEditCascaderType>).list || [];
      (this.$option as DefaultEditCascaderType).hideArrow = (initOption.option as Partial<DefaultEditCascaderType>).hideArrow || false;
      (this.$option as DefaultEditCascaderType).hideClear = (initOption.option as Partial<DefaultEditCascaderType>).hideClear || false;
      this.setMultiple(true)
    } else if (this.type == 'date') {
      // 日期选择
    } else if (this.type == 'dateRange') {
      // 日期范围选择
    } else if (this.type == 'file') {
      // 文件
      (this.$option as DefaultEditFileType).accept = (initOption.option as Partial<DefaultEditFileType>).accept || '';
      (this.$option as DefaultEditFileType).multipleAppend = (initOption.option as Partial<DefaultEditFileType>).multipleAppend || false; // 多选状态下多个文件中一个存在问题时的操作
      (this.$option as DefaultEditFileType).maxNum = (initOption.option as Partial<DefaultEditFileType>).maxNum || 0;
      (this.$option as DefaultEditFileType).minNum = (initOption.option as Partial<DefaultEditFileType>).minNum || 0;
      (this.$option as DefaultEditFileType).maxSize = (initOption.option as Partial<DefaultEditFileType>).maxSize || 0;
      (this.$option as DefaultEditFileType).upload = (initOption.option as Partial<DefaultEditFileType>).upload || false;
      (this.$option as DefaultEditFileType).fileUpload = (initOption.option as Partial<DefaultEditFileType>).fileUpload || false;
      (this.$option as DefaultEditFileType).layout = (initOption.option as Partial<DefaultEditFileType>).layout === undefined ? 'auto' : (initOption.option as DefaultEditFileType).layout;
      if ((this.$option as DefaultEditFileType).upload && !(this.$option as DefaultEditFileType).fileUpload) {
        this.$exportMsg('上传插件需要定义上传方法:fileUpload=>option')
      }
    } else if (this.type == 'button') {
      // 按钮
      (this.$option as DefaultEditButtonType).loading = (initOption.option as Partial<DefaultEditButtonType>).loading || false;
      (this.$option as DefaultEditButtonType).type = (initOption.option as Partial<DefaultEditButtonType>).type || 'default';
      (this.$option as DefaultEditButtonType).icon = (initOption.option as Partial<DefaultEditButtonType>).icon || '';
      (this.$option as DefaultEditButtonType).name = (initOption.option as Partial<DefaultEditButtonType>).name;
    } else if (this.type == 'text') {
      // 文字
      (this.$option as DefaultEditTextType).data = (initOption.option as Partial<DefaultEditTextType>).data || '';
      (this.$option as DefaultEditTextType).style = (initOption.option as Partial<DefaultEditTextType>).style || {};
    } else if (this.type == 'customize') {
      // 自定义
      this.$customize = initOption.customize
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
