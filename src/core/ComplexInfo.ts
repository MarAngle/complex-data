/* eslint-disable @typescript-eslint/no-explicit-any */
import ComplexData, { ComplexDataInitOption } from "./ComplexData"
import DefaultData from "../data/DefaultData"
import { formatDataOption } from "../lib/DictionaryList"
import { formatInitOption } from "../utils"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ComplexInfoInitOption<P extends undefined | DefaultData = undefined> extends ComplexDataInitOption<P> {}

class ComplexInfo<P extends undefined | DefaultData = undefined> extends ComplexData<P> {
  static $name = 'ComplexInfo'
  $info: Record<PropertyKey, any>
  constructor(initOption: ComplexInfoInitOption<P>) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('ComplexInfo', 'beforeCreate', initOption)
    this.$info = {}
    this.$onLife('reseted', {
      id: 'AutoComplexInfoReseted',
      data: (resetOption) => {
        if (resetOption.info !== false) {
          this.$info = {}
        }
      }
    })
    this.$triggerCreateLife('ComplexInfo', 'created', initOption)
  }
  $formatInfo (originData: Record<PropertyKey, any> = {}, originFrom?: string, option?: formatDataOption) {
    this.$updateDataByDictionary(this.$info, originData, originFrom, option)
    this.$syncData(true, '$formatInfo')
  }
}

export default ComplexInfo
