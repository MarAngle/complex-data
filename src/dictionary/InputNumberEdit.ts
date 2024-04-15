import EditData, { EditDataInitOption } from "./EditData"
import DictionaryValue from "../lib/DictionaryValue"

export interface InputNumberEditOption {
  max: number
  min: number
  precision: number
  step: number
}

export interface InputNumberEditInitOption extends EditDataInitOption {
  type: 'inputNumber'
  option?: Partial<InputNumberEditOption>
}

class InputNumberEdit extends EditData{
  static $name = 'InputNumberEdit'
  type: 'inputNumber'
  $option: InputNumberEditOption
  constructor(initOption: InputNumberEditInitOption, parent?: DictionaryValue, modName?: string) {
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

export default InputNumberEdit
