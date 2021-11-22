import _func from 'complex-func'
import SimpleData from './../data/SimpleData'
import InterfaceData from './InterfaceData'
// import LayoutData from './LayoutData'

class DictionaryItem extends SimpleData {
  constructor (initOption, payload = {}) {
    if (!initOption) {
      console.error(new Error('DictionaryData初始化参数不存在！'))
      return null
    }
    super(initOption)
    this.$mod = {}
    let originFromType = _func.getType(initOption.originFrom)
    if (originFromType === 'array') {
      this.originFrom = initOption.originFrom
    } else if (initOption.originFrom && originFromType === 'string') {
      this.originFrom = [initOption.originFrom]
    } else {
      this.originFrom = ['list']
    }
    this.prop = this.$prop
    // 加载接口数据
    this.$interface = {}
    this.$interface.label = new InterfaceData(initOption.label || this.$name)
    this.$interface.order = new InterfaceData(initOption.order)
    this.$interface.showProp = new InterfaceData(initOption.showProp)
    this.$interface.showType = new InterfaceData(initOption.showType)
    // prop/originProp
    this.$interface.originProp = new InterfaceData(initOption.originProp || this.prop)
    // --- 不存在prop时默认以originProp为主，此时以默认为基准=>prop为单一字段
    if (!this.prop) {
      this.prop = this.getInterface('originProp')
    }
    // 数据格式判断，暂时判断为存在showProp则自动设置为object，暂时不考虑存在showProp{ prop: '' }情况下对应prop的情况
    let dataType = initOption.type
    if (!dataType && initOption.showProp) {
      dataType = 'object'
    }
    this.$interface.type = new InterfaceData(dataType || 'string')
    this.$interface.modType = new InterfaceData('list')
    // this.setLayout(initOption.layout, payload.layout)
    this.formatFunc()
  }
  /**
   * 格式化func函数
   */
  formatFunc () {
    if (this.$func.defaultGetData === undefined) {
      this.$func.defaultGetData = (data, { type }) => {
        let showProp = this.getInterface('showProp', type)
        if (showProp) {
          if (data && _func.getType(data) == 'object') {
            return _func.getProp(data, showProp)
          } else {
            return undefined
          }
        } else {
          return data
        }
      }
    }
    // 展示
    if (this.$func.show === undefined) {
      this.$func.show = this.$func.defaultGetData
    }
    // 编辑
    if (this.$func.edit === undefined) {
      this.$func.edit = this.$func.defaultGetData
    }
    // 编辑获取
    if (this.$func.post === undefined) {
      this.$func.post = (data, payload) => {
        let mod = this.getMod(payload.type)
        if (mod && mod.$func && mod.$func.post) {
          return mod.$func.post(data, payload)
        } else {
          return data
        }
      }
    }
    // 检查是否存在
    if (this.$func.check === undefined) {
      this.$func.check = (data, payload) => {
        return _func.isExist(data)
      }
    }
  }
  /**
   * 获取接口数据对象
   * @param {string} target 对应的接口名称
   * @returns {InterfaceData}
   */
  getInterfaceData (target) {
    return this.$interface[target]
  }
  /**
   * 获取接口prop数据，不存在对应属性或值则获取默认值
   * @param {string} target 对应的接口名称
   * @param {string} [prop] 属性值
   * @returns {*}
   */
  getInterface (target, prop) {
    return this.$interface[target].getData(prop)
  }
  /**
   * 设置接口数据
   * @param {string} target 对应的接口名称
   * @param {string} prop 属性
   * @param {*} data 值
   */
  setInterface (target, prop, data) {
    this.$interface[target].setData(prop, data)
  }
  /**
   * 判断是否存在来源
   * @param {string} originFromType 来源
   * @returns {boolean}
   */
  isOriginFrom (originFromType) {
    return this.originFrom.indexOf(originFromType) > -1
  }
  /**
   * 获取模块
   * @param {string} mod 模块
   * @returns {boolean}
   */
  getMod (modType) {
    return this.$mod[modType]
  }
  /**
   * 触发可能存在的func函数
   * @param {string} funcName 函数名
   * @param {*} originData 数据
   * @param {object} payload 参数
   * @returns {*}
   */
  triggerFunc (funcName, originData, payload) {
    let itemFunc = this.$func[funcName]
    if (itemFunc) {
      return itemFunc(originData, payload)
    } else {
      return originData
    }
  }
}

DictionaryItem.$name = 'DictionaryItem'

export default DictionaryItem
