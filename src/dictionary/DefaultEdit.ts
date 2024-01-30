import { hasProp } from "complex-utils"
import DefaultMod, { DefaultModInitOption } from "./DefaultMod"
import DictionaryValue, { functionType } from "../lib/DictionaryValue"
import InterfaceValue, { InterfaceValueInitOption } from "../lib/InterfaceValue"

export interface DefaultEditInitOption extends DefaultModInitOption {
  simple?: {
    value?: boolean
    rules?: boolean
  }
  colon?: boolean
  trim?: boolean
  multiple?: boolean
  required?: InterfaceValueInitOption<boolean>
  disabled?: InterfaceValueInitOption<boolean>
  placeholder?: InterfaceValueInitOption<string>
  value?: {
    default?: unknown
    init?: unknown
    reset?: unknown
    [prop: PropertyKey]: unknown
  }
  on?: Record<PropertyKey, (...args: unknown[]) => unknown>
  rules?: Record<PropertyKey, Record<PropertyKey, unknown>[]>
  message?: InterfaceValueInitOption<string>
  edit?: false | functionType<unknown> // 数据=>编辑 格式化
  post?: false | functionType<unknown> // 编辑=>来源 格式化
}

class DefaultEdit extends DefaultMod {
  static $name = 'DefaultEdit'
  static $formatConfig = { name: 'Data:DefaultEdit', level: 50, recommend: true }
  static $defaultValue = function(multiple: boolean) {
    return !multiple ? undefined : []
  }
  static $defaultTrim = false
  static $defaultPlaceholder = function (name: InterfaceValue<string>) {
    const data: Record<PropertyKey, string> = {}
    name.map((value, prop) => {
      data[prop] = `请输入${value[prop]}`
    })
    return data
  }
  simple: {
    value?: boolean
    rules?: boolean
  }
  colon: InterfaceValue<boolean>
  trim: boolean
  multiple: boolean
  required: InterfaceValue<boolean>
  disabled: InterfaceValue<boolean>
  placeholder?: InterfaceValue<string>
  $rules: InterfaceValue<Record<PropertyKey, unknown>[]>
  message: InterfaceValue<string>
  $value: {
    default?: unknown
    init?: unknown
    reset?: unknown
    [prop: PropertyKey]: unknown
  }
  edit?: false | functionType<unknown>
  post?: false | functionType<unknown>
  $on: Record<PropertyKey, (...args: unknown[]) => unknown>
  constructor(initOption: DefaultEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.simple = initOption.simple || {}
    this.colon = new InterfaceValue(initOption.colon === undefined ? true : initOption.colon)
    this.multiple = !!initOption.multiple
    this.required = new InterfaceValue(initOption.required || false)
    this.disabled = new InterfaceValue(initOption.disabled || false)
    // 组件事件监控
    this.edit = initOption.edit
    this.post = initOption.post
    this.$on = initOption.on || {}
    const $constructor = (this.constructor as typeof DefaultEdit)
    this.trim = initOption.trim === undefined ? $constructor.$defaultTrim : initOption.trim
    if (initOption.placeholder === undefined && parent) {
      this.placeholder = new InterfaceValue($constructor.$defaultPlaceholder(parent.$getInterfaceData('name')))
    } else if (initOption.placeholder) {
      this.placeholder = new InterfaceValue(initOption.placeholder)
    }
    if (this.simple.value !== true) {
      const initOptionValue = initOption.value || {}
      const defaultValue = hasProp(initOptionValue, 'default') ? initOptionValue.default : $constructor.$defaultValue(this.multiple)
      const initValue = hasProp(initOptionValue, 'init') ? initOptionValue.init : defaultValue
      const resetValue = hasProp(initOptionValue, 'reset') ? initOptionValue.reset : defaultValue
      this.$value = {
        default: defaultValue,
        init: initValue,
        reset: resetValue
      }
    } else {
      this.$value = {}
    }
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
    if (this.simple.rules !== true) {
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
