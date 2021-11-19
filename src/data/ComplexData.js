import _func from 'complex-func'
import utils from './../utils/index'
import BaseData from './BaseData'
import DictionaryList from './../mod/DictionaryList'

class ComplexData extends BaseData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    initOption.data = utils.formatData(initOption.data, {
      list: [],
      current: {}
    })
    super(initOption)
    this.triggerCreateLife('ComplexData', 'beforeCreate', initOption)
    this.triggerCreateLife('ComplexData', 'created')
  }
}

ComplexData.$name = 'ComplexData'

export default ComplexData
