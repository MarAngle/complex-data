import ComplexData, { ComplexDataInitOption } from "./ComplexData"

export type ComplexInfoInitOption = ComplexDataInitOption

class ComplexInfo<D extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>, O extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>> extends ComplexData {
  static $name = 'ComplexInfo'
  $info: object | D
  constructor(initOption: ComplexInfoInitOption) {
    super(initOption)
    this._triggerCreateLife('ComplexInfo', false, initOption)
    this.$info = {}
    this.onLife('reseted', {
      id: 'AutoComplexInfoReseted',
      data: (resetOption) => {
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
    this.$syncData(true, 'formatInfo')
  }
}

export default ComplexInfo
