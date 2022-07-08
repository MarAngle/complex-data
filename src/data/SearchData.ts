import _func from 'complex-func'
import config from '../../config'
import { objectAny } from '../../ts'
import { formatInitOption } from '../utils'
import BaseData, { BaseDataInitOption } from './../data/BaseData'

// 未定义

export interface SearchDataInitOption extends BaseDataInitOption {
  menu: any[]
}

class SearchData extends BaseData {
  $menu: any[]
  $type: string
  $form: {
    modlist: any[],
    mainlist: any[],
    data: objectAny
  }
  $data: objectAny
  constructor (initOption: any) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('SearchData', 'beforeCreate', initOption)
    this.$menu = []
    this.$type = initOption.type || 'build'
    this.$form = {
      modlist: [],
      mainlist: [],
      data: {}
    }
    this.$data = {}
    this.initMenu(initOption.menu)
    this.initForm()
    this.$triggerCreateLife('SearchData', 'created')
  }
  /**
   * 加载菜单
   * @param {*} [menu] 菜单参数
   * @param {'default' | 'add'} [menu.type] 菜单类型
   * @param {object[]} [menu.list] 菜单列表
   * @param {function} [menu.format] 菜单列表格式化函数
   */
  initMenu(menu: any = {}) {
    let menulist = menu.list || []
    if (menu.type === undefined || menu.type === 'default') {
      const defaultMenu = _func.deepClone(config.SearchData.menu, true)
      menulist = defaultMenu.concat(menulist)
    }
    if (menu.format) {
      menu.format(menulist)
    }
    this.$menu = menulist
  }
  /**
   * 加载form
   * @param {string} type type
   */
   initForm() {
    this.$form.modlist = this.getDictionaryModList(this.$type)
    this.$form.mainlist = this.getDictionaryPageListByModList(this.$type, this.$form.modlist)
    this.resetFormData('init')
  }
  /**
   * 重置检索值
   * @param {'init' | 'reset'} from 请求来源
   * @param {object} option 设置项
   * @param {string[]} [option.limit] 限制重置字段=>被限制字段不会进行重新赋值操作
   * @param {boolean} syncToData 同步到data中
   */
  resetFormData(from = 'init', option = {}, syncToData = true) {
    this.buildDictionaryFormData(this.$form.modlist, this.$type, null, {
      form: this.$form.data,
      from: from,
      limit: option.limit
    })
    if (syncToData) {
      this.setData()
    }
  }
  /**
   * 设置数据
   */
  setData() {
    this.$data = this.getEditData(this.$form.data, this.$form.modlist, this.$type)
  }
  /**
   * 获取当前检索数据
   * @param {boolean | object} [deep = true] 是否深拷贝
   * @returns {object}
   */
  getData(deep = true) {
    if (deep) {
      return _func.deepClone(this.$data, deep)
    } else {
      return this.$data
    }
  }
  /**
   * 重置form
   */
  reset() {
    this.resetFormData('reset')
  }
  /**
   * 模块加载
   * @param {object} target 加载到的目标
   */
  install (target) {
    target.onLife('reseted', {
      id: this.$getId('Reseted'),
      data: (instantiater, resetOption) => {
        if (target.parseResetOption(resetOption, 'search') !== false) {
          this.reset()
        }
      }
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
  uninstall(target) {
    target.offLife('reseted', this.$getId('Reseted'))
  }
}

SearchData.$name = 'SearchData'

export default SearchData
