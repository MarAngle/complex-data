import { getType, getProp, setProp, LimitData } from 'complex-utils'
import BaseData from '../data/BaseData';
import Data from '../data/Data';
import DefaultData, { DefaultDataInitOption } from "../data/DefaultData";
import { buildOptionData } from '../utils';
import DictionaryData, { DictionaryDataInitOption } from './DictionaryData';
import LayoutData, { HasLayoutData, LayoutDataInitOption } from './LayoutData';

type propDataItemType = {
  prop: string,
  data: any
}

type propDataType<T> = {
  id: T,
  parentId: T,
  children: T
}

type propDataKeys = keyof propDataType<propDataItemType>

export interface DictionaryListOption {
  isChildren?: boolean
  build?: LimitData
  empty?: boolean
  tree?: boolean
}

interface RequiredDictionaryListOption {
  isChildren: boolean
  build: LimitData
  empty: boolean
  tree: boolean
}

export interface DictionaryListInitOption extends DefaultDataInitOption {
  list?: DictionaryDataInitOption[]
  layout?: LayoutDataInitOption
  option?: DictionaryListOption
  propData?: propDataType<string | propDataItemType>
}

function initPropData(defaultProp: propDataKeys, propData?: propDataType<string | propDataItemType>): propDataItemType {
  if (propData) {
    const data = propData[defaultProp]
    if (data) {
      if (typeof data == 'string') {
        return {
          prop: data,
          data: undefined
        }
      } else {
        return data
      }
    }
  }
  return {
    prop: defaultProp,
    data: undefined
  }
}

class DictionaryList extends DefaultData implements HasLayoutData {
  static $name = 'DictionaryList'
  $data: Map<string, DictionaryData>
  $option: RequiredDictionaryListOption
  $propData: propDataType<propDataItemType>
  $layout!: LayoutData
  constructor(initOption: DictionaryListInitOption) {
    super(initOption)
    this.$triggerCreateLife('DictionaryList', 'beforeCreate', initOption)
    this.$option = buildOptionData<RequiredDictionaryListOption>({
      isChildren: false,
      build: new LimitData(),
      empty: false,
      tree: false
    }, initOption.option)

    this.$propData = {
      parentId: initPropData('parentId', initOption.propData),
      id: initPropData('id', initOption.propData),
      children: initPropData('children', initOption.propData)
    }
    this.$data = new Map<string, DictionaryData>()
    this.$setLayout(initOption.layout)
    this.$initDictionaryList(initOption.list, 'init')
    this.$triggerCreateLife('DictionaryList', 'created', initOption)
  }
  $setPropData(data: any, target: keyof propDataItemType = 'data', prop: propDataKeys = 'id') {
    this.$propData[prop][target] = data
  }
  $getPropData(target: keyof propDataItemType = 'data', prop: propDataKeys = 'id') {
    return this.$propData[prop][target]
  }
  $parseOptionFromParent(optiondata: DictionaryDataInitOption, parentData?: Data | DictionaryData, isChildren?: boolean) {
    if (isChildren && !optiondata.originFrom && parentData && (parentData as DictionaryData).originFrom) {
      optiondata.originFrom = (parentData as DictionaryData).originFrom
    }
  }
  // 重新创建字典列表
  rebuildData(initOption: DictionaryDataInitOption[], type = 'replace') {
    this.$initDictionaryList(initOption, type)
  }
  $initDictionaryList(initOptionList: DictionaryDataInitOption[] = [], type = 'replace') {
    // 触发update生命周期
    this.$triggerLife('beforeUpdate', this, initOptionList, type)
    if (type == 'init') {
      this.$data.clear()
    }
    const parentData = this.$getParent()
    const isChildren = this.$option.isChildren
    for (let n = 0; n < initOptionList.length; n++) {
      const ditemOption = initOptionList[n]
      // 判断是否为一级，不为一级需要将一级的默认属性添加
      this.$parseOptionFromParent(ditemOption, parentData, isChildren)
      let ditem = this.getItem(ditemOption.prop)
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
        ditem = new DictionaryData(ditemOption, {
          layout: this.$getLayoutData()
        })
        this.$data.set(ditem.prop, ditem)
      }
      if (act.children) {
        // 构建子字典列表
        this.$initDictionaryDataChildren(ditem!, ditemOption)
      }
    }
  }
  $parseChildrenBuildType(ditem: DictionaryData, originOption: DictionaryDataInitOption) {
    let initOption: DictionaryListInitOption | string | undefined = originOption.dictionary
    let type: undefined | 'self' | 'build'
    if (this.$option.tree && (this.$getPropData('prop', 'children') == ditem.prop) && initOption === undefined) {
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
  $initDictionaryDataChildren(ditem: DictionaryData, originOption: DictionaryDataInitOption, isChildren = true) {
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
        initOption.option.build = this.$option.build
      }
      initOption.parent = ditem
      if (!initOption.layout) {
        initOption.layout = this.$getLayoutData()
      }
      ditem.$dictionary = new DictionaryList(initOption)
    } else if (type == 'self') {
      ditem.$dictionary = this
    }
  }
  getItem(data: string) {
    return this.$data.get(data)
  }
  getItemByProp(prop: string, data: any) {
    for (const ditem of this.$data.values()) {
      if ((ditem as any)[prop] == data) {
        return ditem
      }
    }
  }
  $setLayout(data?: LayoutDataInitOption) {
    this.$layout = new LayoutData(data)
  }
  $getLayout(prop?: string) {
    return this.$layout.getData(prop)
  }
  $getLayoutData() {
    return this.$layout
  }
  $install(target: BaseData) {
    // 监听事件
    this.$onLife('updated', {
      id: target.$getId('dictionaryUpdated'),
      data: (...args) => {
        target.$triggerLife('dictionaryUpdated', ...args)
      }
    })
  }
  $uninstall(target: BaseData) {
    // 停止监听事件
    this.$offLife('updated', target.$getId('dictionaryUpdated'))
  }
}

export default DictionaryList
