import { hasProp } from "complex-utils-next"
import DefaultMod, { DefaultModInitOption } from "./DefaultMod"
import InterfaceValue, { InterfaceValueInitOption } from "../lib/InterfaceValue"
import DictionaryValue, { functionType } from "./DictionaryValue"

// 考虑将width转换为layout的接口数据，通过判断值实现main/label/content

export interface DefaultEditInitOption extends DefaultModInitOption {
  colon?: boolean
  multiple?: boolean
  required?: InterfaceValueInitOption<boolean>
  disabled?: InterfaceValueInitOption<boolean>
  placeholder?: InterfaceValueInitOption<string>
  width?: string | number | {
    data: string | number
    main: string | number
  }
  value?: {
    default?: unknown
    init?: unknown
    reset?: unknown
    [prop: PropertyKey]: unknown
  }
  on?: Record<PropertyKey, (...args: unknown[]) => unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: Record<PropertyKey, Record<PropertyKey, unknown>[]>
  message?: InterfaceValueInitOption<string>
  edit?: false | functionType<unknown> // 数据=>编辑 格式化
  post?: false | functionType<unknown> // 编辑=>来源 格式化
  slot?: {
    type?: string
    name?: string
    label?: string
    render?: (...args: unknown[]) => unknown
  }
}

class DefaultEdit extends DefaultMod {
  static $name = 'DefaultEdit'
  static $defaultValue = function(multiple: boolean) {
    return !multiple ? undefined : []
  }
  static $defaultPlaceholder = function (name: InterfaceValue<string>) {
    const data: Record<PropertyKey, string> = {}
    name.map((value, prop) => {
      data[prop] = `请输入${value[prop]}`
    })
    return data
  }
  colon: InterfaceValue<boolean>
  multiple: boolean
  required: InterfaceValue<boolean>
  disabled: InterfaceValue<boolean>
  placeholder?: InterfaceValue<string>
  $width: {
    data?: string
    main?: string
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $rules: InterfaceValue<Record<PropertyKey, unknown>[]>
  message: InterfaceValue<string>
  $value!: {
    default: unknown
    init: unknown
    reset: unknown
    [prop: PropertyKey]: unknown
  }
  edit?: false | functionType<unknown>
  post?: false | functionType<unknown>
  $on: Record<PropertyKey, (...args: unknown[]) => unknown>
  $slot!: {
    type: 'auto' | 'main' | 'item' | 'model'
    name: string
    label: string
    render?: (...args: unknown[]) => unknown
  }
  constructor(initOption: DefaultEditInitOption, modName?: string, parent?: DictionaryValue) {
    super(initOption, modName, parent)
    this.$setParent(parent)
    this.colon = new InterfaceValue(initOption.colon === undefined ? true : initOption.colon)
    this.multiple = !!initOption.multiple
    this.required = new InterfaceValue(initOption.required || false)
    this.disabled = new InterfaceValue(initOption.disabled || false)
    // 组件事件监控
    this.edit = initOption.edit
    this.post = initOption.post
    this.$on = initOption.on || {}
    const $constructor = (this.constructor as typeof DefaultEdit)
    if (initOption.placeholder === undefined && parent) {
      this.placeholder = new InterfaceValue($constructor.$defaultPlaceholder(parent.$getInterfaceData('name')))
    }
    // 宽度设置
    const width = initOption.width
    if (width !== undefined || width !== null) {
      switch (typeof width) {
        case 'object':
          this.$width = {
            data: typeof width.data === 'number' ? width.data + 'px' : width.data,
            main: typeof width.main === 'number' ? width.main + 'px' : width.main
          }
          break;
        case 'number':
          this.$width = {
            data: width + 'px'
          }
          break;
        default:
          this.$width = {
            data: width
          }
          break;
      }
    } else {
      this.$width = {}
    }
    const initOptionValue = initOption.value || {}

    const defaultValue = hasProp(initOptionValue, 'default') ? initOptionValue.default : $constructor.$defaultValue(this.multiple)
    const initValue = hasProp(initOptionValue, 'init') ? initOptionValue.init : defaultValue
    const resetValue = hasProp(initOptionValue, 'reset') ? initOptionValue.reset : defaultValue
    this.$value = {
      default: defaultValue,
      init: initValue,
      reset: resetValue
    }
    const slot = initOption.slot || {}
    if (!slot.type) { // slot类型 auto/main/item/model
      slot.type = 'auto'
    }
    if (!slot.name) { // name=>插槽默认名
      slot.name = this.$prop
    }
    if (!slot.label) { // label=>title
      slot.label = slot.name + '-label'
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.$slot = slot as any
    // rule
    if (initOption.rules) {
      this.$rules = new InterfaceValue(initOption.rules)
    } else {
      this.$rules = new InterfaceValue({
        default: [{}]
      })
    }
    let message = new InterfaceValue(initOption.message)
    if (!message.isInit() && this.placeholder) {
      message = this.placeholder
    }
    this.message = message
    this.$rules.map((rules, prop) => {
      const ruleList = rules[prop]
      if (ruleList) {
        for (let n = 0; n < ruleList.length; n++) {
          const rule = ruleList[n];
          if (rule.required === undefined) {
            rule.required = this.required.getValue(prop)
          }
          if (rule.message === undefined && this.message.isInit()) {
            rule.message = this.message.getValue(prop)
          }
        }
      }
    })
  }
  setValue(value: unknown, prop = 'default') {
    this.$value[prop] = value
  }
  getValue(prop = 'default') {
    const value = this.$value[prop]
    if (typeof value !== 'function') {
      return value
    } else {
      return value()
    }
  }
}

export default DefaultEdit