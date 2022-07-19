import _func from 'complex-func'
import DefaultDataWithLife from './../data/DefaultDataWithLife'
import DictionaryItem from './DictionaryItem'
import OptionData from './OptionData'
import LayoutData from './LayoutData'
import utils from '../utils'

const propList = ['id', 'parentId', 'children']

class DictionaryList extends DefaultDataWithLife {
  constructor (initOption, payload = {}) {
    super(initOption)
    this.$triggerCreateLife('DictionaryList', 'beforeCreate', initOption, payload)
    this.option = new OptionData({
      isChildren: false,
      build: _func.getLimitData(),
      edit: {
        empty: false
      },
      tree: false
    })
    this.propData = {
      id: {
        prop: 'id',
        data: ''
      },
      parentId: {
        prop: 'parentId',
        data: ''
      },
      children: {
        prop: 'children',
        data: ''
      }
    }
    this.data = new Map()
    if (initOption) {
      this.initMain(initOption, payload)
    }
    this.$triggerCreateLife('DictionaryList', 'created', initOption)
  }
  initMain (initOption, payload = {}) {
    payload.type = payload.type || 'init'
    this.initOption(initOption.option)
    this.initDictionaryData(initOption, payload)
  }
  initOption (option = {}) {
    if (option.isChildren !== undefined) {
      this.option.setData('isChildren', option.isChildren)
    }
    if (option.build) {
      let buildLimit = _func.getLimitData(option.build, 'allow')
      this.option.setData('build', buildLimit, 'init')
    }
    if (option.edit) {
      this.option.setData('edit', option.edit)
    }
    if (option.tree !== undefined) {
      this.option.setData('tree', option.tree)
    }
  }
  /**
   * 获取构建设置项
   * @returns {object}
   */
  getBuildOption () {
    let buildOption = this.option.getData('build')
    return buildOption
  }
  /**
   * 设置LayoutData
   * @param {object} data LayoutData参数
   */
  setLayout (data) {
    this.layout = new LayoutData(data)
  }
  /**
   * 获取布局数据
   * @param {string} [prop] 属性
   * @returns {object | LayoutData}
   */
  getLayout (prop) {
    if (prop) {
      return this.layout.getData(prop)
    } else {
      return this.layout
    }
  }
  /**
   * 加载默认初始值.子类自动按照父类来源设置
   * @param {object} optiondata DictionaryItem初始化参数
   * @param {*} parentData 父元素
   * @param {*} isChildren 是否是子类
   */
  parseOptionFromParent (optiondata, parentData, isChildren) {
    if (isChildren && !optiondata.originfrom && parentData.originfrom) {
      optiondata.originfrom = parentData.originfrom
    }
  }
  /**
   * 分析传参
   * @param {object} initOption 传参
   * @returns {object}
   */
  parseInitOption (initOption) {
    return initOption
  }
  /**
   * 生成字典列表
   * @param {*} initOption 列表传参
   * @param {object} [payload] 设置项
   */
  initDictionaryData (initOption, payload = {}) { // type init push replace
    if (payload.type == 'init') {
      this.data.clear()
    }
    if (initOption) {
      initOption = this.parseInitOption(initOption)
      // 触发update生命周期
      this.triggerLife('beforeUpdate', this, initOption, payload)
      this.setParent(initOption.parent)
      this.setLayout(initOption.layout)
      let isChildren = this.option.getData('isChildren')
      for (let n in initOption.list) {
        let ditemOption = initOption.list[n]
        // 判断是否为一级，不为一级需要将一级的默认属性添加
        this.parseOptionFromParent(ditemOption, initOption.parent, isChildren)
        let ditem = this.getItem(ditemOption.prop)
        let act = {
          build: true,
          children: true
        }
        if (ditem) {
          if (payload.type == 'init') {
            // 加载模式下不能出现相同字段=加载模式出发前会先清空
            act.build = false
            act.children = false
            this.$exportMsg(`字典列表加载:${ditemOption.prop}重复!`)
          } else if (payload.type == 'push') {
            // 添加模式，不对相同ditem做处理，仅对额外数据做处理
            act.build = false
          } else if (payload.type == 'replace') {
            // 重构模式，相同字段替换
          }
        } else {
          // 无对应值，直接添加
        }
        if (act.build) {
          // 构建字典数据
          ditemOption.parent = this
          ditem = new DictionaryItem(ditemOption, {
            layout: this.getLayout()
          })
          this.data.set(ditem.prop, ditem)
        }
        if (act.children) {
          // 构建子字典列表
          this.$buildItemDictionary(ditem, ditemOption)
        }
      }
      this.initPropData(initOption)
    }
    // 触发update生命周期
    this.triggerLife('updated', this, {
      type: payload.type
    })
  }
  /**
   * 加载propData数据
   * @param {object} [initOption] 设置项
   */
  initPropData (initOption = {}) {
    for (let n in propList) {
      let prop = propList[n]
      let data = initOption[prop]
      if (data) {
        let type = _func.getType(data)
        if (type == 'object') {
          this.propData[prop] = data
        } else if (type == 'string' || type == 'number') {
          this.propData[prop].prop = data
        } else {
          this.$exportMsg(`字典列表propdata:${prop}属性格式未预期:${type}，请检查数据!`)
        }
      }
    }
  }
  /**
   * 解析字典初始化数据,获取子字典创建模式
   * @param {DictionaryItem} ditem 对应字典实例
   * @param {object} originOption 字典初始化数据
   * @returns {'' | 'self' | 'build'}
   */
  $parseBuildData (ditem, originOption) {
    let initOption = originOption.dictionary
    let type = ''
    if (this.option.getData('tree') && (this.getPropData('prop', 'children') == ditem.prop) && initOption === undefined) {
      initOption = 'self'
    }
    if (initOption == 'self') {
      type = 'self'
      if (originOption.type === undefined) {
        ditem.setInterface('type', 'default', 'array')
      }
    } else if (initOption) {
      type = 'build'
    }
    return type
  }
  /**
   * 创建字典的子字典列表
   * @param {DictionaryItem} ditem 对应字典实例
   * @param {object} originOption 字典初始化数据
   * @param {boolean} isChildren 是否子类
   */
  $buildItemDictionary (ditem, originOption, isChildren = true) {
    let type = this.$parseBuildData(ditem, originOption)
    if (type == 'build') {
      let initOption = this.parseInitOption(originOption.dictionary)
      if (!initOption.option) {
        initOption.option = {}
      }
      if (initOption.option.isChildren === undefined) {
        initOption.option.isChildren = isChildren
      }
      // 默认加载本级的build设置
      if (!initOption.option.build) {
        initOption.option.build = this.getBuildOption()
      }
      initOption.parent = ditem
      ditem.dictionary = new DictionaryList(initOption, {
        layout: this.getLayout()
      })
    } else if (type == 'self') {
      ditem.dictionary = this
    }
  }
  // 重新创建字典列表
  rebuildData (initOption, payload = {}) {
    payload.type = payload.type || 'replace'
    this.initDictionaryData(initOption, payload)
  }
  /**
   * 设置字典值
   * @param {*} data 值
   * @param {'data' | 'prop'} [target = 'data'] 目标属性
   * @param {'id' | 'parentId' | 'children'} [prop = 'id'] 目标
   */
  setPropData (data, target = 'data', prop = 'id') {
    this.propData[prop][target] = data
  }
  /**
   * 获取字典值
   * @param {'data' | 'prop'} [target = 'data'] 目标属性
   * @param {'id' | 'parentId' | 'children'} [prop = 'id'] 目标
   * @returns {*}
   */
  getPropData (target = 'data', prop = 'id') {
    return this.propData[prop][target]
  }

