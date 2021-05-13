import _func from 'complex-func'
import utils from './../utils/index'
import BaseData from './BaseData'
import DictionaryList from './../mod/DictionaryList'

class ComplexData extends BaseData {
  constructor (initdata) {
    if (!initdata) {
      initdata = {}
    }
    initdata.data = utils.formatData(initdata.data, {
      list: [],
      current: {}
    })
    super(initdata)
    this.triggerCreateLife('ComplexData', 'beforeCreate', initdata)
    /*
    build: {
      limit: [] // 存在值则对应的模块在非对象模块时不参与构建整个数据
    }
    */
    this.setModule('dictionary', new DictionaryList())
    this._initComplexData(initdata)
    this._initComplexDataLife()
    this.triggerCreateLife('ComplexData', 'created')
  }
  // 加载生命周期函数
  _initComplexDataLife() {
    this.onLife('reseted', {
      id: 'AutoComplexDataReseted',
      data: (resetModule) => {
        if (this.analyzeResetModule(resetModule, 'data') !== false) {
          if (this.analyzeResetModule(resetModule, 'data.list') !== false) {
            this.resetDataList()
          }
          if (this.analyzeResetModule(resetModule, 'data.current') !== false) {
            this.resetDataCurrent()
          }
        }
      }
    })
  }
  _initComplexData ({
    dictionary
  }) {
    this.initDictionary(dictionary)
  }
  // 设置字典列表
  initDictionary (dictionaryOption) {
    if (dictionaryOption) {
      if (dictionaryOption.constructor === DictionaryList) {
        this.setModule('dictionary', dictionaryOption)
      } else {
        dictionaryOption = this.analyzeDictionaryOption(dictionaryOption, 'init')
        if (!dictionaryOption.parent) {
          dictionaryOption.parent = this
        }
        this.getModule('dictionary').initMain(dictionaryOption)
      }
    }
  }
  analyzeDictionaryOption (dictionaryOption, from) {
    return dictionaryOption
  }
  /**
   * 重新构建字典列表
   * @param {*} dictionary 字典列表构建参数
   * @param {*} payload :type 字典构建类型
   */
  rebuildDictionary (dictionaryOption, payload = {}) {
    if (dictionaryOption) {
      if (dictionaryOption.constructor === DictionaryList) {
        this.setModule('dictionary', dictionaryOption)
      } else {
        dictionaryOption = this.analyzeDictionaryOption(dictionaryOption, 'rebuild')
        if (!dictionaryOption.parent) {
          dictionaryOption.parent = this
        }
        this.getModule('dictionary').rebuildData(dictionaryOption, {
          type: payload.type
        })
      }
    }
  }
  getDictionaryItem(data, from) {
    return this.getModule('dictionary').getItem(data, from)
  }
  // 设置字典唯一值
  setDictionaryPropData (data, target, prop) {
    this.getModule('dictionary').setPropData(data, target, prop)
  }
  // 获取字典唯一值
  getDictionaryPropData (target, prop) {
    return this.getModule('dictionary').getPropData(target, prop)
  }
  getDictionaryModList (mod) {
    return this.getModule('dictionary').getModList(mod)
  }
  getDictionaryPageList (mod, payload) {
    return this.getModule('dictionary').getPageList(mod, payload)
  }
  getDictionaryPageListByModList (mod, modlist, payload) {
    return this.getModule('dictionary').getPageListByModList(mod, modlist, payload)
  }
  getDictionaryFormData(modlist, mod, originitem) {
    return this.getModule('dictionary').getFormData(modlist, mod, originitem)
  }
  // 根据源数据格式化对象
  formatItem (originitem, type = 'list', option) {
    return this.getModule('dictionary').formatItem(originitem, type, option)
  }
  // 根据源数据更新数据
  updateItem (targetitem, originitem, type = 'info', option) {
    return this.getModule('dictionary').updateItem(targetitem, originitem, type, option)
  }
  // 格式化列表数据
  formatListData (targetlist, originlist, type, option) {
    this.getModule('dictionary').formatListData(targetlist, originlist, type, option)
  }
  // 格式化列表数据
  formatTreeData (targetlist, originlist, type, option) {
    this.getModule('dictionary').formatTreeData(targetlist, originlist, type, option)
  }
  // 格式化独立数据
  formatItemData (targetitem, originitem, type, option = {}) {
    if (!option.type) {
      option.type = 'add'
    }
    let item = this.formatItem(originitem, type)
    _func.updateData(targetitem, item, option)
  }
  // 格式化Form数据
  getEditData (formData, modlist, type) {
    return this.getModule('dictionary').getEditData(formData, modlist, type)
  }
  // 重置data.list
  resetDataList() {
    _func.clearArray(this.data.list)
  }
  // 重置data.list
  resetDataCurrent() {
    for (let n in this.data.current) {
      delete this.data.current[n]
    }
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'BaseData',
        describe: '实现DictionaryList数据的加载',
        build: [
          {
            prop: 'initdata',
            extend: true,
            data: [
              {
                prop: 'option',
                type: 'object',
                describe: 'option设置（暂无）'
              },
              {
                prop: 'data',
                extend: true,
                describe: '默认传递list[]和current{}'
              },
              {
                prop: 'dictionary',
                type: 'object',
                class: 'DictionaryList',
                describe: 'dictionary加载数据'
              }
            ]
          }
        ],
        data: [
          {
            prop: 'module',
            extend: true,
            data: [
              {
                prop: 'dictionary',
                class: 'DictionaryList',
                describe: '字典列表数据'
              }
            ]
          },
          {
            prop: 'data',
            extend: true,
            data: [
              {
                prop: 'list',
                type: 'array',
                describe: '数组'
              },
              {
                prop: 'current',
                type: 'object',
                describe: '对象'
              }
            ]
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

ComplexData.initInstrcution()

export default ComplexData
