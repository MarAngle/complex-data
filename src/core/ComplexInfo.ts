import { DefaultBufferType } from "../data/DefaultData"
import ComplexData, { ComplexDataInitOption } from "./../data/ComplexData"

export interface ComplexInfoInitOption extends ComplexDataInitOption {}

class ComplexInfo<D extends Record<PropertyKey, any> = Record<PropertyKey, any>, O extends Record<PropertyKey, any> = Record<PropertyKey, any>, Buffer extends DefaultBufferType = DefaultBufferType> extends ComplexData<Buffer> {
  static $name = 'ComplexInfo'
  $info: object | D
  constructor(initOption: ComplexInfoInitOption) {
    super(initOption)
    this._triggerCreateLife('ComplexInfo', false, initOption)
    this.$info = {}
    this.onLife('reseted', {
      id: 'AutoComplexInfoReseted',
      data: (_lifeItem, resetOption) => {
        if (resetOption.info !== false) {
          this.$info = {}
        }
      }
    })
    this._triggerCreateLife('ComplexInfo', true, initOption)
  }
  formatInfo (originData: O, originFrom = 'list', useSetData?: boolean) {
    this.$info = {
      ...this.updateDataByDictionary(this.$info as D, originData, originFrom, useSetData)
    }
    this._syncData(true, 'formatInfo')
  }
}

export default ComplexInfo
