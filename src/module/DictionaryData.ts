import DefaultData, { DefaultDataInitOption } from "../data/DefaultData"

export interface DictionaryDataInitOption extends DefaultDataInitOption {

}

class DictionaryData extends DefaultData {
  static $name = 'DictionaryData'
  constructor(initOption: DictionaryDataInitOption) {
    super(initOption)
    this._triggerCreateLife('DictionaryData', 'beforeCreate', initOption)
    this._triggerCreateLife('DictionaryData', 'created', initOption)
  }
}

export default DictionaryData
