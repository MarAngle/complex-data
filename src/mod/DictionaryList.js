import _func from 'complex-func'
import DefaultData from './../data/DefaultData'
import DictionaryData from './DictionaryData'
import OptionData from './OptionData'
import LayoutData from './LayoutData'

const propList = ['id', 'parentId', 'children']

class DictionaryList extends DefaultData {
  constructor (initOption, payload = {}) {
    super(initOption)
    this.triggerCreateLife('DictionaryList', 'beforeCreate', initOption, payload)
    this.triggerCreateLife('DictionaryList', 'created', initOption)
  }
}

DictionaryList.$name = 'DictionaryList'

export default DictionaryList
