import $func from 'complex-func'
import DefaultData, { DefaultDataInitOption } from './DefaultData'
import ModuleData, { ModuleDataInitOption, moduleKeys } from './../mod/ModuleData'
import { formatInitOption } from '../utils'
import { LifeDataInitOption } from '../mod/LifeData'
import { anyFunction, objectAny } from '../../ts'


export interface forceObjectType {
  [prop: string]: boolean | string
}

export type forceType = boolean | forceObjectType

export interface BaseDataInitOption extends DefaultDataInitOption {
  life?: LifeDataInitOption,
  data?: objectAny,
  module?: ModuleDataInitOption
}

class BaseData extends DefaultData {
}


BaseData.$name = 'BaseData'

export default BaseData
