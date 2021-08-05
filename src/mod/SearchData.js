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
    this.initFormData()
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
  initFormData(type = 'build') {
    if (this.getInit()) {
      this.form[type] = {
        modlist: [],
        mainlist: [],
        form: {
          data: {}
        }
      }
      this.form[type].modlist = this.getDictionaryModList('build')
      this.form[type].mainlist = this.getDictionaryPageListByModList('build', this.form[type].modlist)
      this.resetFormData('init')
    }
  }
  /**
   * 重置检索值
   * @param {'init' | 'reset'} from 请求来源
   * @param {object} option 设置项
   * @param {boolean} syncPost 同步到post[type]中
   * @param {string} type modtype
   */
  resetFormData(from = 'init', option = {}, syncPost = true, type = 'build') {
    if (this.getInit()) {
      let limit = _func.getLimitData(option.limit)
      for (let n in this.form[type].mainlist) {
        let pitem = this.form[type].mainlist[n]
        if (!limit.getLimit(pitem.prop)) {
          let targetdata
          if (pitem.edit && pitem.edit.getValueData) {
            targetdata = from == 'init' ? pitem.edit.getValueData('initdata') : pitem.edit.getValueData('resetdata')
          }
          _func.setProp(this.form[type].form.data, pitem.prop, targetdata, true)
        }
      }
      if (syncPost) {
        this.setData(type)
      }
    }
  }
  /**
   * 设置对应type的数据
   * @param {string} [type = 'build'] modtype
   */
  setData(type = 'build') {
    if (this.getInit()) {
      this.post[type] = this.getEditData(this.form[type].form.data, this.form[type].modlist, 'build')
    }
  }
  /**
   * 获取当前检索数据
   * @param {string} [type = 'build'] modtype
   * @param {boolean | object} [deep = true] 是否深拷贝
   * @returns {object}
   */
  getData(type = 'build', deep = true) {
    if (this.getInit()) {
      if (deep) {
        return _func.deepClone(this.post[type], deep)
      } else {
        return this.post[type]
      }
    } else {
      return {}
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