  /**
   * 获取列表MAP
   * @returns {Map<DictionaryItem>}
   */
  getList () {
    return this.data
  }

  /**
   * 获取字典对象
   * @param {*} data 值
   * @param {'prop' | 'id'} from 获取类型
   * @returns {DictionaryItem}
   */
  getItem (data, from = 'prop') {
    if (from == 'prop') {
      return this.data.get(data)
    } else if (from == 'id') {
      for (let ditem of this.data.values()) {
        if (ditem[this.getIdProp()] == data) {
          return ditem
        }
      }
    }
  }
  /**
   * 根据源数据格式化生成对象
   * @param {object} originitem 源数据
   * @param {string} [originfromType] 来源originfromType
   * @param {object} [option] 设置项
   * @param {boolean} [formatPrototype] 是否格式化原型
   * @param {number} [depth] 深度
   * @returns {object}
   */
  formatItem (originitem, originfromType = 'list', option, formatPrototype, depth) {
    let targetitem = {}
    this.updateItem(targetitem, originitem, originfromType, option, formatPrototype, depth)
    return targetitem
  }
  /**
   * 根据源数据更新数据
   * @param {object} targetitem 目标数据
   * @param {object} originitem 源数据
   * @param {string} [originfromType] 来源originfromType
   * @param {object} [option] 设置项
   * @param {boolean} [formatPrototype] 是否格式化原型
   * @param {number} [depth] 深度
   * @returns {object}
   */
  updateItem (targetitem, originitem, originfromType = 'info', option, formatPrototype, depth) {
    this.formatData(targetitem, originitem, originfromType, option, formatPrototype, depth)
    return targetitem
  }
  /**
   * 格式化列表数据
   * @param {object[]} targetlist 目标列表
   * @param {object[]} originlist 源数据列表
   * @param {string} [originfromType] 来源originfromType
   * @param {object} [option] 设置项
   * @param {boolean} [formatPrototype] 是否格式化原型
   * @param {number} [depth] 深度
   */
  formatListData (targetlist, originlist, originfromType = 'list', option = {}, formatPrototype = true, depth) {
    if (option.clearType === undefined || option.clearType) {
      _func.clearArray(targetlist)
    }
    for (let n in originlist) {
      let item = this.formatItem(originlist[n], originfromType, option.build, formatPrototype, depth)
      targetlist.push(item)
    }
  }
  /**
   * 格式化列表数据为treeList
   * @param {object[]} targetlist 目标列表treeList
   * @param {object[]} originlist 源数据列表
   * @param {string} [originfromType] 来源originfromType
   * @param {object} [option] 设置项
   * @param {boolean} [formatPrototype] 是否格式化原型
   * @param {number} [depth] 深度
   */
  formatTreeData (targetlist, originlist, originfromType = 'list', option = {}, depth, formatPrototype = true) {
    if (option.clearType === undefined || option.clearType) {
      _func.clearArray(targetlist)
    }
    for (let n in originlist) {
      let item = this.formatItem(originlist[n], originfromType, option.build, formatPrototype, depth)
      targetlist.push(item)
    }
  }

