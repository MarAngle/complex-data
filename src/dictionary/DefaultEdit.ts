import { hasProp, isArray } from "complex-utils"
import { SimpleType } from "complex-utils/src/type/getType"
import DefaultSimpleEdit, { DefaultSimpleEditInitOption } from "./DefaultSimpleEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface ruleOption {
  required?: boolean
  message?: string
  type?: SimpleType
  max?: number
  min?: number
  pattern?: RegExp
  trigger?: string[]
  validator?: (value: any, form: Record<PropertyKey, any>, ...args: any[]) => boolean | Promise<any>
}
// 考虑自定义校验参数，并实时构建，统一判断逻辑，构建函数由静态参数设置

export interface DefaultEditInitOption extends DefaultSimpleEditInitOption {
  editable?: boolean // 是否为可编辑数据,不可编辑数据如按钮等控件为false,不可编辑在simple不传值的情况下,simple.value/rules为真
  simple?: { // 简单逻辑判断值
    value?: boolean // 值简单逻辑:即不加载
    placeholder?: boolean // 占位符不加载
    rules?: boolean // 规则判断简单逻辑:即不判断
  }
  trim?: boolean
  multiple?: boolean
  placeholder?: false | string
  value?: {
    default?: any
    reset?: any
    [prop: PropertyKey]: any
  }
  rules?: ruleOption[]
}

function defaultMultipleValue() {
  return [] as any[]
}

class DefaultEdit<M extends boolean = false> extends DefaultSimpleEdit {
  static $name = 'DefaultEdit'
  static $formatConfig = { name: 'DefaultEdit', level: 50, recommend: true }
  static $editable = true
  static $defaultValue = function(multiple: boolean) {
    return !multiple ? undefined : defaultMultipleValue
  }
  static $defaultTrim = false
  static $defaultPlaceholder = function (name: string) {
    return `请输入${name}`
  }
  static $parseRuleList = function($constructor: typeof DefaultEdit<boolean>, target: DefaultEdit<boolean>, formData: Record<PropertyKey, any>, _type?: string) {
    if (target.$rules) {
      const ruleList = target.$rules.map(rule => {
        const ruleValue = { ...rule }
        if (ruleValue.required == undefined) {
          ruleValue.required = target.required
        }
        if (ruleValue.message == undefined && target.placeholder) {
          ruleValue.message = target.placeholder
        }
        return $constructor.$parseRule(ruleValue, formData)
      })
      return ruleList
    } else {
      if (target.multiple && target.required) {
        // 多选且必选时
        return [
          $constructor.$parseRule({
            required: target.required,
            type: 'array',
            message: target.placeholder,
            validator(value) {
              return isArray(value) && value.length > 0
            }
          }, formData)
        ]
      } else {
        return undefined
      }
    }
  }
  static $parseRule = function<R = ruleOption>(ruleValue: ruleOption, _form: Record<PropertyKey, any>): R {
    return ruleValue as R
  }
  $editable: boolean
  simple: {
    value?: boolean
    placeholder?: boolean
    rules?: boolean
  }
  trim: boolean
  multiple: M
  placeholder?: string
  $rules?: ruleOption[]
  $value: {
    default?: any
    reset?: any
    [prop: PropertyKey]: any
  }
  constructor(initOption: DefaultEditInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    const $constructor = (this.constructor as typeof DefaultEdit)
    this.$editable = initOption.editable == undefined ? $constructor.$editable : initOption.editable
    this.simple = initOption.simple || {}
    if (!this.$editable) {
      if (this.simple.value == undefined) {
        this.simple.value = true
      }
      if (this.simple.rules == undefined) {
        this.simple.rules = true
      }
    }
    this.multiple = !!initOption.multiple as M
    this.trim = initOption.trim == undefined ? $constructor.$defaultTrim : initOption.trim
    if (this.simple.placeholder !== true) {
      if (initOption.placeholder == undefined) {
        this.placeholder = $constructor.$defaultPlaceholder(this.$name!)
      } else if (initOption.placeholder) {
        this.placeholder = initOption.placeholder
      }
    }
    if (this.simple.value !== true) {
      const initOptionValue = initOption.value || {}
      const defaultValue = hasProp(initOptionValue, 'default') ? initOptionValue.default : $constructor.$defaultValue(this.multiple)
      const resetValue = hasProp(initOptionValue, 'reset') ? initOptionValue.reset : defaultValue
      if (defaultValue || resetValue) {
        const valuePropList = [] as string[]
        if (defaultValue !== null && typeof defaultValue === 'object') {
          valuePropList.push('default')
        }
        if (resetValue !== null && typeof resetValue === 'object') {
          valuePropList.push('reset')
        }
        if (valuePropList.length > 0) {
          this.$exportMsg(`value属性[${valuePropList.join(',')}]为对象格式，可能会导致引用问题，请注意！`, 'warn')
        }
      }
      this.$value = {
        default: defaultValue,
        reset: resetValue
      }
    } else {
      this.$value = {}
    }
    if (this.simple.rules !== true) {
      // rule
      if (initOption.rules) {
        this.$rules = initOption.rules
      }
    }
  }
  parseRuleList(formData: Record<PropertyKey, any>, type?: string): undefined | Record<PropertyKey, any>[] {
    const $constructor = (this.constructor as typeof DefaultEdit)
    return $constructor.$parseRuleList($constructor, this, formData, type)
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
