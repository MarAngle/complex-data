import _func from 'complex-func'
import SimpleData from './../data/SimpleData'
import OptionData from './OptionData'
import DictionaryItem from './DictionaryItem'

class DictionaryList extends SimpleData {
  constructor (initOption) {
    super()
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
      this.initDictionaryData(initOption.data)
    }
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
   * 生成字典列表
   * @param {*[]} dictionaryListOption 列表传参
   * @param {object} [payload] 设置项
   */
  initDictionaryData (dictionaryListOption, type = 'init') { // type init push replace
    if (type == 'init') {
      this.data.clear()
    }
    if (dictionaryListOption) {
      for (let n in dictionaryListOption) {
        let ditemOption = dictionaryListOption[n]
        let ditem = this.getItem(ditemOption.prop)
        let act = {
          build: true, // 自身数据构建判断值
          children: true // 子数据构建判断值
        }
        // 无对应值，直接添加，存在值则根据模式判断
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
        }
        if (act.build) {
          // 构建字典数据
          ditemOption.parent = this
          ditem = new DictionaryItem(ditemOption, {})
          this.data.set(ditem.prop, ditem)
        }
        if (act.children) {
          // 构建子字典列表
          this.initDictionaryItemChildren(ditem, ditemOption)
        }
      }
      this.initPropData(dictionaryListOption)
    }
  }
  /**
   * 解析字典初始化数据,获取子字典创建模式
   * @param {DictionaryData} ditem 对应字典实例
   * @param {object} originOption 字典初始化数据
   * @returns {'' | 'self' | 'build'}
   */
  parseChildrenBuildType (ditem, ditemOption) {
    let initOption = ditemOption.dictionary
    let type = ''
    if (this.$option.getData('tree') && (this.getPropData('prop', 'children') == ditem.prop) && initOption === undefined) {
      initOption = 'self'
    }
    if (initOption == 'self') {
      type = 'self'
      if (ditemOption.type === undefined) {
        ditem.setInterface('type', 'default', 'array')
      }
    } else if (initOption) {
      type = 'build'
    }
    return type
  }
  /**
   * 创建字典的子字典列表
   * @param {DictionaryData} ditem 对应字典实例
   * @param {object} ditemOption 字典初始化数据
   * @param {boolean} isChildren 是否子类
   */
  initDictionaryItemChildren (ditem, ditemOption, isChildren = true) {
    let type = this.parseChildrenBuildType(ditem, ditemOption)
    if (type == 'build') {
      let initOption = ditemOption.dictionary
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
      ditem.$dictionary = new DictionaryList(initOption, {
        layout: this.getLayout()
      })
    } else if (type == 'self') {
      ditem.$dictionary = this
    }
  }
  /**
   * 获取列表MAP
   * @returns {Map<DictionaryData>}
   */
  getData () {
    return this.data
  }
  /**
   * 获取字典对象
   * @param {*} data 值
   * @param {[string]} prop 判断的属性
   * @returns {DictionaryData}
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
}

DictionaryList.$name = 'DictionaryList'

export default DictionaryList
