import { deepCloneData, getType } from "complex-utils"
import DictionaryData, { DictionaryDataInitOption } from "./DictionaryData"
import DictionaryValue, { DictionaryEditMod } from "../lib/DictionaryValue"
import ObserveList from "../dictionary/ObserveList"
import FormValue from "../lib/FormValue"
import BaseData from "./../data/BaseData"
import ButtonEdit from "../dictionary/ButtonEdit"

export interface resetOption {
  sync?: boolean
}

export type menuInitType = {
  default?: boolean
  list?: (string | DictionaryEditMod)[]
}

export interface SearchDataInitOption extends DictionaryDataInitOption {
  type?: string
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
          name: '重置',
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
      info: new ButtonEdit({
        type: 'button',
        prop: '$info',
        option: {
          type: 'primay',
          name: '详情',
          icon: 'info',
          disabled(payload) {
            if (payload.choice !== 1) {
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
  static $getMenu = function(menuName: string) {
    const menuOption = SearchData.$menu.data[menuName]
    if (menuOption) {
      return menuOption
    } else {
      console.error(`${menuName}对应的menu类型未在config中配置，菜单生成失败！`)
    }
  }
  $type: string
  $runtime: {
    dictionary: DictionaryValue[]
    list: ObserveList
    form: FormValue
  }
  $current: Record<PropertyKey, any>
  $menu: {
    list: (string | DictionaryEditMod)[]
  }
  $observe?: boolean
  $resetOption?: resetOption
  constructor(initOption: SearchDataInitOption) {
    // SearchData的simple.prop默认为真
    if (initOption.simple === undefined) {
      initOption.simple = {
        prop: true
      }
    } else if (initOption.simple.prop === undefined) {
      initOption.simple.prop = true
    }
    super(initOption)
    this._triggerCreateLife('SearchData', false, initOption)
    this.$type = initOption.type || 'search'
    const dictionaryList = this.getList(this.$type)
    const observeList = this.getObserveList(this.$type, dictionaryList)
    const form = new FormValue()
    this.$runtime = {
      dictionary: dictionaryList,
      list: observeList,
      form: form
    }
    this.$current = {}
    const menu = getType(initOption.menu) === 'object' ? initOption.menu as menuInitType : {
      default: initOption.menu as menuInitType['default']
    }
    const menuList = menu.list || []
    this.$menu = {
      list: menu.default !== false ? [...SearchData.$menu.default, ...menuList] : menuList
    }
    this.$observe = initOption.observe
    this.$resetOption = initOption.resetOption
    // 初始化form
    this.parseData(dictionaryList, form, this.$type, undefined, 'init')
    if (this.$observe) {
      observeList.startObserve(form.getData(), this.$type)
    }
    this.syncData(true)
    // 完成初始化form
    this._triggerCreateLife('SearchData', true)
  }
  $validate(): Promise<{ status: string }> {
    return new Promise((resolve, reject) => {
      this.$runtime.form.validate().then(() => {
        resolve({ status: 'success' })
      }).catch(err => {
        reject(err)
      })
    })
  }
  // 验证并同步值
  validateAndSyncData() {
    return new Promise((resolve, reject) => {
      this.$validate().then((res) => {
        this.syncData()
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
  // 同步值
  syncData(unTriggerSync?: boolean) {
    this.$current = this.collectData(this.$runtime.form.getData(), this.$runtime.dictionary, this.$type)
    if (!unTriggerSync) {
      this._syncData(true, 'syncData')
    }
  }
  resetForm(from = '' , option?: resetOption) {
    if (!option) {
      option = this.$resetOption || {}
    }
    const runtime = this.$runtime
    this.parseData(runtime.dictionary, runtime.form, this.$type, undefined, from)
    runtime.form.clearValidate()
    if (option.sync !== false) {
      this.syncData()
    }
    this._syncData(true, 'resetForm', from)
  }
  getData(unClone?: boolean) {
    if (unClone) {
      return this.$current
    } else {
      return deepCloneData(this.$current)
    }
  }
  assignData(data: Record<PropertyKey, any>, { assign, force }: { assign?: boolean, force?: boolean } = {}) {
    const form = this.$runtime.form.getData()
    for (const prop in data) {
      form[prop] = data[prop]
    }
    if (assign === undefined || assign) {
      if (force) {
        this.syncData()
      } else {
        return this.validateAndSyncData()
      }
    }
  }
  reset(option?: boolean) {
    if (option !== false) {
      this.resetForm('reset')
    }
  }
  destroy(option?: boolean) {
    if (option !== false) {
      this.reset(option)
      if (this.$observe) {
        this.$runtime.list.clearWatcher()
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
