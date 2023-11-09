import BaseData from "../data/BaseData"
import DefaultData, { DefaultDataInitOption } from "../data/DefaultData"
import DictionaryValue, { DictionaryValueInitOption } from "../dictionary/DictionaryValue"

type propDataValueType = {
  prop: string
  value: unknown
}

type propDataType<T> = {
  id: T
  parentId: T
  children: T
}

type propDataKeys = keyof propDataType<unknown>

function initPropData(defaultProp: propDataKeys, propData?: Partial<propDataType<string | propDataValueType>>): propDataValueType {
  if (propData) {
    const data = propData[defaultProp]
    if (data !== undefined) {
      if (typeof data === 'object') {
        return data
      } else {
        return {
          prop: data,
          value: undefined
        }
      }
    }
  }
  return {
    prop: defaultProp,
    value: undefined
  }
}

export interface DictionaryDataInitOption extends DefaultDataInitOption {
  list?: DictionaryValueInitOption[]
  propData?: Partial<propDataType<string | propDataValueType>>
}

class DictionaryData extends DefaultData {
  static $name = 'DictionaryData'
  $data: Map<string, DictionaryValue>
  $propData: propDataType<propDataValueType>
  constructor(initOption: DictionaryDataInitOption) {
    super(initOption)
    this._triggerCreateLife('DictionaryData', 'beforeCreate', initOption)
    this.$data = new Map()
    this.$propData = {
      parentId: initPropData('parentId', initOption.propData),
      id: initPropData('id', initOption.propData),
      children: initPropData('children', initOption.propData)
    }
    if (initOption.list) {
      for (let n = 0; n < initOption.list.length; n++) {
        const dictionaryValueInitOption = initOption.list[n]
        this.$data.set(dictionaryValueInitOption.prop, new DictionaryValue(dictionaryValueInitOption, this))
      }
    }
    this._triggerCreateLife('DictionaryData', 'created', initOption)
  }
  $setProp(value: string, prop: propDataKeys = 'id') {
    this.$propData[prop].prop = value
    this.$syncData(true, '$setProp')
  }
  $getProp(prop: propDataKeys = 'id') {
    return this.$propData[prop].prop
  }
  $setPropValue(value: unknown, prop: propDataKeys = 'id') {
    this.$propData[prop].value = value
    this.$syncData(true, '$setPropValue')
  }
  $getPropValue(prop: propDataKeys = 'id') {
    return this.$propData[prop].value
  }
  $getItem(prop: string) {
    return this.$data.get(prop)
  }
  // 重新构建字典数据
  $updateDictionary(dictionaryInitOptionList: DictionaryValueInitOption[], option: { clear?: boolean, replace?: boolean } = {}) {
    this.$triggerLife('beforeUpdate', this, dictionaryInitOptionList, option)
    if (option.clear) {
      this.$data.clear()
    }
    for (let n = 0; n < dictionaryInitOptionList.length; n++) {
      const dictionaryValueInitOption = dictionaryInitOptionList[n]
      const prop = dictionaryValueInitOption.prop
      if (!this.$getItem(prop) || option.replace) {
        this.$data.set(prop, new DictionaryValue(dictionaryValueInitOption, this))
      }
    }
    this.$triggerLife('updated', this, dictionaryInitOptionList, option)
  }
  $install(target: BaseData) {
    super.$install(target)
    // 监听事件
    this.$onLife('updated', {
      id: target.$getId('dictionaryUpdated'),
      data: (...args) => {
        target.$triggerLife('dictionaryUpdated', ...args)
      }
    })
  }
  $uninstall(target: BaseData) {
    super.$uninstall(target)
    // 停止监听事件
    this.$offLife('updated', target.$getId('dictionaryUpdated'))
  }
}

export default DictionaryData
