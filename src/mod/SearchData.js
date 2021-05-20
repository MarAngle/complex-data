import _func from 'complex-func'
import ComplexData from './../data/ComplexData'

const defaultMenu = [
  {
    type: 'primary',
    icon: 'search',
    name: '查询',
    act: 'search'
  },
  {
    type: 'default',
    icon: 'reload',
    name: '重置',
    act: 'reset'
  }
]

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
  initSearchData({
    title,
    menu
  }) {
    this.setInit(true)
    this.initTitle(title)
    this.initMenu(menu)
    this.initFormData()
  }
  setInit(data) {
    this.init = data
  }
  getInit() {
    return this.init
  }
  initTitle(title) {
    if (title) {
      this.title.data = title
      this.title.show = true
    }
  }
  initMenu(menu = {}) {
    if (this.getInit()) {
      if (!menu.list) {
        menu.list = []
      }
      if (!menu.type) {
        menu.type = 'default'
      }
      if (menu.type == 'default') {
        menu.list = defaultMenu.concat(menu.list)
      }
      this.menu = menu.list
    }
  }
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
  // 重置检索值
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
  setData(type = 'build') {
    if (this.getInit()) {
      this.post[type] = this.getEditData(this.form[type].form.data, this.form[type].modlist, 'build')
    }
  }
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
  reset() {
    this.resetFormData('reset')
  }
  install (target) {
    target.onLife('reseted', {
      id: this.$getModuleName('Reseted'),
      data: (resetModule) => {
        if (target.analyzeResetModule(resetModule, 'search') !== false) {
          this.reset()
        }
      }
    })
  }
  uninstall(target) {
    target.offLife('reseted', this.$getModuleName('Reseted'))
  }
}

export default SearchData
