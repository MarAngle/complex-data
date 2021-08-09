import _func from 'complex-func'
import config from '../config'
import ComplexData from './../data/ComplexData'

class SearchData extends ComplexData {
  constructor (initdata) {
    super(initdata)
    this.triggerCreateLife('SearchData', 'beforeCreate', initdata)
    this.init = false
    this.title = {
      show: false,
      data: ''
    }
    this.menu = []
    this.form = {}
    this.post = {}
    if (initdata) {
      this.initSearchData(initdata)
    }
    this.triggerCreateLife('SearchData', 'created')
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
    menu
  }) {
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
   * @param {string} [title] 标题
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
      this.form[modType].mainlist = this.getDictionaryPageListByModList('build', this.form[modType].modlist)
      this.resetSearchFormData('init')
    }
  }
  /**
   * 重置检索值
   * @param {'init' | 'reset'} from 请求来源
   * @param {object} option 设置项
   * @param {string[]} [option.limit] 限制重置字段=>被限制字段不会进行重新赋值操作
   * @param {string} [option.sync] 同步操作，默认异步操作
   * @param {boolean} copyToPost 同步到post[modType]中
   * @param {string} modType modType
   */
  resetSearchFormData(from = 'init', option = {}, copyToPost = true, modType = 'build') {
    if (this.getInit()) {
      let modlist = this.form[modType].modlist
      let data = this.buildDictionaryFormData(modType, modlist, null, {
        form: this.form[modType].form.data,
        from: from,
        limit: option.limit,
        sync: option.sync
      })
      if (copyToPost) {
        if (option.sync) {
          this.setData(modType)
        } else {
          data.then(() => {
            this.setData(modType)
          })
        }
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
      id: this.$getModuleId('Reseted'),
      data: (resetOption) => {
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
    target.offLife('reseted', this.$getModuleId('Reseted'))
  }
}

export default SearchData
