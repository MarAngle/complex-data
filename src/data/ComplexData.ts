import { upperCaseFirstChar } from 'complex-utils-next'
import BaseData, { BaseDataInitOption } from './BaseData'

export interface ComplexDataInitOption extends BaseDataInitOption {
  //
}

class ComplexData extends BaseData {
  static $name = 'ComplexData'
  constructor(initOption: ComplexDataInitOption) {
    super(initOption)
    this._triggerCreateLife('ComplexData', 'beforeCreate', initOption)
    this._triggerCreateLife('ComplexData', 'created', initOption)
  }
}

export default ComplexData
