import $func from 'complex-func'
import LimitData, { LimitDataInitOption } from 'complex-func/src/build/LimitData'
import DefaultData, { DefaultDataInitOption } from './../data/DefaultData'
import DictionaryItem, { DictionaryItemInitOption } from './DictionaryItem'
import OptionData from './OptionData'
import LayoutData, { LayoutDataFormatData, LayoutDataInitOption } from './LayoutData'
import BaseData from '../data/BaseData'
import Data from '../data/Data'
import { objectAny } from '../../ts'

// const propList = ['id', 'parentId', 'children']


type formatOptionBuild = LimitDataInitOption | LimitData

interface formatOption {
  clear?: boolean,
  build?: formatOptionBuild
}

interface optionType {
  isChildren?: boolean,
  build?: LimitData | LimitDataInitOption,
  empty?: boolean,
  tree?: boolean
}

type propDataItemType = {
  prop: string,
  data: any
}

type propDataType<T> = {
  id: T,
  parentId: T,
  children: T
}

export interface DictionaryListInitOption extends DefaultDataInitOption {
  option: optionType,
  layout?: LayoutDataInitOption,
  propData?: propDataType<string | propDataItemType>,
  list: DictionaryItemInitOption[]
}

class DictionaryList extends DefaultData {
  $data: Map<string, DictionaryItem>
  $layout!: LayoutData
  $option: OptionData
  $propData: propDataType<propDataItemType>
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
    this.$setLayout(initOption.layout)
    this.$initDictionaryList(initOption.list)
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

