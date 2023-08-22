/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseData, { BaseDataInitOption } from "../data/BaseData"
import { formDataOption } from "../lib/DictionaryList"
import ObserveList from "../mod/ObserveList"
import { formatInitOption } from "../utils"

export interface SearchDataInitOption extends BaseDataInitOption {
  mod?: string,
  formOption?: resetFormOption
}

export interface resetFormOption {
  copy?: boolean
  observe?: boolean
  limit?: formDataOption['limit']
}

export type SearchDataType = {
  list: ObserveList
  form: Record<PropertyKey, any>
  data: Record<PropertyKey, any>
}

// 需要实现数据的校验操作

class SearchData extends BaseData {
  static $name = 'SearchData'
  $mod: string
  $data: Record<PropertyKey, SearchDataType>
  constructor(initOption: SearchDataInitOption) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('SearchData', 'beforeCreate', initOption)
    this.$mod = initOption.mod || 'search'
    this.$data = {}
    this.$initSearchData(this.$mod, initOption.formOption)
    this.$onLife('reseted', {
      id: 'AutoSearchDataReseted',
      data: (instantiater, resetOption) => {
        if (this.$parseResetOption(resetOption, 'data') !== false) {
          this.$resetData()
        }
      }
    })
    this.$triggerCreateLife('SearchData', 'created')
  }
  $initSearchData(modName: string, option?: resetFormOption) {
    const list = this.$module.dictionary!.$buildObserveList(modName, this.$module.dictionary!.$getList(modName))
    this.$data[modName] = {
      list: list,
      form: {},
      data: {}
    }
    this.$resetFormData('init', modName, option)
  }
  $resetData() {
    for (const modName in this.$data) {
      this.$resetFormData('reset', modName)
    }
  }
  $resetFormData(from = 'init' , modName?: string, option: resetFormOption = {}) {
    if (!modName) {
      modName = this.$mod
    }
    const targetData = this.$data[modName]
    const list = targetData.list.data.map(item => {
      return item.$parent!
    })
    this.$module.dictionary!.$buildFormData(list, modName, undefined, {
      form: targetData.form,
      from: from,
      limit: option.limit
    })
    if (option.observe) {
      targetData.list.setData(targetData.form)
    }
    if (option.copy !== false) {
      this.$syncFormData(modName)
    }
  }
  $syncFormData(modName?: string) {
    if (!modName) {
      modName = this.$mod
    }
    const targetData = this.$data[modName]
    const list = targetData.list.data.map(item => {
      return item.$parent!
    })
    this.$data[modName].data = this.$module.dictionary!.$buildEditData(targetData.form, list, modName)
  }
}

export default SearchData
