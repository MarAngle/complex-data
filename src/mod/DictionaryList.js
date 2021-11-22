import _func from 'complex-func'
import Data from './../data/Data'

class DictionaryList extends Data {
  constructor (initOption) {
    super()
    if (!initOption) {
      initOption = {}
    }
  }
}

DictionaryList.$name = 'DictionaryList'

export default DictionaryList
