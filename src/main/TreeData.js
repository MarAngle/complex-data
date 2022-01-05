import _func from 'complex-func'
import ListData from './ListData'

class TreeData extends ListData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super(initOption)
    this.$triggerCreateLife('TreeData', 'beforeCreate', initOption)
    this.$triggerCreateLife('TreeData', 'created')
  }
  /**
   * 解析dictionaryOption初始化数据
   * @param {object} dictionaryOption dictionaryOption初始化数据
   * @returns {object}
   */
   parseDictionaryOption(dictionaryOption) {
    if (dictionaryOption) {
      if (!dictionaryOption.option) {
        dictionaryOption.option = {}
      }
      if (dictionaryOption.option.tree === undefined) {
        dictionaryOption.option.tree = true
      }
    }
    return dictionaryOption
  }
  // --数据相关--*/
  /**
   * 获取对象
   * @param {*} data 属性值
   * @param {string} [prop] 属性，默认唯一识别符属性
   * @param {string} [childProp] 子列表属性
   * @returns {object}
   */
  getItem(data, prop, childProp) {
    if (!prop) {
      prop = this.getDictionaryPropData('prop', 'id')
    }
    if (!childProp) {
      childProp = this.getDictionaryPropData('prop', 'children')
    }
    return this.getItemNext(this.data.list, data, prop, childProp)
  }
  /**
   * 获取对象Next
   * @param {object[]} list 查找的列表
   * @param {*} data 属性值
   * @param {string} [prop] 属性，默认唯一识别符属性
   * @param {string} [childProp] 子列表属性
   * @returns {object}
   */
  getItemNext(list, data, prop, childProp) {
    if (!prop) {
      prop = this.getDictionaryPropData('prop', 'id')
    }
    if (!childProp) {
      childProp = this.getDictionaryPropData('prop', 'children')
    }
    for (let n in list) {
      let item = list[n]
      if (item[prop] == data) {
        return item
      } else if (item[childProp]) {
        let res = this.getItemNext(item[childProp], data, prop, childProp)
        if (res) {
          return res
        }
      }
    }
    return null
  }
}

TreeData.$name = 'TreeData'

export default TreeData
