import $func from 'complex-func'
import LimitData, { LimitDataInitOption } from 'complex-func/src/build/LimitData'
import DefaultData, { DefaultDataInitOption } from './../data/DefaultData'
import DictionaryItem from './DictionaryItem'
import OptionData from './OptionData'
import LayoutData, { LayoutDataFormatData, LayoutDataInitOption } from './LayoutData'
import BaseData from '../data/BaseData'

// const propList = ['id', 'parentId', 'children']


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
  $option: OptionData
  $propData: any
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
    // this.$initDictionaryItem(initOption)
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
  install (target: BaseData) {
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
  uninstall (target: BaseData) {
    // 停止监听事件
    this.$offLife('updated', target.$getId('dictionaryUpdated'))
  }
}

DictionaryList.$name = 'DictionaryList'

export default DictionaryList
