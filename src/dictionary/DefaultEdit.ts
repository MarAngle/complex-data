import { hasProp } from "complex-utils"
import DictionaryValue from "../lib/DictionaryValue"
import InterfaceValue, { InterfaceValueInitOption } from "../lib/InterfaceValue"
import SimpleEdit, { SimpleEditInitOption } from "./SimpleEdit"

export interface DefaultEditInitOption extends SimpleEditInitOption {
  editable?: boolean // 是否为可编辑数据,不可编辑数据如按钮等控件为false,不可编辑在simple不传值的情况下,simple.value/rules为真
  simple?: { // 简单逻辑判断值
    value?: boolean // 值简单逻辑:即不加载
    placeholder?: boolean // 占位符不加载
    rules?: boolean // 规则判断简单逻辑:即不判断
  }
  trim?: boolean
  multiple?: boolean
  placeholder?: false | InterfaceValueInitOption<string>
  value?: {
    default?: any
    init?: any
    reset?: any
    [prop: PropertyKey]: any
  }
  rules?: Record<PropertyKey, Record<PropertyKey, any>[]>
  message?: InterfaceValueInitOption<string>
}

class DefaultEdit extends SimpleEdit {
  static $name = 'DefaultEdit'
  static $formatConfig = { name: 'DefaultEdit', level: 50, recommend: true }
  static $editable = true
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
  $editable: boolean
  simple: {
    value?: boolean
    placeholder?: boolean
    rules?: boolean
  }
  trim: boolean
  multiple: boolean
  placeholder?: InterfaceValue<string>
  $rules?: InterfaceValue<Record<PropertyKey, unknown>[]>
  message?: InterfaceValue<string>
  $value: {
    default?: any
    init?: any
    reset?: any
    [prop: PropertyKey]: any
  }
  constructor(initOption: DefaultEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    const $constructor = (this.constructor as typeof DefaultEdit)
    this.$editable = initOption.editable === undefined ? $constructor.$editable : initOption.editable
    this.simple = initOption.simple || {}
    if (!this.$editable) {
      if (this.simple.value === undefined) {
        this.simple.value = true
      }
      if (this.simple.rules === undefined) {
        this.simple.rules = true
      }
    }
    this.multiple = !!initOption.multiple
    this.trim = initOption.trim === undefined ? $constructor.$defaultTrim : initOption.trim
    if (this.simple.placeholder !== true) {
      if (initOption.placeholder === undefined && parent) {
        this.placeholder = new InterfaceValue($constructor.$defaultPlaceholder(parent.$getInterfaceData('name')))
      } else if (initOption.placeholder) {
        this.placeholder = new InterfaceValue(initOption.placeholder)
      }
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
    if (this.simple.rules !== true) {
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
            if (rule.message === undefined && this.message!.isInit()) {
              rule.message = this.message!.getValue(prop)
            }
          }
        }
      })
    }
  }
  setValue(value: any, prop = 'default') {
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
