import _func from 'complex-func'
import config from '../../config'
import BaseData from './../data/BaseData'

class SearchData extends BaseData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super(initOption)
    this.triggerCreateLife('SearchData', 'beforeCreate', initOption)
    this.title = {
      show: false,
      data: ''
    }
    this.menu = []
    this.form = {
      modlist: [],
      mainlist: [],
      data: {}
    }
    this.post = {}
    this.modType = initOption.modType || 'build'
    this.initTitle(initOption.title)
    this.initMenu(initOption.menu)
    this.initForm()
    this.triggerCreateLife('SearchData', 'created')
  }
  /**
   * 加载标题
   * @param {Object} [title] 标题
   */
  initTitle(title) {
    if (title) {
      this.title.data = title
      this.title.show = true
    }
  }
  /**
   * 加载菜单
   * @param {*} [menu] 菜单参数
   * @param {'default' | 'add'} [menu.type] 菜单类型
   * @param {object[]} [menu.list] 菜单列表
   */
  initMenu(menu = {}) {
    if (!menu.list) {
      menu.list = []
    }
    if (!menu.type || menu.type == 'default') {
      let defaultMenu = _func.deepClone(config.SearchData.menu, true)
      menu.list = defaultMenu.concat(menu.list)
    }
    this.menu = menu.list
  }
  /**
   * 加载form
   * @param {string} type modtype
   */
   initForm() {
    this.form.modlist = this.getDictionaryModList(this.modType)
    this.form.mainlist = this.getDictionaryPageListByModList(this.modType, this.form.modlist)
    this.resetFormData('init')
  }
  /**
   * 重置检索值
   * @param {'init' | 'reset'} from 请求来源
   * @param {object} option 设置项
   * @param {string[]} [option.limit] 限制重置字段=>被限制字段不会进行重新赋值操作
   * @param {boolean} copyToPost 同步到post[modType]中
   * @param {string} modType modType
   */
  resetFormData(from = 'init', option = {}, copyToPost = true) {
    this.buildDictionaryFormData(this.form.modlist, this.modType, null, {
      form: this.form.data,
      from: from,
      limit: option.limit
    })
    if (copyToPost) {
      this.setData()
    }
  }
  /**
   * 设置对应type的数据
   */
  setData() {
    this.post = this.getEditData(this.form.data, this.form.modlist, this.modType)
  }
  /**
   * 获取当前检索数据
   * @param {string} [modType = 'build'] modtype
   * @param {boolean | object} [deep = true] 是否深拷贝
   * @returns {object}
   */
  getData(deep = true) {
    if (deep) {
      return _func.deepClone(this.post, deep)
    } else {
      return this.post
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
