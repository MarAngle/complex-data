import { hasProp } from "complex-utils"
import { SimpleType } from "complex-utils/src/type/getType"
import SimpleEdit, { SimpleEditInitOption } from "./SimpleEdit"
import DictionaryValue from "../lib/DictionaryValue"
import InterfaceValue, { InterfaceValueInitOption, InterfaceValueType } from "../lib/InterfaceValue"

export interface ruleOption {
  required?: boolean
  message?: string
  type?: SimpleType
  max?: number
  min?: number
  pattern?: RegExp
  trigger?: string[]
  validator?: (value: any, rule: ruleOption) => boolean | Promise<any>
}
// 考虑自定义校验参数，并实时构建，统一判断逻辑，构建函数由静态参数设置

export interface EditDataInitOption extends SimpleEditInitOption {
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
  rules?: InterfaceValueType<ruleOption[]>
}

function defaultMultipleValue() {
  return [] as any[]
}

class EditData extends SimpleEdit {
  static $name = 'EditData'
  static $formatConfig = { name: 'EditData', level: 50, recommend: true }
  static $editable = true
  static $defaultValue = function(multiple: boolean) {
    return !multiple ? undefined : defaultMultipleValue
  }
  static $defaultTrim = false
  static $defaultPlaceholder = function (name: InterfaceValue<string>) {
    const data = {} as InterfaceValueType<string>
    name.forEach((value, prop) => {
      data[prop] = `请输入${value}`
    })
    return data
  }
  static $parseRule = function<R = ruleOption>(rule: ruleOption): R {
    return rule as R
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
  $rules?: InterfaceValue<ruleOption[]>
  $value: {
    default?: any
    init?: any
    reset?: any
    [prop: PropertyKey]: any
  }
  constructor(initOption: EditDataInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    const $constructor = (this.constructor as typeof EditData)
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
      if (defaultValue || initValue || resetValue) {
        const valuePropList = [] as string[]
        if (defaultValue !== null && typeof defaultValue === 'object') {
          valuePropList.push('default')
        }
        if (initValue !== null && typeof initValue === 'object') {
          valuePropList.push('init')
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
      }
    }
  }
  getRuleList(prop: string): undefined | Record<PropertyKey, any>[] {
    if (this.$rules) {
      const ruleList = this.$rules.getValue(prop)
      if (ruleList) {
        const $constructor = (this.constructor as typeof EditData)
        return ruleList.map(rule => {
          const ruleValue = { ...rule }
          if (ruleValue.required === undefined) {
            ruleValue.required = this.required.getValue(prop)
          }
          if (ruleValue.message === undefined && this.placeholder) {
            ruleValue.message = this.placeholder.getValue(prop)
          }
          return $constructor.$parseRule(ruleValue)
        })
      } else {
        return undefined
      }
    } else {
      return undefined
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

export default EditData
