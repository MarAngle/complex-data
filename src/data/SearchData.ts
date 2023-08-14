/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseData, { BaseDataInitOption } from "../data/BaseData"
import { formDataOption } from "../lib/DictionaryList"
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

class SearchData extends BaseData {
  static $name = 'SearchData'
  $mod: string
  $data: Record<PropertyKey, any>
  $current: Record<PropertyKey, any>
  constructor(initOption: SearchDataInitOption) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('SearchData', 'beforeCreate', initOption)
    this.$mod = initOption.mod || 'search'
    this.$data = {}
    this.$current = {}
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
    const list = this.$module.dictionary!.$getPageList(modName)
    this.$data[modName] = {
      list: list,
      form: {}
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
    const list = targetData.list
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
    this.$current[modName] = this.$module.dictionary!.$buildEditData(targetData.form, targetData.list, modName)
  }
}

export default SearchData