  $formatPrototype(targetitem, depth) {
    let currentPrototype = Object.create(Object.getPrototypeOf(targetitem))
    currentPrototype.$depth = depth
    Object.setPrototypeOf(targetitem, currentPrototype)
  }
  /**
   * 根据字典格式化数据
   * @param {object} targetitem 目标数据
   * @param {object} originitem 源数据
   * @param {string} originfromType 来源originfromType
   * @param {object} [option] 设置项
   * @param {boolean} [formatPrototype] 是否格式化原型
   * @param {number} [depth] 深度
   * @returns {object}
   */
  formatData (targetitem, originitem = {}, originfromType, option, formatPrototype, depth = 0) {
    if (!option) {
      option = this.getBuildOption()
    }
    if (!option.getLimit) {
      option = _func.getLimitData(option)
    }
    for (let ditem of this.data.values()) {
      this.formatDataNext(ditem, targetitem, originitem, originfromType, option, formatPrototype, depth)
    }
    if (formatPrototype) {
      this.$formatPrototype(targetitem, depth)
    }
    return targetitem
  }
  /**
   * 格式化数据
   * @param {DictionaryItem} ditem 字典
   * @param {object} targetitem 目标数据
   * @param {object} originitem 源数据
   * @param {string} originfromType 来源originfromType
   * @param {object} [option] 设置项
   * @param {boolean} [formatPrototype] 是否格式化原型
   * @param {number} [depth] 深度
   */
  formatDataNext (ditem, targetitem, originitem, originfromType, option, formatPrototype, depth = 0) {
    let build = false
    let isOther = false
    if (!option) {
      option = this.getBuildOption()
    }
    if (!option.getLimit) {
      option = _func.getLimitData(option)
    }
    if (ditem.isOrigin(originfromType)) {
      // 当前字典存在对应模块直接按照build模式进行
      build = true
    } else if (option.getLimit(originfromType)) {
      // 理论上设置为允许值可在此时构建出对应字段，通过vue.set进行赋值，解决数据不能双向绑定和提前构建对象结构，双向绑定问题通过vue.set解决，对象结构暂不考虑，因此此处暂时不做处理
      build = false
      isOther = false
    }
    if (build) {
      let targetType = ditem.getInterface('type', originfromType)
      if (!isOther) {
        let originprop = ditem.getInterface('originprop', originfromType)
        let origindata = _func.getProp(originitem, originprop)
        let targetdata
        if (ditem.dictionary) {
          depth++
          if (targetType == 'array') {
            if (origindata && origindata.length > 0) {
              targetdata = []
              this.formatListData(targetdata, origindata, originfromType, { build: option }, formatPrototype, depth)
              origindata = targetdata
            } else {
              origindata = []
            }
          } else {
            origindata = ditem.dictionary.formatData({}, origindata, originfromType, option, formatPrototype, depth)
          }
        }
        ditem.setDataByFormat(targetitem, ditem.prop, origindata, targetType, 'format', {
          targetitem: targetitem,
          originitem: originitem,
          depth: depth,
          type: originfromType
        })
      } else {
        if (targetitem[ditem.prop] === undefined) {
          let targetdata
          if (ditem.dictionary) {
            depth++
            if (targetType == 'array') {
              targetdata = []
            } else {
              targetdata = ditem.dictionary.formatData({}, {}, originfromType, option, formatPrototype, depth)
            }
          } else {
            if (targetType == 'object') {
              targetdata = {}
            } else if (targetType == 'array') {
              targetdata = []
            }
          }
          targetitem[ditem.prop] = targetdata
        }
      }
    }
  }
  /**
   * 获取符合模块要求的字典列表
   * @param {string} mod 模块名称
   * @returns {DictionaryItem[]}
   */
  getModList (modType) {
    return this.getModListNext([], this.data, modType)
  }
  /**
   * 从dataMap获取符合模块要求的字典列表
   * @param {DictionaryItem[]} modList 返回的字典列表
   * @param {Map<DictionaryItem>} dataMap 字典Map
   * @param {string} modType 模块名称
   * @returns {DictionaryItem[]}
   */
  getModListNext (modList, dataMap, modType) {
    for (let ditem of dataMap.values()) {
      let fg = ditem.isMod(modType)
      if (fg) {
        modList.push(ditem)
      }
    }
    return modList
  }
  /**
   * 获取符合模块要求的字典page列表
   * @param {string} modType 模块名称
   * @param {object} [payload] 参数
   * @returns {*[]}
   */
  getPageList (modType, payload) {
    let modList = this.getModList(modType)
    return this.getPageListByModList(modType, modList, payload)
  }
  /**
   * 将模块列表根据payload转换为页面需要数据的列表
   * @param {string} modType 模块名称
   * @param {DictionaryItem[]} modlist 模块列表
   * @param {object} [payload] 参数
   * @returns {*[]}
   */
  getPageListByModList (modType, modlist, payload = {}) {
    let pagelist = payload.usePageList ? utils.createDictionaryPageList(modType) : []
    for (let n = 0; n < modlist.length; n++) {
      let ditem = modlist[n]
      let pitem = ditem.getModData(modType, payload)
      if (ditem.dictionary && ditem.mod[modType] && ditem.mod[modType].$children) {
        let childrenProp = ditem.mod[modType].$children
        if (childrenProp === true) {
          childrenProp = 'children'
        }
        pitem[childrenProp] = ditem.dictionary.getPageList(modType, payload)
      }
      pagelist[payload.usePageList ? '$push' : 'push'](pitem)
    }
    return pagelist
  }
  /**
   * 根据模块列表生成对应的form对象
   * @param {DictionaryItem[]} modlist 模块列表
   * @param {string} modType 模块名称
   * @param {*} originitem 初始化数据
   * @param {object} option 设置项
   * @param {object} [option.form] 目标form数据
   * @param {string} [option.from] 调用来源
   * @param {string[]} [option.limit] 限制重置字段=>被限制字段不会进行重新赋值操作
   * @returns {object}
   */
  buildFormData(modlist, modType, originitem, option = {}) {
    let formData = option.form || {}
    let from = option.from
    let limit = _func.getLimitData(option.limit)
    let size = modlist.length
    for (let n = 0; n < size; n++) {
      let ditem = modlist[n]
      if (!limit.getLimit(ditem.prop)) {
        let tData = ditem.getFormData(modType, {
          targetItem: formData,
          originitem: originitem,
          from: from
        })
        _func.setProp(formData, ditem.prop, tData, true)
      }
    }
    return formData
  }
  /**
   * 基于formdata和模块列表返回编辑完成的数据
   * @param {object} formData form数据
   * @param {DictionaryItem[]} modlist 模块列表
   * @param {string} modType modType
   * @returns {object}
   */
  getEditData(formData, modlist, modType) {
    let editData = {}
    for (let n = 0; n < modlist.length; n++) {
      let ditem = modlist[n]
      let add = true
      if (!ditem.mod[modType].required) {
        /*
          存在check则进行check判断
          此时赋值存在2种情况
          1.不存在check 返回data ,data为真则赋值
          2.存在check,返回check函数返回值，为真则赋值
        */
        add = ditem.triggerFunc('check', formData[ditem.prop], {
          targetitem: editData,
          originitem: formData,
          type: modType
        })
        // empty状态下传递数据 或者 checkFg为真时传递数据 也就是edit.empty为false状态的非真数据不传递
        if (!add) {
          add = this.option.getData('edit.empty')
        }
      }
      if (add) {
        let oData = formData[ditem.prop]
        if (ditem.mod[modType].trim) {
          oData = _func.trimData(oData)
        }
        ditem.setDataByFormat(editData, ditem.getInterface('originprop', modType), oData, ditem.getInterface('type', modType), 'unedit', {
          targetitem: editData,
          originitem: formData,
          type: modType
        })
      }
    }
    return editData
  }
  /**
   * 模块加载
   * @param {object} target 加载到的目标
   */
  install (target) {
    // 监听事件
    this.onLife('updated', {
      id: target.$getId('dictionaryUpdated'),
      data: (...args) => {
        target.triggerLife('dictionaryUpdated', ...args)
      }
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
  uninstall (target) {
    // 停止监听事件
    this.offLife('updated', target.$getId('dictionaryUpdated'))
  }
}

DictionaryList.$name = 'DictionaryList'

export default DictionaryList
