import _func from 'complex-func'
import config from '../../config'
import ComplexData from './../data/ComplexData'

class SearchData extends ComplexData {
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
    this.form = {}
    this.post = {}
    this.initTitle(initOption.title)
    this.initMenu(initOption.menu)
    this.initSearchFormData()
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
