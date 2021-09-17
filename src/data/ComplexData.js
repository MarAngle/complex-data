import _func from 'complex-func'
import utils from './../utils/index'
import BaseData from './BaseData'
import DictionaryList from './../mod/DictionaryList'

class ComplexData extends BaseData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    initOption.data = utils.formatData(initOption.data, {
      list: [],
      current: {}
    })
    super(initOption)
    this.triggerCreateLife('ComplexData', 'beforeCreate', initOption)
    if (initOption.dictionary && initOption.dictionary.constructor === DictionaryList) {
      this.setModule('dictionary', initOption.dictionary)
    } else {
      this.setModule('dictionary', new DictionaryList(this.formatDictionaryOption(initOption.dictionary, 'init')))
    }
    this._initComplexDataLife()
    this.triggerCreateLife('ComplexData', 'created')
  }
  /**
   * 加载生命周期函数
   */
  _initComplexDataLife() {
    // 添加重置生命周期回调，此时通过设置项对data数据进行重置操作，对象list/current属性
    this.onLife('reseted', {
      id: 'AutoComplexDataReseted',
      data: (instantiater, resetOption) => {
        if (this.parseResetOption(resetOption, 'data') !== false) {
          if (this.parseResetOption(resetOption, 'data.list') !== false) {
            this.resetDataList()
          }
          if (this.parseResetOption(resetOption, 'data.current') !== false) {
            this.resetDataCurrent()
          }
        }
      }
    })
  }
  /**
   * 解析dictionaryOption
   * @param {object} dictionaryOption DictionaryList初始化参数或实例
   * @param {'init' | 'rebuild'} from 时机
   * @returns {object}
   */
  formatDictionaryOption (dictionaryOption, from) {
    if (!dictionaryOption) {
      dictionaryOption = {}
    }
    if (!dictionaryOption.parent) {
      dictionaryOption.parent = this
    }
    if (this.parseDictionaryOption) {
      dictionaryOption = this.parseDictionaryOption(dictionaryOption, from)
    }
    return dictionaryOption
  }
  /**
   * 重新构建字典列表
   * @param {*} dictionary 字典列表构建参数
   * @param {*} payload :type 字典构建类型
   */
  rebuildDictionary (dictionaryOption, payload = {}) {
    if (dictionaryOption && dictionaryOption.constructor === DictionaryList) {
      this.setModule('dictionary', dictionaryOption)
    } else {
      dictionaryOption = this.formatDictionaryOption(dictionaryOption, 'rebuild')
      this.getModule('dictionary').rebuildData(dictionaryOption, payload)
    }
  }
  /**
   * 获取字典对象
   * @param {*} data 值
   * @param {'prop' | 'id'} from 获取类型
   * @returns {DictionaryData}
   */
  getDictionaryItem(data, from) {
    return this.getModule('dictionary').getItem(data, from)
  }
  /**
   * 设置字典值
   * @param {*} data 值
   * @param {'data' | 'prop'} [target = 'data'] 目标属性
   * @param {'id' | 'parentId' | 'children'} [prop = 'id'] 目标
   */
  setDictionaryPropData (data, target, prop) {
    this.getModule('dictionary').setPropData(data, target, prop)
  }
  /**
   * 获取字典值
   * @param {'data' | 'prop'} [target = 'data'] 目标属性
   * @param {'id' | 'parentId' | 'children'} [prop = 'id'] 目标
   * @returns {*}
   */
  getDictionaryPropData (target, prop) {
    return this.getModule('dictionary').getPropData(target, prop)
  }
  /**
   * 获取符合模块要求的字典列表
   * @param {string} mod 模块名称
   * @returns {DictionaryData[]}
   */
  getDictionaryModList (mod) {
    return this.getModule('dictionary').getModList(mod)
  }
  /**
   * 获取符合模块要求的字典page列表
   * @param {string} modType 模块名称
   * @param {object} [payload] 参数
   * @returns {*[]}
   */
  getDictionaryPageList (modType, payload) {
    return this.getModule('dictionary').getPageList(modType, payload)
  }
  /**
   * 将模块列表根据payload转换为页面需要数据的列表
   * @param {string} modType 模块名称
   * @param {DictionaryData[]} modlist 模块列表
   * @param {object} [payload] 参数
   * @returns {*[]}
   */
  getDictionaryPageListByModList (modType, modlist, payload) {
    return this.getModule('dictionary').getPageListByModList(modType, modlist, payload)
  }
  /**
   * 根据模块列表生成对应的form对象
   * @param {DictionaryData[]} modlist 模块列表
   * @param {string} modType 模块名称
   * @param {*} originitem 初始化数据
   * @param {object} option 设置项
   * @param {object} [option.form] 目标form数据
   * @param {string} [option.from] 调用来源
   * @param {string[]} [option.limit] 限制重置字段=>被限制字段不会进行重新赋值操作
   * @returns {object}
   */
  buildDictionaryFormData (modlist, modType, originitem, option) {
    return this.getModule('dictionary').buildFormData(modlist, modType, originitem, option)
  }
  /**
   * 根据源数据格式化生成对象
   * @param {object} originitem 源数据
   * @param {string} [originfromType] 来源originfromType
   * @param {object} [option] 设置项
   * @param {number} [depth] 深度
   * @returns {object}
   */
  formatItem (originitem, originfromType = 'list', option) {
    return this.getModule('dictionary').formatItem(originitem, originfromType, option)
  }
  /**
   * 根据源数据更新数据
   * @param {object} targetitem 目标数据
   * @param {object} originitem 源数据
   * @param {string} [originfromType] 来源originfromType
   * @param {object} [option] 设置项
   * @param {number} [depth] 深度
   * @returns {object}
   */
  updateItem (targetitem, originitem, originfromType = 'info', option) {
    return this.getModule('dictionary').updateItem(targetitem, originitem, originfromType, option)
  }
  /**
   * 格式化列表数据
   * @param {object[]} targetlist 目标列表
   * @param {object[]} originlist 源数据列表
   * @param {string} [originfromType] 来源originfromType
   * @param {object} [option] 设置项
   * @param {number} [depth] 深度
   */
  formatListData (targetlist, originlist, originfromType, option) {
    this.getModule('dictionary').formatListData(targetlist, originlist, originfromType, option)
  }
  /**
   * 格式化列表数据为treeList
   * @param {object[]} targetlist 目标列表treeList
   * @param {object[]} originlist 源数据列表
   * @param {string} [originfromType] 来源originfromType
   * @param {object} [option] 设置项
   */
  formatTreeData (targetlist, originlist, originfromType, option) {
    this.getModule('dictionary').formatTreeData(targetlist, originlist, originfromType, option)
  }
  /**
   * 根据源数据格式化生成对象并更新到targetitem中
   * @param {object} targetitem 目标数据
   * @param {object} originitem 源数据
   * @param {string} [originfromType] 来源originfromType
   * @param {object} [option] 更新设置项
   */
  formatItemData (targetitem, originitem, originfromType, option = {}) {
    if (!option.type) {
      option.type = 'add'
    }
    let item = this.formatItem(originitem, originfromType)
    _func.updateData(targetitem, item, option)
  }
  /**
   * 基于formdata和模块列表返回编辑完成的数据
   * @param {object} formData form数据
   * @param {DictionaryData[]} modlist 模块列表
   * @param {string} modType modType
   * @returns {object}
   */
  getEditData (formData, modlist, modType) {
    return this.getModule('dictionary').getEditData(formData, modlist, modType)
  }
  /**
   * 重置data.list
   */
  resetDataList() {
    _func.clearArray(this.data.list)
  }
  /**
   * 重置data.current
   */
  resetDataCurrent() {
    for (let n in this.data.current) {
      delete this.data.current[n]
    }
  }
}

ComplexData._name = 'ComplexData'

export default ComplexData
