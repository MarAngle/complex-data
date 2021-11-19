import _func from 'complex-func'
import SimpleData from './../data/SimpleData'
import DictionaryData from './DictionaryData'
import OptionData from './OptionData'
import LayoutData from './LayoutData'

const propList = ['id', 'parentId', 'children']

class DictionaryList extends SimpleData {
  constructor (initOption, payload = {}) {
    super(initOption)
    this.triggerCreateLife('DictionaryList', 'beforeCreate', initOption, payload)
    this.$option = new OptionData({
      isChildren: false,
      build: _func.getLimitData(),
      edit: {
        empty: false
      },
      tree: false
    })
    this.$propData = {
      id: {
        prop: 'id',
        data: ''
      },
      parentId: {
        prop: 'parentId',
        data: ''
      },
      children: {
        prop: 'children',
        data: ''
      }
    }
    this.data = new Map()
    this.triggerCreateLife('DictionaryList', 'created', initOption)
  }
}

DictionaryList.$name = 'DictionaryList'

export default DictionaryList
