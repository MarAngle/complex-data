import _func from 'complex-func'
import Data from './../data/Data'

class DictionaryItem extends Data {
  constructor (initOption) {
    super()
    if (!initOption) {
      initOption = {}
    }
  }
}

DictionaryItem.$name = 'DictionaryItem'

export default DictionaryItem
