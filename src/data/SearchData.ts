/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseData, { BaseDataInitOption } from "../data/BaseData"
import { formDataOption } from "../lib/DictionaryList"
import BaseForm from "../lib/BaseForm"
import ObserveList from "../mod/ObserveList"
import LayoutData, { LayoutDataInitOption } from "../lib/LayoutData"
import MenuData, { MenuDataInitOption } from "../mod/MenuData"
import { formatInitOption } from "../utils"

export interface SearchDataInitOption extends BaseDataInitOption {
  mod?: string,
  formOption?: resetFormOption
  menu?: {
    layout?: LayoutDataInitOption
    list: MenuDataInitOption[]
  }
}

export interface resetFormOption {
  copy?: boolean
  observe?: boolean
  limit?: formDataOption['limit']
}

export type SearchDataType = {
  list: ObserveList
  form: BaseForm
  data: Record<PropertyKey, any>
}

// 需要实现数据的校验操作

class SearchData extends BaseData {
  static $name = 'SearchData'
  static $form: null | (new() => BaseForm) = null
  $mod: string
  $data: Record<PropertyKey, SearchDataType>
  menu: {
    layout: LayoutData
    list: MenuData[]
  }
  constructor(initOption: SearchDataInitOption) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('SearchData', 'beforeCreate', initOption)
    this.$mod = initOption.mod || 'search'
    this.$data = {}
    const menu = initOption.menu
    if (menu) {
      const layout = new LayoutData(menu.layout || (this.$module.dictionary ? this.$module.dictionary.$layout : undefined))
      this.menu = {
        layout: layout,
        list: menu.list.map(menuItem => new MenuData(menuItem, layout))
      }
    } else {
      this.menu = {
        layout: new LayoutData(),
        list: []
      }
    }
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
  static setForm(form: new() => BaseForm) {
    this.$form = form
  }
  $initSearchData(modName: string, option?: resetFormOption) {
    const list = this.$module.dictionary!.$buildObserveList(modName, this.$module.dictionary!.$getList(modName))
    const form = SearchData.$form
    if (form) {
      this.$data[modName] = {
        list: list,
        form: new form(),
        data: {}
      }
      this.$resetFormData('init', modName, option)
    }
  }
  $resetData() {
    for (const modName in this.$data) {
      this.$resetFormData('reset', modName)
    }
  }
  $resetFormData(from = '' , modName?: string, option: resetFormOption = {}) {
    if (!modName) {
      modName = this.$mod
    }
    const targetData = this.$data[modName]
    const list = targetData.list.data.map(item => {
      return item.$parent!
    })
    this.$module.dictionary!.$buildFormData(list, modName, undefined, {
      form: targetData.form.data,
      from: from,
      limit: option.limit
    })
    targetData.form.clearValidate()
    if (option.observe) {
      targetData.list.setData(targetData.form)
    }
    if (option.copy !== false) {
      targetData.data = this.$module.dictionary!.$buildEditData(targetData.form.data, list, modName!)
    }
  }
  $validate(modName?: string): Promise<{ status: string, data: SearchDataType, modName: string }> {
    return new Promise((resolve, reject) => {
      if (!modName) {
        modName = this.$mod
      }
      const targetData = this.$data[modName]
      targetData.form.validate().then(() => {
        resolve({ status: 'success', data: targetData, modName: modName! })
      }).catch(err => {
        reject(err)
      })
    })
  }
  $syncFormData(modName?: string) {
    return new Promise((resolve, reject) => {
      this.$validate(modName).then((res) => {
        const targetData = res.data
        const list = targetData.list.data.map(item => {
          return item.$parent!
        })
        targetData.data = this.$module.dictionary!.$buildEditData(targetData.form.data, list, res.modName)
        resolve({ status: 'success' })
      }).catch(err => {
        reject(err)
      })
    })
  }
  getData(modName?: string) {
    if (!modName) {
      modName = this.$mod
    }
    const targetData = this.$data[modName]
    if (targetData) {
      return targetData.data
    } else {
      return {}
    }
  }
}

export default SearchData
