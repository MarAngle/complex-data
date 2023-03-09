import Data from "../data/Data"
import { formatDataOption } from "../lib/DictionaryList"
import { formatInitOption } from "../utils"
import ComplexData, { ComplexDataInitOption } from "./ComplexData"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ComplexListInitOption<P extends Data = Data> extends ComplexDataInitOption<P> {}

class ComplexList<P extends Data = Data> extends ComplexData<P> {
  static $name = 'ComplexList'
  $list: Record<PropertyKey, any>[]
  constructor(initOption: ComplexListInitOption<P>) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$list = []
    this.$triggerCreateLife('ComplexList', 'beforeCreate', initOption)
    this.$triggerCreateLife('ComplexList', 'created', initOption)
  }
  $formatList (datalist = [], totalNum?: number, originFrom?: string, option?: formatDataOption) {
    this.$formatListDataByDictionary(this.$list, datalist, originFrom, option)
    this.$setPageData(totalNum!, 'num')
  }
  $getItem (data: any, prop?: string) {
    if (!prop) {
      prop = this.$getDictionaryPropData('prop', 'id')
    }
    for (let i = 0; i < this.$list.length; i++) {
      const item = this.$list[i]
      if (item[prop!] == data) {
        return item
      }
    }
  }
  $getItemIndex(item: Record<PropertyKey, any>) {
    return this.$list.indexOf(item)
  }
  $getItemByIndex(index: number) {
    return this.$list[index]
  }
}

export default ComplexList
