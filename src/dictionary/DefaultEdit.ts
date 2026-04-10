import { deepCloneData, hasProp, isArray, isComplex } from "complex-utils"
import type { SimpleType } from "complex-utils/src/type/getType"
import DefaultSimpleEdit from "./DefaultSimpleEdit"
import type { DefaultSimpleEditInitOption } from "./DefaultSimpleEdit"
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

export interface DefaultEditInitOption<M extends boolean = boolean> extends DefaultSimpleEditInitOption {
  editable?: boolean // 是否为可编辑数据,不可编辑数据如按钮等控件为false,不可编辑在simple不传值的情况下,simple.value/rules为真
  simple?: { // 简单逻辑判断值
    value?: boolean // 值简单逻辑:即不加载
    placeholder?: boolean // 占位符不加载
    rules?: boolean // 规则判断简单逻辑:即不判断
  }
  deepClone?: boolean
  trim?: boolean
  multiple?: M
  placeholder?: false | string
  ruleMessage?: string
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

class DefaultEdit<M extends boolean = boolean> extends DefaultSimpleEdit {
  static $name = 'DefaultEdit'
  static $formatConfig = { name: 'DefaultEdit', level: 50, recommend: true }
  static $editable = true
  static $defaultValue = (multiple: boolean) => !multiple ? undefined : defaultMultipleValue
  static $defaultTrim = false
  static $defaultPlaceholder = (name: string) => `请输入${name}`
  static $defaultRuleMessage = ''
  static $parseRuleList = function($constructor: typeof DefaultEdit<boolean>, target: DefaultEdit<boolean>, formData: Record<PropertyKey, any>, _type?: string) {
    const ruleMessage = target.ruleMessage || target.placeholder
    if (target.$rules) {
      return target.$rules.map(rule => {
        const ruleValue = { ...rule }
        if (ruleValue.required == undefined) {
          ruleValue.required = target.required
        }
        if (ruleValue.message == undefined && ruleMessage) {
          ruleValue.message = ruleMessage
        }
        return $constructor.$parseRule(ruleValue, formData)
      })
    } else {
      if (target.multiple && target.required) {
        // 多选且必选时
        return [
          $constructor.$parseRule({
            required: target.required,
            type: 'array',
            message: ruleMessage,
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
  ruleMessage?: string
  $rules?: ruleOption[]
  $value: {
    default?: any
    reset?: any
    [prop: PropertyKey]: any
  }
  constructor(initOption: DefaultEditInitOption<M>, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    const $constructor = (this.constructor as typeof DefaultEdit)
    this.$editable = initOption.editable ?? $constructor.$editable
    this.simple = initOption.simple || {}
    if (!this.$editable) {
      this.simple.value ??= true
      this.simple.rules ??= true
    }
    this.multiple = !!initOption.multiple as M
    this.trim = initOption.trim ?? $constructor.$defaultTrim
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
      this.$value = {
        default: defaultValue,
        reset: hasProp(initOptionValue, 'reset') ? initOptionValue.reset : defaultValue
      }
    } else {
      this.$value = {}
    }
    if (this.simple.rules !== true) {
      // rule
      if (initOption.rules) {
        this.$rules = initOption.rules
      }
      const ruleMessage = initOption.ruleMessage || $constructor.$defaultRuleMessage
      if (ruleMessage) {
        this.ruleMessage = ruleMessage
      }
    }
    if (initOption.deepClone && this.parse === undefined) {
      // 需要深拷贝且parse为空时自动创建深拷贝函数
      this.parse = (value) => isComplex(value) ? deepCloneData(value) : value
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
    return typeof value !== 'function' ? value : value()
  }
}

export default DefaultEdit
