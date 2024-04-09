import { getType } from "complex-utils"
import DictionaryData, { DictionaryDataInitOption, createEditOption } from "./DictionaryData"
import DictionaryValue, { DictionaryEditMod } from "../lib/DictionaryValue"
import ObserveList from "../dictionary/ObserveList"
import FormValue from "../lib/FormValue"
import BaseData from "./../data/BaseData"
import ButtonEdit from "../dictionary/ButtonEdit"

export interface resetOption {
  copy?: boolean
  limit?: createEditOption['limit']
}

export type menuInitType = {
  default?: boolean
  list?: (string | DictionaryEditMod)[]
}

export interface SearchDataInitOption extends DictionaryDataInitOption {
  prop?: string
  menu?: menuInitType['default'] | menuInitType
  observe?: boolean
  resetOption?: resetOption
}

class SearchData extends DictionaryData {
  static $name = 'SearchData'
  static $menu = {
    default: ['search', 'reset'],
    data: {
      search: new ButtonEdit({
        type: 'button',
        prop: '$search',
        option: {
          type: 'primary',
          name: '查询',
          icon: 'search'
        }
      }),
      reset: new ButtonEdit({
        type: 'button',
        prop: '$reset',
        option: {
          type: 'primary',
          name: '查询',
          icon: 'refresh'
        }
      }),
      build: new ButtonEdit({
        type: 'button',
        prop: '$build',
        option: {
          type: 'primary',
          name: '新增',
          icon: 'plus'
        }
      }),
      delete: new ButtonEdit({
        type: 'button',
        prop: '$delete',
        option: {
          type: 'danger',
          name: '删除',
          icon: 'delete',
          disabled(payload) {
            if (!payload.choice) {
              return true
            } else {
              return false
            }
          }
        }
      }),
      import: new ButtonEdit({
        type: 'button',
        prop: '$import',
        option: {
          type: 'primary',
          name: '导入',
          icon: 'upload'
        }
      }),
      export: new ButtonEdit({
        type: 'button',
        prop: '$export',
        option: {
          type: 'primary',
          name: '导出',
          icon: 'download'
        }
      })
    } as {
      search: ButtonEdit
      reset: ButtonEdit
      build: ButtonEdit
      delete: ButtonEdit
      import: ButtonEdit
      export: ButtonEdit
      [prop: string]: undefined | DictionaryEditMod
    }
  }
  static $form = FormValue
  static $getMenu = function(menuName: string) {
    const menuOption = SearchData.$menu.data[menuName]
    if (menuOption) {
      return menuOption
    } else {
      console.error(`${menuName}对应的menu类型未在config中配置，菜单生成失败！`)
    }
  }
  $prop: string
  $search: {
    dictionary: DictionaryValue[]
    observe: ObserveList
    form: FormValue
    data: Record<PropertyKey, unknown>
  }
  $menu: {
    list: (string | DictionaryEditMod)[]
  }
  $observe?: boolean
  $resetOption?: resetOption
  constructor(initOption: SearchDataInitOption) {
    if (initOption.simple === undefined) {
      initOption.simple = true
    }
    super(initOption)
    const prop = initOption.prop || 'search'
    this._triggerCreateLife('SearchData', false, initOption)
    this.$prop = prop
    const dictionaryList = this.getList(prop)
    const observeList = this.buildObserveList(prop, dictionaryList)
    const form = SearchData.$form
    this.$search = {
      dictionary: dictionaryList,
      observe: observeList,
      form: new form(),
      data: {}
    }
    const menu = getType(initOption.menu) === 'object' ? initOption.menu as menuInitType : {
      default: initOption.menu as menuInitType['default']
    }
    const menuList = menu.list || []
    this.$menu = {
      list: menu.default !== false ? [...SearchData.$menu.default, ...menuList] : menuList
    }
    this.$observe = initOption.observe
    this.$resetOption = initOption.resetOption
    this.$resetFormData('init')
    this._triggerCreateLife('SearchData', true)
  }
  $validate(): Promise<{ status: string }> {
    return new Promise((resolve, reject) => {
      this.$search.form.validate().then(() => {
        resolve({ status: 'success' })
      }).catch(err => {
        reject(err)
      })
    })
  }
  $syncFormData() {
    return new Promise((resolve, reject) => {
      this.$validate().then((res) => {
        this.syncFormData()
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
  syncFormData() {
    this.$search.data = this.createPostData(this.$search.form.getData(), this.$search.dictionary, this.$prop)
    this._syncData(true, 'syncFormData')
  }
  $resetFormData(from = '' , option?: resetOption) {
    if (!option) {
      option = this.$resetOption || {}
    }
    const search = this.$search
    this.createEditData(search.dictionary, this.$prop, undefined, {
      target: search.form.getData(),
      from: from,
      limit: option.limit
    })
    search.form.clearValidate()
    if (this.$observe) {
      search.observe.setForm(search.form.getData(), this.$prop)
    }
    if (option.copy !== false) {
      this.syncFormData()
    }
    this._syncData(true, '$resetFormData', from)
  }
  getData() {
    return this.$search.data
  }
  setForm(data: Record<PropertyKey, unknown>, { sync, force }: { sync?: boolean, force?: boolean } = {}) {
    const form = this.$search.form.getData()
    for (const prop in data) {
      form[prop] = data[prop]
    }
    if (sync === undefined || sync) {
      if (force) {
        this.syncFormData()
      } else {
        return this.$syncFormData()
      }
    }
  } 
  _install(target: BaseData) {
    super._install(target)
    // 监听事件
    this.onLife('updated', {
      id: target._getId('searchUpdated'),
      data: (...args) => {
        target.triggerLife('searchUpdated', ...args)
      }
    })
  }
  _uninstall(target: BaseData) {
    super._uninstall(target)
    // 停止监听事件
    this.offLife('updated', target._getId('searchUpdated'))
  }
}

export default SearchData
