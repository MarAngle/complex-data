import DictionaryData, { DictionaryDataInitOption, createFormOption } from "./DictionaryData"
import DictionaryValue, { DictionaryValueInitOption } from "../dictionary/DictionaryValue"
import { DefaultEditButtonGroupOption } from "../dictionary/DefaultEditButtonGroup"
import ObserveList from "../dictionary/ObserveList"
import FormValue from "../lib/FormValue"
import BaseData from "./../data/BaseData"

export interface resetFormOption {
  copy?: boolean
  observe?: boolean
  limit?: createFormOption['limit']
}

export interface SearchDataInitOption extends DictionaryDataInitOption {
  prop?: string
  menu?: {
    list?: Partial<DefaultEditButtonGroupOption>[]
  }
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
    if (initOption.simple === undefined) {
      initOption.simple = true
    }
    const prop = initOption.prop || 'search'
    const menu = initOption.menu
    if (menu) {
      if (!initOption.list) {
        initOption.list = []
      }
      const menuList = menu.list || []
      const buttonGroupInitOption = {
        prop: '$searchButtonGroup',
        name: '$searchButtonGroup',
        simple: {
          edit: true
        },
        mod: {
          [prop]: {
            $format: 'edit',
            type: 'buttonGroup',
            list: menuList
          }
        }
      } as DictionaryValueInitOption
      initOption.list.push(buttonGroupInitOption)
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
