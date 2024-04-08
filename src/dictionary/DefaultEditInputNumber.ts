import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"

export interface DefaultEditInputNumberOption {
  max: number
  min: number
  precision: number
  step: number
}

export interface DefaultEditInputNumberInitOption extends DefaultEditInitOption {
  type: 'inputNumber'
  option?: Partial<DefaultEditInputNumberOption>
}

class DefaultEditInputNumber extends DefaultEdit{
  static $name = 'DefaultEditInputNumber'
  type: 'inputNumber'
  $option: DefaultEditInputNumberOption
  constructor(initOption: DefaultEditInputNumberInitOption, parent?: DictionaryValue, modName?: string) {
    super(initOption, parent, modName)
    this.type = initOption.type
    const option = initOption.option || {}
    this.$option = {
      max: option.max === undefined ? Infinity : option.max,
      min: option.min === undefined ? -Infinity : option.min,
      precision: option.precision === undefined ? 0 : option.precision, // 精确到几位小数，接受非负整数
      step: option.step === undefined ? 1 : option.step, // 点击步进
    }
  }
}

export default DefaultEditInputNumber
