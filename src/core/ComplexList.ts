import { DefaultBufferType } from "../data/DefaultData"
import ComplexData, { ComplexDataInitOption } from "./../data/ComplexData"

export interface ComplexListInitOption extends ComplexDataInitOption {}

class ComplexList<D extends Record<PropertyKey, any> = Record<PropertyKey, any>, O extends Record<PropertyKey, any> = D, Buffer extends DefaultBufferType = DefaultBufferType> extends ComplexData<Buffer> {
  static $name = 'ComplexList'
  $list: D[]
  constructor(initOption: ComplexListInitOption) {
    super(initOption)
    this._triggerCreateLife('ComplexList', false, initOption)
    this.$list = []
    this.onLife('reseted', {
      id: 'AutoComplexListReseted',
      data: (_lifeItem, resetOption) => {
        if (resetOption.list !== false) {
          this.$list = []
        }
      }
    })
    this._triggerCreateLife('ComplexList', true, initOption)
  }
  formatList (originList: O[] = [], totalNum?: number, originFrom?: string, useSetData?: boolean) {
    this.$list = this.createListByDictionary(originList, originFrom, useSetData) as D[]
    this.setPageCount(totalNum!)
    this._syncData(true, 'formatList')
  }
  getValue (data: any, prop?: string) {
    if (!prop) {
      prop = this.getDictionaryProp('id')
    }
    for (let i = 0; i < this.$list.length; i++) {
      const item = this.$list[i]
      if (item[prop!] == data) {
        return item
      }
    }
  }
  getValueIndex(item: D) {
    return this.$list.indexOf(item)
  }
  getValueByIndex(index: number) {
    return this.$list[index]
  }
}

export default ComplexList
