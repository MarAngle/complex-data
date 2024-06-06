import { Limit } from "complex-utils"
import { LimitInitOption } from "complex-utils/src/class/Limit"
import BaseData from "../data/BaseData"
import DefaultData, { DefaultBufferType, DefaultDataInitOption } from "../data/DefaultData"
import DictionaryValue, { DictionaryMod, DictionaryValueInitOption } from "../lib/DictionaryValue"
import ObserveList from "../dictionary/ObserveList"
import DefaultInfo from "../dictionary/DefaultInfo"
import LayoutParse, { LayoutParseInitOption } from "../lib/LayoutParse"
import FormValue from "../lib/FormValue"

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

export const createOption = function<D>(structData: D, initData?: Partial<D>) {
  if (initData) {
    for (const prop in initData) {
      structData[prop] = initData[prop]!
    }
  }
  return structData
}

export interface DictionaryDataOption {
  empty: boolean
}

export interface DictionaryDataInitOption extends DefaultDataInitOption {
  simple?: {
    prop?: boolean // 是否加载prop数据
  }
  complex?: {
    assign?: boolean // 是否进行复杂赋值,格式化函数直接对源数据进行改造:警告，此逻辑仅列表创建时有效，对于update类相关调用依然通过源数据对目标数据进行赋值
  } // 简单快速处理判断值
  list?: DictionaryValueInitOption[]
  propData?: Partial<propDataType<string | propDataValueType>>
  layout?: LayoutParseInitOption
  option?: Partial<DictionaryDataOption>
}

