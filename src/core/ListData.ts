import { formatOption } from '../mod/DictionaryList'
import { formatInitOption } from '../utils'
import BaseData, { BaseDataInitOption } from './../data/BaseData'

export interface ListDataInitOption<DATA> extends BaseDataInitOption {
  data?: {
    list?: DATA[],
    [prop: PropertyKey]: any
  }
}



class ListData<DATA extends object> extends BaseData {
  constructor (initOption: ListDataInitOption<DATA>) {
    initOption = formatInitOption(initOption, {
      data: {
        list: []
      },
      module: {
        status: true,
        promise: true,
        dictionary: true
      }
    })
    super(initOption)
    this.$triggerCreateLife('ListData', 'beforeCreate', initOption)
    this.$initListDataLife()
    this.$triggerCreateLife('ListData', 'created')
  }
  /**
   * 加载生命周期函数
   */
   $initListDataLife() {
    // 添加重载开始生命周期回调，此时通过设置项对分页器和选项进行操作
    this.$onLife('beforeReset', {
      id: 'AutoListDataBeforeReset',
      data: (instantiater, resetOption) => {
        if (this.$parseResetOption(resetOption, 'data') !== false) {
          if (this.$parseResetOption(resetOption, 'data.list') !== false) {
            this.$resetArray(this.$data.list)
          }
        }
      }
    })
  }
  /**
   * 格式化列表数据
   * @param {object[]} datalist 源数据列表
   * @param {number} [totalnum] 总数
   * @param {string} [originFrom] originFrom
   * @param {object} [option] 参数
   */
  $formatData (datalist: DATA[] = [], totalnum?: number, originFrom?: string, option?: formatOption) {
    this.$formatListData(this.$data.list!, datalist, originFrom, option)
    if (totalnum || totalnum === 0) {
      this.$setPageData(totalnum, 'num')
    }
    this.$syncData('formatData')
  }
  // --数据相关--*/
  /**
   * 获取列表数据对象
   * @param {object} data index值
   * @param {'index' | 'id'} [type] 方法
   * @returns {object}
   */
  $getItem (data: number | any, type:'index' | 'id' = 'index') {
    if (type == 'index') {
      return this.$data.list![data]
    } else if (type == 'id') {
      const prop = this.$getDictionaryPropData('prop', 'id')
      for (let i = 0; i < this.$data.list!.length; i++) {
        const item = this.$data.list![i];
        if ((item as any)[prop] == data) {
          return item
        }
      }
    }
  }
  /**
   * 获取对象的index值
   * @param {object} data 列表数据
   * @returns {number}
   */
  $getIndex (data: DATA) {
    return this.$data.list!.indexOf(data)
  }
}

ListData.$name = 'ListData'

export default ListData
