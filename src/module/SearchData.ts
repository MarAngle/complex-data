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
  init?: boolean
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
          icon: 'search',
          debounce: 100
        }
      }),
      reset: new ButtonEdit({
        type: 'button',
        prop: '$reset',
        option: {
          type: 'primary',
          name: '重置',
          icon: 'reset',
          debounce: 100
        }
      }),
      refresh: new ButtonEdit({
        type: 'button',
        prop: '$refresh',
        option: {
          type: 'primary',
          name: '刷新',
          icon: 'refresh',
          debounce: 100
        }
      }),
      build: new ButtonEdit({
        type: 'button',
        prop: '$build',
        option: {
          type: 'primary',
          name: '新增',
          icon: 'build',
          debounce: 100
        }
      }),
      delete: new ButtonEdit({
        type: 'button',
        prop: '$delete',
        option: {
          type: 'danger',
          name: '删除',
          icon: 'delete',
          debounce: 200,
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
          type: 'primary',
          name: '详情',
          icon: 'info',
          debounce: 100,
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
          icon: 'import',
          debounce: 100
        }
      }),
      export: new ButtonEdit({
        type: 'button',
        prop: '$export',
        option: {
          type: 'primary',
          name: '导出',
          icon: 'export',
          debounce: 200
        }
      })
    } as {
      search: ButtonEdit
      reset: ButtonEdit
      refresh: ButtonEdit
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
  $runtime?: {
    ing?: true
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
    if (initOption.simple == undefined) {
      initOption.simple = {
        prop: true
      }
    } else if (initOption.simple.prop == undefined) {
      initOption.simple.prop = true
    }
    super(initOption)
    this._triggerCreateLife('SearchData', false, initOption)
    this.$type = initOption.type || 'search'
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
    if (initOption.init) {
      this.init()
    }
    // 完成初始化form
    this._triggerCreateLife('SearchData', true)
  }
  init(force?: boolean) {
    if (!this.$runtime || force) {
      const dictionaryList = this.getList(this.$type)
      const observeList = this.getObserveList(this.$type, dictionaryList)
      const form = new FormValue()
      this.$runtime = {
        ing: true,
        dictionary: dictionaryList,
        list: observeList,
        form: form
      }
      // 初始化form
      this.parseData(dictionaryList, form, this.$type, undefined, 'init').then(() => {
        delete this.$runtime?.ing
        this.triggerLife('inited', this, true)
      }).catch((error) => {
        delete this.$runtime?.ing
        this.triggerLife('inited', this, false, error)
      }).finally(() => {
        // 因为检索不能作为强关联关系，因此失败也进行赋值操作
        if (this.$observe) {
          observeList.startObserve(form.getData(), this.$type)
        }
        this.syncData(true)
      })
    }
  }
  $validate(): Promise<{ status: string }> {
    if (this.$runtime) {
      return this.$runtime.form.validate()
    } else {
      return Promise.reject({ status: 'fail', code: 'not init' })
    }
  }
  // 验证并同步值
  validateAndSyncData() {
    const promise = this.$validate()
    promise.then(() => {
      this.syncData()
    })
    return promise
  }
  // 同步值
  syncData(unTriggerSync?: boolean) {
    if (this.$runtime) {
      this.$current = this.collectData(this.$runtime.form.getData(), this.$runtime.dictionary, this.$type)
      if (!unTriggerSync) {
        this._syncData(true, 'syncData')
      }
    }
  }
  resetForm(from = '' , option?: resetOption) {
    const runtime = this.$runtime
    if (runtime) {
      if (!option) {
        option = this.$resetOption || {}
      }
      runtime.form.setData({})
      this.parseData(runtime.dictionary, runtime.form, this.$type, undefined, from)
      runtime.form.clearValidate()
      if (option.sync !== false) {
        this.syncData()
      }
      this._syncData(true, 'resetForm', from)
    }
  }
  getData(unClone?: boolean) {
    return !unClone ? deepCloneData(this.$current) : this.$current
  }
  assignData(data: Record<PropertyKey, any>, { assign, force }: { assign?: boolean, force?: boolean } = {}) {
    if (this.$runtime) {
      const form = this.$runtime.form.getData()
      Object.assign(form, data)
      if (assign == undefined || assign) {
        if (force) {
          this.syncData()
        } else {
          return this.validateAndSyncData()
        }
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
      if (this.$observe && this.$runtime) {
        this.$runtime.list.clearWatcher()
      }
    }
  }
  _install(target: BaseData) {
    super._install(target)
    // 主数据依赖加载完成后再自动进行初始化
    target.$onDependLoaded(() => {
      this.init()
    })
    this.onLife('updated', {
      id: target._getId('searchUpdated'),
      handler: (...args) => {
        target.triggerLife('searchUpdated', ...args)
      }
    })
    this.onLife('inited', {
      id: target._getId('searchInited'),
      handler: (_lifeValue, ...args) => {
        target.triggerLife('inited', ...args)
        target.triggerLife('searchInited', ...args)
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
