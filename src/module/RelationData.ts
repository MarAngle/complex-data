import BaseData from "../data/BaseData"
import DependData, { DependDataInitOption } from "./DependData"

// Base reset/destroy

export interface RelationDataInitOption {
  parent?: BaseData
  depend?: DependDataInitOption
}

class RelationData {
  parent?: BaseData
  depend?: DependData
  constructor(initOption: RelationDataInitOption = {}, self: BaseData) {
    this.parent = initOption.parent
    if (initOption.depend) {
      this.depend = new DependData(initOption.depend, self)
    }
  }
}

export default RelationData

