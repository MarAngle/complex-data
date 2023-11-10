import DictionaryData, { DictionaryDataInitOption, createFormOption } from "../module/DictionaryData"
import { DefaultEditButtonInitOption, DefaultEditButtonOption } from "../dictionary/DefaultEditButton"
import DictionaryValue from "../dictionary/DictionaryValue"
import ObserveList from "../dictionary/ObserveList"
import FormValue from "../lib/FormValue"
import BaseData from "./BaseData"

export interface resetFormOption {
  copy?: boolean
  observe?: boolean
  limit?: createFormOption['limit']
}

export interface searchMenuType extends DefaultEditButtonOption {
  prop: string
  name: string
  click?: DefaultEditButtonInitOption['click']
  reactive?: DefaultEditButtonInitOption['reactive']
}

export interface SearchDataInitOption extends DictionaryDataInitOption {
  prop?: string
  menu?: searchMenuType[]
  formOption?: resetFormOption
}

class SearchData extends DictionaryData {
  static $name = 'SearchData'
  static $form: null | (new() => FormValue) = null
  $prop: string
  $search: {
    dictionary: DictionaryValue[]
    observe: ObserveList
    form: FormValue
    data: Record<PropertyKey, unknown>
  }
  constructor(initOption: SearchDataInitOption) {
    const prop = initOption.prop || 'search'
    const menu = initOption.menu
    if (menu) {
      if (!initOption.list) {
        initOption.list = []
      }
      for (let i = 0; i < menu.length; i++) {
        const menuInitOption = menu[i]
        initOption.list.push({
          prop: menuInitOption.prop,
          name: menuInitOption.name,
          simple: true,
          mod: {
            [prop]: {
              $format: 'edit',
              type: 'button',
              option: {
                type: menuInitOption.type,
                icon: menuInitOption.icon,
                name: menuInitOption.name,
                loading: menuInitOption.loading
              },
              click: menuInitOption.click,
              reactive: menuInitOption.reactive
            }
          }
        })
      }
    }
    super(initOption)
    this._triggerCreateLife('SearchData', 'beforeCreate', initOption)
    this.$prop = prop
    const dictionaryList = this.$getList(prop)
    const observeList = this.$buildObserveList(prop, dictionaryList)
    const form = SearchData.$form!
    this.$search = {
      dictionary: dictionaryList,
      observe: observeList,
      form: new form,
      data: {}
    }
    this.$resetFormData('init', initOption.formOption)
    this._triggerCreateLife('SearchData', 'created')
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
    this.$search.data = this.$createPostData(this.$search.form.getData(), this.$search.dictionary, this.$prop)
    this.$syncData(true, 'syncFormData')
  }
  $resetFormData(from = '' , option: resetFormOption = {}) {
    const search = this.$search
    this.$createFormData(search.dictionary, this.$prop, undefined, {
      form: search.form.getData(),
      from: from,
      limit: option.limit
    })
    search.form.clearValidate()
    if (option.observe) {
      search.observe.setForm(search.form.getData(), this.$prop)
    }
    if (option.copy !== false) {
      this.syncFormData()
    }
    this.$syncData(true, '$resetFormData', from)
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
  $install(target: BaseData) {
    super.$install(target)
    // 监听事件
    this.$onLife('updated', {
      id: target.$getId('searchUpdated'),
      data: (...args) => {
        target.$triggerLife('searchUpdated', ...args)
      }
    })
  }
  $uninstall(target: BaseData) {
    super.$uninstall(target)
    // 停止监听事件
    this.$offLife('updated', target.$getId('searchUpdated'))
  }
}

export default SearchData
