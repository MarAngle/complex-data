
import DefaultData from '../data/DefaultData'
import BaseData from '../data/BaseData'
import { DependDataInitOption } from './DependData'

export interface ModuleDataInitOption {
  depend?: DependDataInitOption
}

class ModuleData extends DefaultData {
  static $name = 'ModuleData'
  constructor(initOption: undefined | ModuleDataInitOption, parent: BaseData) {
    super()
  }
}

export default ModuleData
