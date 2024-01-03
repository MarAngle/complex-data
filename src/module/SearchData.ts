import { getType } from "complex-utils"
import DictionaryData, { DictionaryDataInitOption, createEditOption } from "./DictionaryData"
import DictionaryValue, { DictionaryValueInitOption } from "../lib/DictionaryValue"
import { DefaultEditButtonGroupOption } from "../dictionary/DefaultEditButtonGroup"
import ObserveList from "../dictionary/ObserveList"
import FormValue from "../lib/FormValue"
import BaseData from "./../data/BaseData"
import config from "../../config"

export interface resetFormOption {
  copy?: boolean
  observe?: boolean
  limit?: createEditOption['limit']
}

export type menuInitType = {
  default?: false | string[]
  group?: boolean | string
  name?: string
  list?: DefaultEditButtonGroupOption[]
}

export interface SearchDataInitOption extends DictionaryDataInitOption {
  prop?: string
  menu?: menuInitType['default'] | menuInitType
  formOption?: resetFormOption
}

function $parseMenu (menuInitOptionList: DefaultEditButtonGroupOption[], prop: string): DictionaryValueInitOption[]
function $parseMenu (menuInitOptionList: DefaultEditButtonGroupOption[], prop: string, group: string, groupName?: string): DictionaryValueInitOption
function $parseMenu(menuInitOptionList: DefaultEditButtonGroupOption[], prop: string, group?: string, groupName?: string) {
  if (!group) {
    return menuInitOptionList.map(menuInitOption => {
      return {
        prop: menuInitOption.prop,
        name: '',
        simple: {
          edit: true
        },
        mod: {
          [prop]: {
            $format: 'edit',
            type: 'button',
            option: {
              ...menuInitOption
            }
          }
        }
      } as DictionaryValueInitOption
    })
  } else {
    return {
      prop: group,
      name: groupName,
      simple: {
        edit: true
      },
      mod: {
        [prop]: {
          $format: 'edit',
          type: 'buttonGroup',
          list: menuInitOptionList
        }
      }
    } as DictionaryValueInitOption
  }
}

class SearchData extends DictionaryData {
  static $name = 'SearchData'
  static $form: null | (new() => FormValue) = null
  static $parseMenu = $parseMenu
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
    if (!initOption.list) {
      initOption.list = []
    }
    const prop = initOption.prop || 'search'
    const menu = getType(initOption.menu) === 'object' ? initOption.menu as menuInitType : {
      default: initOption.menu as menuInitType['default']
    }
    const defaultMenuList: DefaultEditButtonGroupOption[] = []
    if (menu.default !== false) {
      const defaultList = menu.default || ['search', 'reset']
      defaultList.forEach(menuName => {
        const menuOption = config.search.menu.data[menuName]
        if (menuOption) {
          defaultMenuList.push(menuOption)
        } else {
          console.error(`${menuName}对应的menu类型未在config中配置，菜单生成失败！`)
        }
      })
    }
    if ((menu.group === undefined && !config.search.menu.group) || menu.group === false) {
      const list = SearchData.$parseMenu(menu.list ? defaultMenuList.concat(menu.list) : defaultMenuList, prop)
      list.forEach(buttonInitOption => {
        initOption.list!.push(buttonInitOption)
      })
    } else {
      const dictionaryProp = (menu.group === true || menu.group === undefined) ? '$searchButtonGroup' : menu.group
      initOption.list.push(SearchData.$parseMenu(menu.list ? defaultMenuList.concat(menu.list) : defaultMenuList, prop, dictionaryProp, menu.name))
    }
    super(initOption)
    this._triggerCreateLife('SearchData', false, initOption)
    this.$prop = prop
    const dictionaryList = this.getList(prop)
    const observeList = this.buildObserveList(prop, dictionaryList)
    const form = SearchData.$form!
    this.$search = {
      dictionary: dictionaryList,
      observe: observeList,
      form: new form(),
      data: {}
    }
    this.$resetFormData('init', initOption.formOption)
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
    this.$syncData(true, 'syncFormData')
  }
  $resetFormData(from = '' , option: resetFormOption = {}) {
    const search = this.$search
    this.createEditData(search.dictionary, this.$prop, undefined, {
      target: search.form.getData(),
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
    this.onLife('updated', {
      id: target.$getId('searchUpdated'),
      data: (...args) => {
        target.triggerLife('searchUpdated', ...args)
      }
    })
  }
  $uninstall(target: BaseData) {
    super.$uninstall(target)
    // 停止监听事件
    this.offLife('updated', target.$getId('searchUpdated'))
  }
}

export default SearchData
