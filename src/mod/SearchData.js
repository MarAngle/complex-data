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
    this.show = false
    this.title = {
      show: false,
      data: ''
    }
    this.menu = []
    this.form = {}
    this.post = {}
    if (initdata) {
      this.initSearchData(initdata)
      this.initFormData()
    }
    this.triggerCreateLife('SearchData', 'created')
  }

  initSearchData({
    title,
    menu
  }) {
    this.show = true
    this.initTitle(title)
    this.initMenu(menu)
  }
  initTitle(title) {
    if (title) {
      this.title.data = title
      this.title.show = true
    }
  }
  initMenu(menu = {}) {
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
  initFormData(type = 'build') {
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
  // 重置检索值
  resetFormData(from = 'init', option = {}, syncPost = true, type = 'build') {
    let limit = _func.getLimitData(option.limit)
    for (let n in this.form[type].mainlist) {
      let pitem = this.form[type].mainlist[n]
      if (!limit.getLimit(pitem.prop)) {
        let targetdata
        if (pitem.edit && pitem.edit.getValueData) {
          targetdata = from == 'init' ? pitem.edit.getValueData('initdata') : pitem.edit.getValueData('resetdata')
        }
        _func.setPropByStr(this.form[type].form.data, pitem.prop, targetdata, true)
      }
    }
    if (syncPost) {
      this.setData(type)
    }
  }
  setData(type = 'build') {
    this.post[type] = this.getEditData(this.form[type].form.data, this.form[type].modlist, 'build')
  }
  getData(type = 'build', deep = true) {
    if (deep) {
      return _func.deepClone(this.post[type], deep)
    } else {
      return this.post[type]
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
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'ComplexData',
        describe: '检索数据',
        build: [
          {
            prop: 'initdata',
            extend: true,
            data: [
              {
                prop: 'title',
                type: 'string',
                describe: 'title设置'
              },
              {
                prop: 'menu',
                type: 'object',
                describe: 'menu设置',
                data: [
                  {
                    prop: 'type',
                    type: 'string',
                    describe: '默认default，其他模式全自定义，default模式添加默认按钮'
                  },
                  {
                    prop: 'list',
                    type: 'array',
                    describe: '按钮列表数据',
                    data: [
                      {
                        prop: '[value]',
                        data: [
                          {
                            prop: 'type'
                          },
                          {
                            prop: 'icon'
                          },
                          {
                            prop: 'name'
                          },
                          {
                            prop: 'act'
                          },
                          {
                            prop: '[...]'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        data: [
          {
            prop: 'show',
            type: 'boolean',
            describe: 'search加载判断'
          },
          {
            prop: 'title',
            type: 'object',
            describe: 'title设置',
            data: [
              {
                prop: 'show',
                type: 'boolean',
                describe: 'title显示'
              },
              {
                prop: 'data',
                type: 'string',
                describe: 'title值'
              }
            ]
          },
          {
            prop: 'menu',
            type: 'array',
            describe: 'menu列表',
            data: [
              {
                prop: '[value]',
                data: [
                  {
                    prop: 'type'
                  },
                  {
                    prop: 'icon'
                  },
                  {
                    prop: 'name'
                  },
                  {
                    prop: 'act'
                  },
                  {
                    prop: '[...]'
                  }
                ]
              }
            ]
          },
          {
            prop: 'form',
            type: 'object',
            describe: 'form数据总对象，默认为build属性'
          },
          {
            prop: 'post',
            type: 'object',
            describe: 'post数据总对象，默认为build属性'
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

SearchData.initInstrcution()

export default SearchData
