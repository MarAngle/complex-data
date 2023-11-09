import BaseData, { BaseDataInitOption } from "../data/BaseData"

export type ComplexDataInitOption = BaseDataInitOption

class ComplexData extends BaseData {
  static $name = 'ComplexData'
  constructor(initOption: ComplexDataInitOption) {
    super(initOption)
    this._triggerCreateLife('ComplexData', 'beforeCreate', initOption)
    this._triggerCreateLife('ComplexData', 'created', initOption)
  }
}

export default ComplexData
