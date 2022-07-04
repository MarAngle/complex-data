import $func from 'complex-func'
import { formatInitOption } from '../utils'
import modOption from '../../modOption'
import SimpleData, { SimpleDataInitOption } from '../data/SimpleData'
import InterfaceData from './InterfaceData'
import LayoutData from './LayoutData'
import { baseObject, objectUnknown } from '../../ts'


export interface DictionaryItemInitOption extends SimpleDataInitOption {
  showProp?: string | baseObject<string>
  label?: string | baseObject<string>
  originFrom?: string | string[]
}

class DictionaryItem extends SimpleData {
  prop: string
  originFrom: string[]
  $interface: {
    [prop: string]: InterfaceData
  }
  $mod: {
    [prop: string]: objectUnknown
  }
  constructor (initOption: DictionaryItemInitOption, payload = {}) {
    initOption = formatInitOption(initOption, null, 'DictionaryItem初始化参数不存在！')
    super(initOption)
    const originFromType = $func.getType(initOption.originFrom)
    if (originFromType === 'array') {
      this.originFrom = initOption.originFrom as string[]
    } else if (initOption.originFrom && originFromType === 'string') {
      this.originFrom = [initOption.originFrom as string]
    } else {
      this.originFrom = ['list']
    }
    this.prop = this.$prop
    // 加载接口数据
    this.$interface = {}
    this.$interface.label = new InterfaceData(initOption.label === undefined ? this.$name : initOption.label)
    this.$interface.showProp = new InterfaceData(initOption.showProp)
    this.$interface.showType = new InterfaceData(initOption.showType)
    // prop/originProp
    this.$interface.originProp = new InterfaceData(initOption.originProp || this.prop)



    this.$mod = {}

  }
}

DictionaryItem.$name = 'DictionaryItem'

export default DictionaryItem