class DictionaryData<Buffer extends DefaultBufferType = DefaultBufferType> extends DefaultData<Buffer> {
  static $name = 'DictionaryData'
  static $formatConfig = { name: 'DictionaryData', level: 50, recommend: true }
  static $empty = true
  static $depth = Symbol('depth')
  static $assignData = function(dictionary: DictionaryData, targetData: Record<PropertyKey, any>, originData: Record<PropertyKey, any>, originFrom: string, useSetData: boolean) {
    for (const dictionaryValue of dictionary.$data.values()) {
      dictionaryValue.$assignData(targetData, originData, originFrom, useSetData)
    }
    return targetData
  }
  static $formatData = function(dictionary: DictionaryData, targetData: Record<PropertyKey, any>, originFrom: string, useSetData: boolean) {
    for (const dictionaryValue of dictionary.$data.values()) {
      dictionaryValue.$formatData(targetData, originFrom, useSetData)
    }
    return targetData
  }
  $simple: {
    prop?: boolean
  }
  $complex: {
    assign?: boolean
  }
  $data: Map<string, DictionaryValue>
  $propData?: propDataType<propDataValueType>
  $layout: LayoutParse
  $option: DictionaryDataOption
  constructor(initOption: DictionaryDataInitOption) {
    super(initOption)
    this._triggerCreateLife('DictionaryData', false, initOption)
    this.$simple = initOption.simple || {}
    this.$complex = initOption.complex || {}
    this.$data = new Map()
    if (!this.$simple.prop) {
      // 简单模式下不加载propData
      this.$propData = {
        parentId: initPropData('parentId', initOption.propData),
        id: initPropData('id', initOption.propData),
        children: initPropData('children', initOption.propData)
      }
    }
    if (initOption.list) {
      for (let n = 0; n < initOption.list.length; n++) {
        const dictionaryValueInitOption = initOption.list[n]
        this.$data.set(dictionaryValueInitOption.prop, new DictionaryValue(dictionaryValueInitOption, this))
      }
    }
    this.$layout = new LayoutParse(initOption.layout)
    this.$option = createOption({ empty: DictionaryData.$empty }, initOption.option)
    this._triggerCreateLife('DictionaryData', true, initOption)
  }
  setProp(value: string, prop: propDataKeys = 'id') {
    this.$propData![prop].prop = value
    this._syncData(true, 'setProp')
  }
  getProp(prop: propDataKeys = 'id') {
    return this.$propData![prop].prop
  }
  setPropValue(value: unknown, prop: propDataKeys = 'id') {
    this.$propData![prop].value = value
    this._syncData(true, 'setPropValue')
  }
  getPropValue(prop: propDataKeys = 'id') {
    return this.$propData![prop].value
  }
  getValue(prop: string) {
    return this.$data.get(prop)
  }
  // 重新构建字典数据
  updateDictionary(dictionaryInitOptionList: DictionaryValueInitOption[], option: { clear?: boolean, replace?: boolean } = {}) {
    this.triggerLife('beforeUpdate', this, dictionaryInitOptionList, option)
    if (option.clear) {
      this.$data.clear()
    }
    for (let n = 0; n < dictionaryInitOptionList.length; n++) {
      const dictionaryValueInitOption = dictionaryInitOptionList[n]
      const prop = dictionaryValueInitOption.prop
      if (!this.getValue(prop) || option.replace) {
        this.$data.set(prop, new DictionaryValue(dictionaryValueInitOption, this))
      }
    }
    this.triggerLife('updated', this, dictionaryInitOptionList, option)
  }
  createList(originList: Record<PropertyKey, any>[] = [], originFrom = 'list', useSetData?: boolean) {
    const targetList = []
    for (let i = 0; i < originList.length; i++) {
      targetList.push(this.createData(originList[i], originFrom, useSetData))
    }
    return targetList
  }
  // 格式化函数
  createData(originData: Record<PropertyKey, any>, originFrom = 'list', useSetData = false) {
    // --------
    return !this.$complex.assign ? DictionaryData.$formatData(this, originData, originFrom, useSetData) : DictionaryData.$assignData(this, {}, originData, originFrom, useSetData)
  }
  updateData(targetData: Record<PropertyKey, any>, originData: Record<PropertyKey, any>, originFrom = 'info', useSetData = true) {
    return DictionaryData.$assignData(this, targetData, originData, originFrom, useSetData)
  }
  $getPageItem(modName: string, ditem: DictionaryValue) {
    return ditem.$getMod(modName)
  }
  getList(modName: string) {
    const list: DictionaryValue[] = []
    for (const ditem of this.$data.values()) {
      const mod = ditem.$getMod(modName)
      if (mod) {
        list.push(ditem)
      }
    }
    return list
  }
  // 获取模块列表
  getPageList(modName: string, dictionaryValueList: DictionaryValue[]) {
    const pageList: DictionaryMod[] = []
    for (let n = 0; n < dictionaryValueList.length; n++) {
      pageList.push(this.$getPageItem(modName, dictionaryValueList[n])!)
    }
    return pageList
  }
  // 获取响应式模块列表
  getObserveList(modName: string, dictionaryValueList: DictionaryValue[], observe?: boolean ) {
    const observeList = new ObserveList()
    for (let n = 0; n < dictionaryValueList.length; n++) {
      const dictionaryValue = dictionaryValueList[n]
      const mod = this.$getPageItem(modName, dictionaryValue) as DefaultInfo
      observeList.push(mod)
      if (dictionaryValue.modIsCascade(mod)) {
        const dictionaryList = dictionaryValue.dictionary!.getList(modName)
        const observeList = dictionaryValue.dictionary!.getObserveList(modName, dictionaryList, observe)
        mod.$runtime = {
          gridParse: dictionaryValue.dictionary!.$layout.grid.getValue(modName),
          dictionaryList: dictionaryList,
          observeList: observeList,
          type: modName,
          form: new FormValue(),
          observe: observe
        }
      }
    }
    return observeList
  }
  // 异步解析数据准备编辑
  parseData(dictionaryValueList: DictionaryValue[], formValue: FormValue, modName: string, defaultData?: Record<PropertyKey, any>, from?: string): Promise<{ status: string, data: Record<PropertyKey, any> }> {
    return new Promise((resolve) => {
      const targetData = formValue.getData()
      const size = dictionaryValueList.length
      const promiseList = []
      for (let n = 0; n < size; n++) {
        const dictionaryValue = dictionaryValueList[n]
        promiseList.push(dictionaryValue.parseValue({
          targetData: targetData,
          originData: defaultData,
          type: modName,
          from: from
        }))
      }
      Promise.allSettled(promiseList).then(() => {
        resolve({ status: 'success', data: targetData })
      })
    })
  }
  collectData(formData: Record<PropertyKey, any>, dictionaryValueList: DictionaryValue[], modName: string, observeList?: ObserveList) {
    const postData: Record<string, any> = {}
    dictionaryValueList.forEach(dictionaryValue => {
      dictionaryValue.collectValue({
        targetData: postData,
        originData: formData,
        type: modName
      }, this.$option.empty, observeList)
    })
    return postData
  }
  // SearchData重写加载/卸载
  _install(target: BaseData) {
    super._install(target)
    // 监听事件
    this.onLife('updated', {
      id: target._getId('dictionaryUpdated'),
      data: (...args) => {
        target.triggerLife('dictionaryUpdated', ...args)
      }
    })
  }
  _uninstall(target: BaseData) {
    super._uninstall(target)
    // 停止监听事件
    this.offLife('updated', target._getId('dictionaryUpdated'))
  }
}

export default DictionaryData