  $initDictionaryList(initOptionList: DictionaryItemInitOption[], type = 'replace') {
    // 触发update生命周期
    this.$triggerLife('beforeUpdate', this, initOptionList, type)
    if (type == 'init') {
      this.$data.clear()
    }
    const parentData = this.$getParent()
    const isChildren = this.$option.getData('isChildren') as boolean
    for (const n in initOptionList) {
      const ditemOption = initOptionList[n]
      // 判断是否为一级，不为一级需要将一级的默认属性添加
      this.$parseOptionFromParent(ditemOption, parentData, isChildren)
      let ditem = this.$getItem(ditemOption.prop)
      const act = {
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
      }
      // 无对应值，直接添加
      if (act.build) {
        // 构建字典数据
        ditemOption.parent = this
        ditem = new DictionaryItem(ditemOption, {
          layout: this.$getLayout()
        })
        this.$data.set(ditem.prop, ditem)
      }
      if (act.children) {
        // 构建子字典列表
        this.$initDictionaryItemChildren(ditem!, ditemOption)
      }
    }
  }
  /**
   * 加载默认初始值.子类自动按照父类来源设置
   * @param {object} optiondata DictionaryItem初始化参数
   * @param {*} parentData 父元素
   * @param {*} isChildren 是否是子类
   */
  $parseOptionFromParent (optiondata: DictionaryItemInitOption, parentData?: Data, isChildren?: boolean) {
    if (isChildren && !optiondata.originFrom && parentData && (parentData as DictionaryItem).originFrom) {
      optiondata.originFrom = (parentData as DictionaryItem).originFrom
    }
  }
  /**
   * 解析字典初始化数据,获取子字典创建模式
   * @param {DictionaryItem} ditem 对应字典实例
   * @param {object} originOption 字典初始化数据
   * @returns {'' | 'self' | 'build'}
   */
  $parseChildrenBuildType (ditem: DictionaryItem, originOption: DictionaryItemInitOption) {
    let initOption:DictionaryListInitOption | string | undefined = originOption.dictionary
    let type: '' | 'self' | 'build' = ''
    if (this.$option.getData('tree') && (this.$getPropData('prop', 'children') == ditem.prop) && initOption === undefined) {
      initOption = 'self'
    }
    if (initOption == 'self') {
      type = 'self'
      if (originOption.type === undefined) {
        ditem.$setInterface('type', 'default', 'array')
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
  $initDictionaryItemChildren (ditem: DictionaryItem, originOption: DictionaryItemInitOption, isChildren = true) {
    const type = this.$parseChildrenBuildType(ditem, originOption)
    if (type == 'build') {
      const initOption = originOption.dictionary as DictionaryListInitOption
      if (!initOption.option) {
        initOption.option = {}
      }
      if (initOption.option.isChildren === undefined) {
        initOption.option.isChildren = isChildren
      }
      // 默认加载本级的build设置
      if (!initOption.option.build) {
        initOption.option.build = this.$option.getData('build') as LimitData
      }
      initOption.parent = ditem
      if (!initOption.layout) {
        initOption.layout = this.$getLayout()
      }
      ditem.$dictionary = new DictionaryList(initOption)
    } else if (type == 'self') {
      ditem.$dictionary = this
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
   formatListData (targetList: objectAny[], originList: objectAny[], originFrom = 'list', option:formatOption = {}, formatPrototype = true, depth?: number) {
    if (option.clear === undefined || option.clear) {
      $func.clearArray(targetList)
    }
    for (const n in originList) {
      const item = this.buildData(originList[n], originFrom, option.build, formatPrototype, depth)
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
  buildData(originData:objectAny, originFrom = 'list', option?: formatOptionBuild, formatPrototype?: boolean, depth?: number) {
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
  updateData(targetData: objectAny, originData: formatOptionBuild, originFrom = 'info', option?: formatOptionBuild, formatPrototype?: boolean, depth?: number) {
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
  formatData(targetData: objectAny, originData: formatOptionBuild, originFrom?: string, option?: formatOptionBuild, formatPrototype?: boolean, depth?: number) {
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
      option = this.$option.getData('build') as LimitData
    }
    if (!(option as any).getLimit) {
      option = $func.getLimitData(option)
    }
    if (depth === undefined) {
      depth = 0
    }
    return this.$formatDataStart(targetData, originData, originFrom, option as LimitData, !!formatPrototype, depth)
  }
  $formatPrototype(targetData: objectAny, depth: number) {
    const currentPrototype = Object.create(Object.getPrototypeOf(targetData))
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
  $formatDataStart(targetData: objectAny, originData: objectAny, originFrom: string, option: LimitData, formatPrototype: boolean, depth = 0) {
    for (const ditem of this.$data.values()) {
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
  $formatDataNext(ditem: DictionaryItem, targetData: objectAny, originData: objectAny, originFrom: string, option: LimitData, formatPrototype: boolean, depth: number) {
    let build = false
    if (ditem.$isOriginFrom(originFrom)) {
      build = true
    } else if (option.getLimit(originFrom)) {
      build = false
    }
    if (build) {
      const type = ditem.$getInterface('type', originFrom) as string
      const originProp = ditem.$getInterface('originProp', originFrom) as string
      let oData = $func.getProp(originData, originProp)
      if (ditem.$dictionary) {
        depth++
        if (type != 'array') {
          if ($func.getType(oData) == 'object') {
            oData = ditem.$dictionary.$formatDataStart({}, oData, originFrom, option, formatPrototype, depth)
          } else {
            oData = {}
          }
        } else {
          if ($func.getType(oData) == 'array') {
            const oList = []
            for (let i = 0; i < oData.length; i++) {
              const oItem = ditem.$dictionary.$formatDataStart({}, oData[i], originFrom, option, formatPrototype, depth)
              oList.push(oItem)
            }
            oData = oList
          } else {
            oData = []
          }
        }
      }
      ditem.$formatData(targetData, ditem.prop, oData, type, 'format', {
        targetData: targetData,
        originData: originData,
        depth: depth,
        type: originFrom
      })
    }
  }



  /**
   * 获取字典对象
   * @param {*} data 值
   * @param {string} [prop] 判断的属性
   * @returns {DictionaryItem}
   */
  $getItem (data: string): undefined | DictionaryItem
  $getItem (data: any, prop: string): undefined | DictionaryItem
  $getItem (data: string | any, prop?: string) {
    if (!prop) {
      return this.$data.get(data)
    } else {
      for (const ditem of this.$data.values()) {
        if ((ditem as any)[prop] == data) {
          return ditem
        }
      }
    }
  }
  /**
   * 设置字典值
   * @param {*} data 值
   * @param {'data' | 'prop'} [target = 'data'] 目标属性
   * @param {'id' | 'parentId' | 'children'} [prop = 'id'] 目标
   */
  $setPropData (data: any, target:'data' | 'prop' = 'data', prop: 'id' | 'parentId' | 'children' = 'id') {
    this.$propData[prop][target] = data
  }
  /**
   * 获取字典值
   * @param {'data' | 'prop'} [target = 'data'] 目标属性
   * @param {'id' | 'parentId' | 'children'} [prop = 'id'] 目标
   * @returns {*}
   */
  $getPropData (target:'data' | 'prop' = 'data', prop: 'id' | 'parentId' | 'children' = 'id') {
    return this.$propData[prop][target]
  }
  /**
   * 设置LayoutData
   * @param {object} data LayoutData参数
   */
  $setLayout (data?: LayoutDataInitOption) {
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
   * 模块加载
   * @param {object} target 加载到的目标
   */
  $install (target: BaseData) {
    // 监听事件
    this.$onLife('updated', {
      id: target.$getId('dictionaryUpdated'),
      data: (...args) => {
        target.$triggerLife('dictionaryUpdated', ...args)
      }
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
   $uninstall (target: BaseData) {
    // 停止监听事件
    this.$offLife('updated', target.$getId('dictionaryUpdated'))
  }
}

DictionaryList.$name = 'DictionaryList'

export default DictionaryList
