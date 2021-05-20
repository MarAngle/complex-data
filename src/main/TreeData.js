import _func from 'complex-func'
import ListData from './ListData'

class TreeData extends ListData {
  constructor (initdata) {
    if (!initdata) {
      initdata = {}
    }
    super(initdata)
    this.triggerCreateLife('TreeData', 'beforeCreate', initdata)
    this.triggerCreateLife('TreeData', 'created')
  }
  parseDictionaryData(dictionaryData) {
    if (dictionaryData) {
      if (!dictionaryData.option) {
        dictionaryData.option = {}
      }
      if (dictionaryData.option.tree === undefined) {
        dictionaryData.option.tree = true
      }
    }
    return dictionaryData
  }
  // --数据相关--*/
  // 获取对象
  getItem(data, prop, childProp) {
    if (!prop) {
      prop = this.getDictionaryPropData('prop', 'id')
    }
    if (!childProp) {
      childProp = this.getDictionaryPropData('prop', 'children')
    }
    return this.getItemNext(this.data.list, data, prop, childProp)
  }
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
    return false
  }
}

export default TreeData
