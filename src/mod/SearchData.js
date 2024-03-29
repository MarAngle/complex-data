import _func from 'complex-func'
import config from '../../config'
import ComplexData from './../data/ComplexData'

class SearchData extends ComplexData {
  constructor (initOption) {
    super(initOption)
    this.$triggerCreateLife('SearchData', 'beforeCreate', initOption)
    this.init = false
    this.title = {
      show: false,
      data: ''
    }
    this.menu = []
    this.form = {}
    this.post = {}
    if (initOption) {
      this.initSearchData(initOption)
    }
    this.$triggerCreateLife('SearchData', 'created')
  }
  /**
   * 加载SearchData
   * @param {object} option 参数
   * @param {string} [option.title] 标题参数
   * @param {object} [option.menu] 菜单参数
   * @param {'default' | 'add'} [option.menu.type] 菜单类型
   * @param {object[]} [option.menu.list] 菜单列表
   */
  initSearchData({
    title,
    menu,
    pageList
  }) {
    this.usePageList = pageList
    this.setInit(true)
    this.initTitle(title)
    this.initMenu(menu)
    this.initSearchFormData()
  }
  /**
   * 设置加载判断值
   * @param {boolean} data 判断值
   */
  setInit(data) {
    this.init = data
  }
  /**
   * 获取加载判断值
   * @returns {boolean}
   */
  getInit() {
    return this.init
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
    if (this.getInit()) {
      if (!menu.list) {
        menu.list = []
      }
      if (!menu.type) {
        menu.type = 'default'
      }
      if (menu.type == 'default') {
        let defaultMenu = _func.deepClone(config.SearchData.menu, true)
        menu.list = defaultMenu.concat(menu.list)
      }
      this.menu = menu.list
    }
  }
  /**
   * 加载form
   * @param {string} type modtype
   */
  initSearchFormData(modType = 'build') {
    if (this.getInit()) {
      this.form[modType] = {
        modlist: [],
        mainlist: [],
        form: {
          data: {}
        }
      }
      this.form[modType].modlist = this.getDictionaryModList('build')
      this.form[modType].mainlist = this.getDictionaryPageListByModList('build', this.form[modType].modlist, {
        usePageList: this.usePageList
      })
      this.resetSearchFormData('init')
    }
  }
  /**
   * 重置检索值
   * @param {'init' | 'reset'} from 请求来源
   * @param {object} option 设置项
   * @param {string[]} [option.limit] 限制重置字段=>被限制字段不会进行重新赋值操作
   * @param {boolean} copyToPost 同步到post[modType]中
   * @param {string} modType modType
   */
  resetSearchFormData(from = 'init', option = {}, copyToPost = true, modType = 'build') {
    if (this.getInit()) {
      let modlist = this.form[modType].modlist
      this.buildDictionaryFormData(modlist, modType, null, {
        form: this.form[modType].form.data,
        from: from,
        limit: option.limit
      })
      if (this.usePageList) {
        this.form[modType].mainlist.setData(this.form[modType].form.data)
      }
      if (copyToPost) {
        this.setData(modType)
      }
    }
  }
  /**
   * 设置对应type的数据
   * @param {string} [modType = 'build'] modtype
   */
  setData(modType = 'build') {
    if (this.getInit()) {
      this.post[modType] = this.getEditData(this.form[modType].form.data, this.form[modType].modlist, 'build')
    }
  }
  /**
   * 获取当前检索数据
   * @param {string} [modType = 'build'] modtype
   * @param {boolean | object} [deep = true] 是否深拷贝
   * @returns {object}
   */
  getData(modType = 'build', deep = true) {
    if (this.getInit()) {
      if (deep) {
        return _func.deepClone(this.post[modType], deep)
      } else {
        return this.post[modType]
      }
    } else {
      return {}
    }
  }
  /**
   * 重置form
   */
  reset() {
    this.resetSearchFormData('reset')
  }
  /**
   * 模块加载
   * @param {object} target 加载到的目标
   */
  install (target) {
    target.onLife('reseted', {
      id: this.$getId('Reseted'),
      data: (instantiater, resetOption) => {
        if (target.$parseResetOption(resetOption, 'search') !== false) {
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
