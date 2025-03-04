import { upperCaseFirstChar } from "complex-utils"
import DefaultEdit, { DefaultEditInitOption } from "./DefaultEdit"
import DictionaryValue from "../lib/DictionaryValue"

export type customModelHandler = (formdata: Record<PropertyKey, unknown>, prop: PropertyKey, args: unknown[]) => void

export type customModelType = {
  init?: PropertyKey
  change?: string
  handler?: customModelHandler
}

export interface DefaultCustomEditInitOption<T> {
  type: T
  model?: customModelType
  option?: Record<PropertyKey, any>
  custom?: Record<PropertyKey, any>
}

export const createCustomEdit = function<M extends boolean, T extends string>(type: T, parent: typeof DefaultEdit<M>) {
  return class extends parent {
    static $name = `${upperCaseFirstChar(type)}Edit`
    type: T
    $model: customModelType
    $option: Record<PropertyKey, any>
    $custom: Record<PropertyKey, any>
    constructor(initOption: DefaultCustomEditInitOption<T> & DefaultEditInitOption<M>, parent?: DictionaryValue, modName?: string) {
      super(initOption, parent, modName)
      this.type = initOption.type
      this.$model = initOption.model || {}
      this.$option = initOption.option || {}
      this.$custom = initOption.custom || {}
    }
  }
}

export type CustomEditInitOption = DefaultCustomEditInitOption<'custom'> & DefaultEditInitOption<boolean>

const CustomEdit = createCustomEdit<boolean, 'custom'>('custom', DefaultEdit)

export default CustomEdit
