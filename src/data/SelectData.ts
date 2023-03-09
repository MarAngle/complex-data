import Data from "./Data"

type SelectDataValueType = {
  [prop: string]: any
}

export interface SelectDataInitOption {
  data?: SelectDataValueType[]
}

class SelectData extends Data {
  static $name = 'SelectData'
  constructor(initOption: SelectDataInitOption) {
    super()
    this.$setData(initOption.data)
  }
  $setData(list?: SelectDataValueType[]) {
    
  }
}

export default SelectData
