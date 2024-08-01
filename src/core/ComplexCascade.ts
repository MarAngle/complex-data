import { DefaultBufferType } from "../data/DefaultData"
import ComplexList, { ComplexListInitOption } from "./ComplexList"

export interface ComplexCascadeInitOption extends ComplexListInitOption {}

class ComplexCascade<D extends Record<PropertyKey, any> = Record<PropertyKey, any>, O extends Record<PropertyKey, any> = D, Buffer extends DefaultBufferType = DefaultBufferType> extends ComplexList<D, O, Buffer> {
  static $name = 'ComplexCascade'
  constructor(initOption: ComplexCascadeInitOption) {
    super(initOption)
    this._triggerCreateLife('ComplexCascade', false, initOption)
    this._triggerCreateLife('ComplexCascade', true, initOption)
  }
  formatList (originList: O[] = [], totalNum?: number, originFrom?: string, useSetData?: boolean) {
    this.$list = this.createListByDictionary(originList, originFrom, useSetData) as D[]
    this.setPageCount(totalNum!)
    this._syncData(true, 'formatList')
  }
}

export default ComplexCascade
