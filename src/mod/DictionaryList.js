import _func from 'complex-func'
import DefaultData from './../data/DefaultData'
import DictionaryData from './DictionaryData'
import OptionData from './OptionData'
import LayoutData from './LayoutData'

class DictionaryList extends DefaultData {
  constructor (initdata, payload = {}) {
    super(initdata)
    this.triggerCreateLife('DictionaryList', 'beforeCreate', initdata, payload)
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
    if (initdata) {
      this.initMain(initdata, payload)
    }
    this.triggerCreateLife('DictionaryList', 'beforeCreate', initdata)
  }
  initMain (initdata, payload = {}) {
    payload.type = payload.type || 'init'
    this.initOption(initdata.option)
    this.initDictionaryData(initdata, payload)
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
   * @param {object} optiondata DictionaryData初始化参数
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
   * @param {object} initdata 传参
   * @returns {object}
   */
  parseInitData (initdata) {
    return initdata
  }
  /**
   * 生成字典列表
   * @param {*} initdata 列表传参
   * @param {object} [payload] 设置项
   */
  initDictionaryData (initdata, payload = {}) { // type init push replace
    if (payload.type == 'init') {
      this.data.clear()
    }
    if (initdata) {
      initdata = this.parseInitData(initdata)
      // 触发update生命周期
      this.triggerLife('beforeUpdate', this, initdata, payload)
      this.setParent(initdata.parent)
      this.setLayout(initdata.layout)
      let isChildren = this.option.getData('isChildren')
      for (let n in initdata.list) {
        let ditemOption = initdata.list[n]
        // 判断是否为一级，不为一级需要将一级的默认属性添加
        this.parseOptionFromParent(ditemOption, initdata.parent, isChildren)
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
            this.printMsg(`字典列表加载:${ditemOption.prop}重复!`)
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
          ditem = new DictionaryData(ditemOption, {
            layout: this.getLayout()
          })
          this.data.set(ditem.prop, ditem)
        }
        if (act.children) {
          // 构建子字典列表
          this.buildItemDictionary(ditem, ditemOption)
        }
      }
      this.initPropData(initdata)
    }
    // 触发update生命周期
    this.triggerLife('updated', {
      type: payload.type
    })
  }
  /**
   * 加载propData数据
   * @param {object} [initdata] 设置项
   */
  initPropData (initdata = {}) {
    let list = ['id', 'parentId', 'children']
    for (let n in list) {
      let prop = list[n]
      let data = initdata[prop]
      if (data) {
        let type = _func.getType(data)
        if (type == 'object') {
          this.propData[prop] = data
        } else if (type == 'string' || type == 'number') {
          this.propData[prop].prop = data
        } else {
          this.printMsg(`字典列表propdata:${prop}属性格式未预期:${type}，请检查数据!`)
        }
      }
    }
  }
  /**
   * 解析字典初始化数据,获取子字典创建模式
   * @param {DictionaryData} ditem 对应字典实例
   * @param {object} originOption 字典初始化数据
   * @returns {'' | 'self' | 'build'}
   */
  parseBuildData (ditem, originOption) {
    let initdata = originOption.dictionary
    let type = ''
    if (this.option.getData('tree') && (this.getPropData('prop', 'children') == ditem.prop) && initdata === undefined) {
      initdata = 'self'
    }
    if (initdata == 'self') {
      type = 'self'
      if (originOption.type === undefined) {
        ditem.setInterface('type', 'default', 'array')
      }
    } else if (initdata) {
      type = 'build'
    }
    return type
  }
  /**
   * 创建字典的子字典列表
   * @param {DictionaryData} ditem 对应字典实例
   * @param {object} originOption 字典初始化数据
   * @param {boolean} isChildren 是否子类
   */
  buildItemDictionary (ditem, originOption, isChildren = true) {
    let type = this.parseBuildData(ditem, originOption)
    if (type == 'build') {
      let initdata = this.parseInitData(originOption.dictionary)
      if (!initdata.option) {
        initdata.option = {}
      }
      if (initdata.option.isChildren === undefined) {
        initdata.option.isChildren = isChildren
      }
      // 默认加载本级的build设置
      if (!initdata.option.build) {
        initdata.option.build = this.getBuildOption()
      }
      initdata.parent = ditem
      ditem.dictionary = new DictionaryList(initdata, {
        layout: this.getLayout()
      })
    } else if (type == 'self') {
      ditem.dictionary = this
    }
  }
  // 重新创建字典列表
  rebuildData (initdata, payload = {}) {
    payload.type = payload.type || 'replace'
    this.initDictionaryData(initdata, payload)
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
   * @returns {Map<DictionaryData>}
   */
  getList () {
    return this.data
  }

  /**
   * 获取字典对象
   * @param {*} data 值
   * @param {'prop' | 'id'} from 获取类型
   * @returns {DictionaryData}
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
   * @param {string} [type] 来源originfrom
   * @param {object} [option] 设置项
   * @param {number} [depth] 深度
   * @returns {object}
   */
  formatItem (originitem, type = 'list', option, depth) {
    let targetitem = {}
    this.updateItem(targetitem, originitem, type, option, depth)
    return targetitem
  }
  /**
   * 根据源数据更新数据
   * @param {object} targetitem 目标数据
   * @param {object} originitem 源数据
   * @param {string} [type] 来源originfrom
   * @param {object} [option] 设置项
   * @param {number} [depth] 深度
   * @returns {object}
   */
  updateItem (targetitem, originitem, type = 'info', option, depth) {
    this.formatData(targetitem, originitem, type, option, depth)
    return targetitem
  }
  /**
   * 格式化列表数据
   * @param {object[]} targetlist 目标列表
   * @param {object[]} originlist 源数据列表
   * @param {string} [type] 来源originfrom
   * @param {object} [option] 设置项
   * @param {number} [depth] 深度
   */
  formatListData (targetlist, originlist, type = 'list', option = {}, depth) {
    if (option.clearType === undefined || option.clearType) {
      _func.clearArray(targetlist)
    }
    for (let n in originlist) {
      let item = this.formatItem(originlist[n], type, option.build, depth)
      targetlist.push(item)
    }
  }
  /**
   * 格式化列表数据为treeList
   * @param {object[]} targetlist 目标列表treeList
   * @param {object[]} originlist 源数据列表
   * @param {string} [type] 来源originfrom
   * @param {object} [option] 设置项
   */
  formatTreeData (targetlist, originlist, type = 'list', option = {}) {
    if (option.clearType === undefined || option.clearType) {
      _func.clearArray(targetlist)
    }
    for (let n in originlist) {
      let item = this.formatItem(originlist[n], type, option.build)
      targetlist.push(item)
    }
  }

  /**
   * 根据字典格式化数据
   * @param {object} targetitem 目标数据
   * @param {object} originitem 源数据
   * @param {string} type 来源originfrom
   * @param {object} [option] 设置项
   * @param {number} [depth] 深度
   * @returns {object}
   */
  formatData (targetitem, originitem = {}, type, option, depth) {
    if (!option) {
      option = this.getBuildOption()
    }
    if (!option.getLimit) {
      option = _func.getLimitData(option)
    }
    for (let ditem of this.data.values()) {
      this.formatDataNext(ditem, targetitem, originitem, type, option, depth)
    }
    return targetitem
  }
  /**
   * 格式化数据
   * @param {DictionaryData} ditem 字典
   * @param {object} targetitem 目标数据
   * @param {object} originitem 源数据
   * @param {string} type 来源originfrom
   * @param {object} [option] 设置项
   * @param {number} [depth] 深度
   */
  formatDataNext (ditem, targetitem, originitem, type, option, depth = 0) {
    let build = false
    let isOther = false
    if (!option) {
      option = this.getBuildOption()
    }
    if (!option.getLimit) {
      option = _func.getLimitData(option)
    }
    if (ditem.isOrigin(type)) {
      // 当前字典存在对应模块直接按照build模式进行
      build = true
    } else if (option.getLimit(type)) {
      // 理论上设置为允许值可在此时构建出对应字段，通过vue.set进行赋值，解决数据不能双向绑定和提前构建对象结构，双向绑定问题通过vue.set解决，对象结构暂不考虑，因此此处暂时不做处理
      build = false
      isOther = false
    }
    if (build) {
      let targettype = ditem.getInterface('type', type)
      if (!isOther) {
        let originprop = ditem.getInterface('originprop', type)
        let origindata = _func.getProp(originitem, originprop)
        let targetdata
        if (ditem.dictionary) {
          depth++
          if (targettype == 'array') {
            if (origindata && origindata.length > 0) {
              targetdata = []
              this.formatListData(targetdata, origindata, type, { build: option }, depth)
              origindata = targetdata
            } else {
              origindata = []
            }
          } else {
            origindata = ditem.dictionary.formatData({}, origindata, type, option, depth)
          }
        }
        targetdata = ditem.formatOrigin(origindata, {
          targetitem: targetitem,
          originitem: originitem,
          depth: depth,
          type: type
        })
        _func.setPropByType(targetitem, ditem.prop, targetdata, ditem.getInterface('type', type), true)
      } else {
        if (targetitem[ditem.prop] === undefined) {
          let targetdata
          if (ditem.dictionary) {
            depth++
            if (targettype == 'array') {
              targetdata = []
            } else {
              targetdata = ditem.dictionary.formatData({}, {}, type, option, depth)
            }
          } else {
            if (targettype == 'object') {
              targetdata = {}
            } else if (targettype == 'array') {
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
   * @returns {DictionaryData[]}
   */
  getModList (mod) {
    return this.getModListNext([], this.data, mod)
  }
  /**
   * 从dataMap获取符合模块要求的字典列表
   * @param {DictionaryData[]} modList 返回的字典列表
   * @param {Map<DictionaryData>} dataMap 字典Map
   * @param {string} mod 模块名称
   * @returns {DictionaryData[]}
   */
  getModListNext (modList, dataMap, mod) {
    for (let ditem of dataMap.values()) {
      let fg = ditem.isMod(mod)
      if (fg) {
        modList.push(ditem)
      }
    }
    return modList
  }
  /**
   * 获取符合模块要求的字典page列表
   * @param {string} mod 模块名称
   * @param {object} [payload] 参数
   * @returns {*[]}
   */
  getPageList (mod, payload) {
    let modList = this.getModList(mod)
    return this.getPageListByModList(mod, modList, payload)
  }
  /**
   * 将模块列表根据payload转换为页面需要数据的列表
   * @param {string} mod 模块名称
   * @param {DictionaryData[]} modlist 模块列表
   * @param {object} [payload] 参数
   * @returns {*[]}
   */
  getPageListByModList (mod, modlist, payload = {}) {
    let pagelist = []
    for (let n in modlist) {
      let ditem = modlist[n]
      let pitem = ditem.getModData(mod, payload)
      pagelist.push(pitem)
    }
    return pagelist
  }
  /**
   * 根据模块列表生成对应的form对象
   * @param {DictionaryData[]} modlist 模块列表
   * @param {string} mod 模块名称
   * @param {*} originitem 初始化数据
   * @returns {object}
   */
  getFormData(modlist, mod, originitem) {
    let formData = {}
    for (let n in modlist) {
      let ditem = modlist[n]
      let target = ditem.getFormData(mod, {
        targetItem: formData,
        originitem: originitem
      })
      _func.setProp(formData, ditem.prop, target, true)
    }
    return formData
  }
  /**
   * 基于formdata和模块列表返回编辑完成的数据
   * @param {object} formData form数据
   * @param {DictionaryData[]} modlist 模块列表
   * @param {string} type modtype
   * @returns {object}
   */
  getEditData(formData, modlist, type) {
    let editData = {}
    for (let n in modlist) {
      let ditem = modlist[n]
      let add = true
      if (!ditem.mod[type].required) {
        /*
          存在check则进行check判断
          此时赋值存在2种情况
          1.不存在check 返回data ,data为真则赋值
          2.存在check,返回check函数返回值，为真则赋值
        */
        add = ditem.triggerFunc('check', formData[ditem.prop], {
          targetitem: editData,
          originitem: formData,
          type: type
        })
        // empty状态下传递数据 或者 checkFg为真时传递数据 也就是非post状态的非真数据不传递
        if (!add) {
          add = this.option.getData('edit.empty')
        }
      }
      if (add) {
        let targetdata = formData[ditem.prop]
        if (ditem.mod[type].trim) {
          targetdata = _func.trimData(targetdata)
        }
        targetdata = ditem.triggerFunc('unedit', targetdata, {
          targetitem: editData,
          originitem: formData,
          type: type
        })
        let originprop = ditem.getInterface('originprop', type)
        _func.setPropByType(editData, originprop, targetdata, ditem.type)
      }
    }
    return editData
  }
  /**
   * 模块加载
   * @param {object} target 加载到的目标
   */
  install (target) {
    this.onLife('updated', {
      id: target.$getModuleId('dictionaryListUpdated'),
      data: (...args) => {
        target.triggerLife('dictionaryListUpdated', ...args)
      }
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
  uninstall (target) {
    this.offLife('updated', target.$getModuleId('dictionaryListUpdated'))
  }
}

export default DictionaryList
