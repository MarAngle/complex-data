import _func from 'complex-func'
import DefaultData from './DefaultData'

class BaseData extends DefaultData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super()
  }
}

BaseData.$name = 'BaseData'

export default BaseData
