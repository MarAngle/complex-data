import $func from 'complex-func'
import LimitData, { LimitDataInitOption } from 'complex-func/src/build/LimitData'
import DefaultData, { DefaultDataInitOption } from './../data/DefaultData'
import DictionaryItem from './DictionaryItem'
import OptionData from './OptionData'
import LayoutData, { LayoutDataFormatData, LayoutDataInitOption } from './LayoutData'

const propList = ['id', 'parentId', 'children']


interface optionType {
  isChildren?: boolean,
  build?: LimitData | LimitDataInitOption,
  empty?: boolean,
  tree?: boolean
}

export interface DictionaryListInitOption extends DefaultDataInitOption {
  option: optionType
}

class DictionaryList extends DefaultData {
  $data: Map<string, DictionaryItem>
  $layout!: LayoutData
  constructor (initOption: DictionaryListInitOption) {
    super(initOption)
    this.$triggerCreateLife('DictionaryList', 'beforeCreate', initOption)
    this.$option = new OptionData({
      isChildren: false,
      build: $func.getLimitData(),
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
    this.$data = new Map<string, DictionaryItem>()
    this.$initOption(initOption.option)
    this.$initDictionaryItem(initOption)
    this.$triggerCreateLife('DictionaryList', 'created', initOption)
  }
  $initOption (option: optionType = {}) {
    let prop:keyof optionType
    for (prop in option) {
      const data = option[prop]
      if (prop != 'build') {
        (this.$option as any).setData(prop, data)
      } else {
        (this.$option as any).setData(prop, $func.getLimitData(data as LimitDataInitOption, 'allow'), 'init')
      }
    }
  }
  /**
   * 设置LayoutData
   * @param {object} data LayoutData参数
   */
  $setLayout (data?: LayoutData | LayoutDataInitOption) {
    this.$layout = new LayoutData(data)
  }
  /**
   * 获取布局数据
   * @param {string} [prop] 属性
   * @returns {object | LayoutData}
   */
  $getLayout (): LayoutData
  $getLayout (prop: string): LayoutDataFormatData
  $getLayout (prop?: string) {
    if (prop) {
      return this.$layout.getData(prop)
    } else {
      return this.$layout
    }
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
   * 分析传参
   * @param {object} initOption 传参
   * @returns {object}
   */
  $parseInitOption (initOption: DictionaryListInitOption) {
    return initOption
  }
  /**
   * 生成字典列表
   * @param {*} initOption 列表传参
   * @param {object} [payload] 设置项
   */
  $initDictionaryItem (initOption?: DictionaryListInitOption, type = 'init') { // type init push replace
    // 触发update生命周期
    this.triggerLife('beforeUpdate', this, initOption, type)
    if (type == 'init') {
      this.$data.clear()
    }
    if (initOption) {
      initOption = this.$parseInitOption(initOption)
      const parentData = this.getParent()
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
          this.$data.set(ditem.prop, ditem)
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
}

DictionaryList.$name = 'DictionaryList'

export default DictionaryList
