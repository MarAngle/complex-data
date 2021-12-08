import _func from 'complex-func'
import config from '../../config'
import BaseData from './../data/BaseData'

class SearchData extends BaseData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super(initOption)
  }
}

SearchData.$name = 'SearchData'

export default SearchData
