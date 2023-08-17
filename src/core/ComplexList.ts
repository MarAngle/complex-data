/* eslint-disable @typescript-eslint/no-explicit-any */
import ComplexData, { ComplexDataInitOption } from "./ComplexData"
import DefaultData from "../data/DefaultData"
import { formatDataOption } from "../lib/DictionaryList"
import { formatInitOption } from "../utils"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ComplexListInitOption<P extends undefined | DefaultData = undefined> extends ComplexDataInitOption<P> {}

class ComplexList<P extends undefined | DefaultData = undefined> extends ComplexData<P> {
  static $name = 'ComplexList'
  $list: Record<PropertyKey, any>[]
  constructor(initOption: ComplexListInitOption<P>) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('ComplexList', 'beforeCreate', initOption)
    this.$list = []
    this.$onLife('reseted', {
      id: 'AutoComplexListReseted',
      data: (resetOption) => {
        if (resetOption.list !== false) {
          this.$list = []
        }
      }
    })
    this.$triggerCreateLife('ComplexList', 'created', initOption)
  }
  $formatList (datalist: Record<PropertyKey, any>[] = [], totalNum?: number, originFrom?: string, option?: formatDataOption) {
    this.$formatListDataByDictionary(this.$list, datalist, originFrom, option)
    this.$setPageData(totalNum!, 'num')
    this.$syncData(true, '$formatList')
  }
  $getItem (data: any, prop?: string) {
    if (!prop) {
      prop = this.$getDictionaryPropData('prop', 'id')
    }
    for (let i = 0; i < this.$list.length; i++) {
      const item = this.$list[i]
      // eslint-disable-next-line eqeqeq
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
