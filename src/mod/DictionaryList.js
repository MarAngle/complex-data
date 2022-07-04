import _func from 'complex-func'
import DefaultData from './../data/DefaultData'
import DictionaryItem from './DictionaryItem'
import OptionData from './OptionData'
import LayoutData from './LayoutData'

const propList = ['id', 'parentId', 'children']

class DictionaryList extends DefaultData {
  constructor (initOption) {
    super(initOption)
    this.$triggerCreateLife('DictionaryList', 'beforeCreate', initOption)
    this.$option = new OptionData({
      isChildren: false,
      build: _func.getLimitData(),
      empty: false,
      tree: false
    })
    this.$propData = {
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
      this.initOption(initOption.option)
      this.initDictionaryItem(initOption)
    }
    this.$triggerCreateLife('DictionaryList', 'created', initOption)
  }
  initOption (option = {}) {
    for (const prop in option) {
      let data = option[prop]
      if (prop != 'build') {
        this.$option.setData(prop, data)
      } else {
        this.$option.setData(prop, _func.getLimitData(data, 'allow'), 'init')
      }
    }
  }
  /**
   * 设置LayoutData
   * @param {object} data LayoutData参数
   */
  setLayout (data) {
    this.$layout = new LayoutData(data)
  }
  /**
   * 获取布局数据
   * @param {string} [prop] 属性
   * @returns {object | LayoutData}
   */
  getLayout (prop) {
    if (prop) {
      return this.$layout.getData(prop)
    } else {
      return this.$layout
    }
  }
  /**
   * 加载默认初始值.子类自动按照父类来源设置
   * @param {object} optiondata DictionaryItem初始化参数
   * @param {*} parentData 父元素
   * @param {*} isChildren 是否是子类
   */
  $parseOptionFromParent (optiondata, parentData, isChildren) {
    if (isChildren && !optiondata.originfrom && parentData && parentData.originfrom) {
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
          this.$propData[prop] = data
        } else if (type == 'string' || type == 'number') {
          this.$propData[prop].prop = data
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
  $parseChildrenBuildType (ditem, originOption) {
    let initOption = originOption.dictionary
    let type = ''
    if (this.$option.getData('tree') && (this.getPropData('prop', 'children') == ditem.prop) && initOption === undefined) {
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
  $initDictionaryItemChildren (ditem, originOption, isChildren = true) {
    let type = this.$parseChildrenBuildType(ditem, originOption)
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
        initOption.option.build = this.$option.getData('build')
      }
      initOption.parent = ditem
      if (!initOption) {
        initOption.layout = this.getLayout()
      }
      ditem.$dictionary = new DictionaryList(initOption)
    } else if (type == 'self') {
      ditem.$dictionary = this
    }
  }
  /**
   * 生成字典列表
   * @param {*} initOption 列表传参
   * @param {object} [payload] 设置项
   */
  initDictionaryItem (initOption, type = 'init') { // type init push replace
    // 触发update生命周期
    this.triggerLife('beforeUpdate', this, initOption, type)
    if (type == 'init') {
      this.data.clear()
    }
    if (initOption) {
      initOption = this.parseInitOption(initOption)
      let parentData = this.getParent()
      this.setLayout(initOption.layout)
      let isChildren = this.$option.getData('isChildren')
      for (let n in initOption.list) {
        let ditemOption = initOption.list[n]
        // 判断是否为一级，不为一级需要将一级的默认属性添加
        this.$parseOptionFromParent(ditemOption, parentData, isChildren)
        let ditem = this.getItem(ditemOption.prop)
        let act = {
          build: true,
          children: true
        }
        if (ditem) {
          if (type == 'init') {
            // 加载模式下不能出现相同字段=加载模式出发前会先清空
            act.build = false
            act.children = false
            this.$exportMsg(`字典列表加载:${ditemOption.prop}重复!`)
          } else if (type == 'push') {
            // 添加模式，不对相同ditem做处理，仅对子数据做处理
            act.build = false
          } else if (type == 'replace') {
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
          this.$initDictionaryItemChildren(ditem, ditemOption)
        }
      }
      this.initPropData(initOption)
    }
    // 触发update生命周期
    this.triggerLife('updated', this, initOption, type)
  }
  // 重新创建字典列表
  rebuildData (initOption, type = 'replace') {
    this.initDictionaryItem(initOption, type)
  }
  /**
   * 设置字典值
   * @param {*} data 值
   * @param {'data' | 'prop'} [target = 'data'] 目标属性
   * @param {'id' | 'parentId' | 'children'} [prop = 'id'] 目标
   */
  setPropData (data, target = 'data', prop = 'id') {
    this.$propData[prop][target] = data
  }
  /**
   * 获取字典值
   * @param {'data' | 'prop'} [target = 'data'] 目标属性
   * @param {'id' | 'parentId' | 'children'} [prop = 'id'] 目标
   * @returns {*}
   */
  getPropData (target = 'data', prop = 'id') {
    return this.$propData[prop][target]
  }

  /**
   * 获取列表MAP
   * @returns {Map<DictionaryItem>}
   */
  getData () {
    return this.data
  }

  /**
   * 获取字典对象
   * @param {*} data 值
   * @param {string} [prop] 判断的属性
   * @returns {DictionaryItem}
   */
   getItem (data, prop) {
    if (!prop) {
      return this.data.get(data)
    } else {
      for (let ditem of this.data.values()) {
        if (ditem[prop] == data) {
          return ditem
        }
      }
    }
  }
  /**
   * 格式化列表数据
   * @param {object[]} targetList 目标列表
   * @param {object[]} originList 源数据列表
   * @param {string} [originFrom] 来源originFrom
   * @param {object} [option] 设置项
   * @param {boolean} [formatPrototype] 是否格式化原型
   * @param {number} [depth] 深度
   */
  formatListData (targetList, originList, originFrom = 'list', option = {}, formatPrototype = true, depth) {
    if (option.clearType === undefined || option.clearType) {
      _func.clearArray(targetList)
    }
    for (let n in originList) {
      let item = this.buildData(originList[n], originFrom, option.build, formatPrototype, depth)
      targetList.push(item)
    }
  }
  /**
   * 根据源数据格式化生成对象
   * @param {object} originData 源数据
   * @param {string} [originFrom] 来源originFrom
   * @param {object} [option] 设置项
   * @param {boolean} [formatPrototype] 是否格式化原型
   * @param {number} [depth] 深度
   * @returns {object}
   */
  buildData(originData, originFrom = 'list', option, formatPrototype, depth) {
    return this.updateData({}, originData, originFrom, option, formatPrototype, depth)
  }
  /**
   * 根据源数据更新数据
   * @param {object} targetData 目标数据
   * @param {object} originData 源数据
   * @param {string} [originFrom] 来源originFrom
   * @param {boolean} [formatPrototype] 是否格式化原型
   * @param {number} [depth] 深度
   * @returns {object}
   */
  updateData(targetData, originData, originFrom = 'info', option, formatPrototype, depth) {
    return this.formatData(targetData, originData, originFrom, option, formatPrototype, depth)
  }
  /**
   * 根据字典格式化数据
   * @param {object} targetData 目标数据
   * @param {object} originData 源数据
   * @param {string} originFrom 来源originFrom
   * @param {object} [option] 设置项
   * @param {boolean} [formatPrototype] 是否格式化原型
   * @param {number} [depth] 深度
   * @returns {object}
   */
  formatData(targetData, originData, originFrom, option, formatPrototype, depth) {
    if (!targetData) {
      targetData = {}
    }
    if (!originData) {
      originData = {}
    }
    if (!originFrom) {
      originFrom = 'list'
    }
    if (!option) {
      option = this.$option.getData('build')
    }
    if (!option.getLimit) {
      option = _func.getLimitData(option)
    }
    if (depth === undefined) {
      depth = 0
    }
    return this.$formatDataStart(targetData, originData, originFrom, option, formatPrototype, depth)
  }
  $formatPrototype(targetData, depth) {
    let currentPrototype = Object.create(Object.getPrototypeOf(targetData))
    currentPrototype.$depth = depth
    Object.setPrototypeOf(targetData, currentPrototype)
  }
  /**
   * 根据字典格式化数据START
   * @param {object} targetData 目标数据
   * @param {object} originData 源数据
   * @param {string} originFrom 来源originFrom
   * @param {object} [option] 设置项
   * @param {boolean} [formatPrototype] 是否格式化原型
   * @param {number} [depth] 深度
   * @returns {object}
   */
  $formatDataStart(targetData, originData, originFrom, option, formatPrototype, depth = 0) {
    for (let ditem of this.data.values()) {
      this.$formatDataNext(ditem, targetData, originData, originFrom, option, formatPrototype, depth)
    }
    if (formatPrototype) {
      this.$formatPrototype(targetData, depth)
    }
    return targetData
  }
  /**
   * 格式化数据
   * @param {DictionaryItem} ditem 字典
   * @param {object} targetData 目标数据
   * @param {object} originData 源数据
   * @param {string} originFrom 来源originFrom
   * @param {object} [option] 设置项
   * @param {boolean} [formatPrototype] 是否格式化原型
   * @param {number} [depth] 深度
   * @returns {object}
   */
  $formatDataNext(ditem, targetData, originData, originFrom, option, formatPrototype, depth) {
    let build = false
    if (ditem.isOriginFrom(originFrom)) {
      build = true
    } else if (option.getLimit(originFrom)) {
      build = false
    }
    if (build) {
      let type = ditem.getInterface('type', originFrom)
      let originProp = ditem.getInterface('originProp', originFrom)
      let oData = _func.getProp(originData, originProp)
      if (ditem.$dictionary) {
        depth++
        if (type != 'array') {
          if (_func.getType(oData) == 'object') {
            oData = ditem.$dictionary.$formatDataStart({}, oData, originFrom, option, formatPrototype, depth)
          } else {
            oData = {}
          }
        } else {
          if (_func.getType(oData) == 'array') {
            let oList = []
            for (let i = 0; i < oData.length; i++) {
              let oItem = ditem.$dictionary.$formatDataStart({}, oData[i], originFrom, option, formatPrototype, depth)
              oList.push(oItem)
            }
            oData = oList
          } else {
            oData = []
          }
        }
      }
      ditem.setDataByFormat(targetData, ditem.prop, oData, type, 'format', {
        targetData: targetData,
        originData: originData,
        depth: depth,
        type: originFrom
      })
    }
  }
  /**
   * 获取符合模块要求的字典列表
   * @param {string} mod 模块名称
   * @returns {DictionaryItem[]}
   */
  getModList (modType) {
    return this.$getModListByMap([], this.data, modType)
  }
  /**
   * 从dataMap获取符合模块要求的字典列表
   * @param {DictionaryItem[]} modList 返回的字典列表
   * @param {Map<DictionaryItem>} dataMap 字典Map
   * @param {string} modType 模块名称
   * @returns {DictionaryItem[]}
   */
  $getModListByMap (modList, dataMap, modType) {
    for (let ditem of dataMap.values()) {
      let mod = ditem.getMod(modType)
      if (mod) {
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
   * @param {DictionaryItem[]} modList 模块列表
   * @param {object} [payload] 参数
   * @returns {*[]}
   */
  getPageListByModList (modType, modList, payload = {}) {
    let pageList = []
    for (let n = 0; n < modList.length; n++) {
      let ditem = modList[n]
      let pitem = ditem.getModData(modType, payload)
      if (ditem.$dictionary) {
        let mod = ditem.getMod(modType)
        if (mod && mod.$children) {
          let childrenProp = mod.$children
          if (childrenProp === true) {
            childrenProp = 'children'
          }
          pitem[childrenProp] = ditem.$dictionary.getPageList(modType, payload)
        }
      }
      pageList.push(pitem)
    }
    return pageList
  }
  /**
   * 根据模块列表生成对应的form对象
   * @param {DictionaryItem[]} modList 模块列表
   * @param {string} modType 模块名称
   * @param {*} originData 初始化数据
   * @param {object} option 设置项
   * @param {object} [option.form] 目标form数据
   * @param {string} [option.from] 调用来源
   * @param {string[]} [option.limit] 限制重置字段=>被限制字段不会进行重新赋值操作
   * @returns {object}
   */
  buildFormData(modList, modType, originData, option = {}) {
    let formData = option.form || {}
    let from = option.from
    let limit = _func.getLimitData(option.limit)
    let size = modList.length
    for (let n = 0; n < size; n++) {
      let ditem = modList[n]
      if (!limit.getLimit(ditem.prop)) {
        let tData = ditem.getFormData(modType, {
          targetData: formData,
          originData: originData,
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
   * @param {DictionaryItem[]} modList 模块列表
   * @param {string} modType modType
   * @returns {object}
   */
  getEditData(formData, modList, modType) {
    let editData = {}
    for (let n = 0; n < modList.length; n++) {
      let ditem = modList[n]
      let add = true
      if (!ditem.$mod[modType].required) {
        /*
          存在check则进行check判断
          此时赋值存在2种情况
          1.不存在check 返回data ,data为真则赋值
          2.存在check,返回check函数返回值，为真则赋值
        */
        add = ditem.triggerFunc('check', formData[ditem.prop], {
          targetData: editData,
          originData: formData,
          type: modType
        })
        // empty状态下传递数据 或者 checkFg为真时传递数据 也就是empty为false状态的非真数据不传递
        if (!add) {
          add = this.$option.getData('empty')
        }
      }
      if (add) {
        let oData = formData[ditem.prop]
        if (ditem.$mod[modType].trim) {
          oData = _func.trimData(oData)
        }
        ditem.setDataByFormat(editData, ditem.getInterface('originProp', modType), oData, ditem.getInterface('type', modType), 'post', {
          targetData: editData,
          originData: formData,
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
