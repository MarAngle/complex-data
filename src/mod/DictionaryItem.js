import _func from 'complex-func'
import complexOption from '../option'
import DefaultData from '../data/DefaultData'
import InterfaceData from './InterfaceData'
import LayoutData from './LayoutData'

class DictionaryItem extends DefaultData {
  constructor (initOption, payload = {}) {
    super(initOption)
    this.mod = {}
    let originfromType = _func.getType(initOption.originfrom)
    if (originfromType === 'array') {
      this.originfrom = initOption.originfrom
    } else if (initOption.originfrom && originfromType === 'string') {
      this.originfrom = [initOption.originfrom]
    } else {
      this.originfrom = ['list']
    }
    // 加载接口数据
    this.interface = {}
    this.interface.label = new InterfaceData(initOption.label || initOption.name)
    this.interface.order = new InterfaceData(initOption.order)
    this.interface.showprop = new InterfaceData(initOption.showprop)
    this.interface.showtype = new InterfaceData(initOption.showtype)
    // prop/originprop
    this.interface.originprop = new InterfaceData(initOption.originprop || this.prop)
    // --- 不存在prop时默认以originprop为主，此时以默认为基准=>prop为单一字段
    if (!this.prop) {
      this.prop = this.getInterface('originprop')
    }
    // 数据格式判断，暂时判断为存在showprop则自动设置为object，暂时不考虑存在showprop{ prop: '' }情况下对应prop的情况
    let dataType = initOption.type
    if (!dataType && initOption.showprop) {
      dataType = 'object'
    }
    this.interface.type = new InterfaceData(dataType || 'string')
    this.interface.modtype = new InterfaceData('list')
    this.setLayout(initOption.layout, payload.layout)
    complexOption.format(this, initOption.mod)
    this.FormatFunc()
  }
  // 获取moddata=>该数据为页面需要的数据格式,从外部定义
  getModData (modprop, payload = {}) {
    return complexOption.unformat(this, modprop, payload)
  }
  setLayout (layoutOption, parentLayoutOption) {
    let option = layoutOption || parentLayoutOption
    if (option && option.constructor === LayoutData) {
      this.layout = option
    } else {
      this.layout = new LayoutData(option)
    }
  }
  getLayout (prop) {
    if (prop) {
      return this.layout.getData(prop)
    } else {
      return this.layout
    }
  }
  /**
   * 获取接口数据对象
   * @param {string} target 对应的接口名称
   * @returns {InterfaceData}
   */
  getInterfaceData (target) {
    return this.interface[target]
  }
  /**
   * 获取接口prop数据，不存在对应属性或值则获取默认值
   * @param {string} target 对应的接口名称
   * @param {string} [prop] 属性值
   * @returns {*}
   */
  getInterface (target, prop) {
    return this.interface[target].getData(prop)
  }
  /**
   * 设置接口数据
   * @param {string} target 对应的接口名称
   * @param {string} prop 属性
   * @param {*} data 值
   */
  setInterface (target, prop, data) {
    this.interface[target].setData(prop, data)
  }
  /**
   * 格式化func函数
   */
  FormatFunc () {
    if (this.func.defaultGetData === undefined) {
      this.func.defaultGetData = (data, { type }) => {
        let showprop = this.getInterface('showprop', type)
        if (showprop) {
          if (data && _func.getType(data) == 'object') {
            return _func.getProp(data, showprop)
          } else {
            return undefined
          }
        } else {
          return data
        }
      }
    }
    if (this.func.show === undefined) {
      this.func.show = this.func.defaultGetData
    }
    if (this.func.edit === undefined) {
      this.func.edit = this.func.defaultGetData
    }
    if (this.func.unedit === undefined) {
      this.func.unedit = (data, payload) => {
        let moditem = this.mod[payload.type]
        if (moditem && moditem.func.unedit) {
          return moditem.func.unedit(data, payload)
        } else {
          return data
        }
      }
    }
    if (this.func.check === undefined) {
      this.func.check = (data, payload) => {
        return _func.isExist(data)
      }
    }
  }
  /**
   * 判断是否存在来源
   * @param {string} originfromType 来源
   * @returns {boolean}
   */
  isOrigin (originfromType) {
    return this.originfrom.indexOf(originfromType) > -1
  }
  /**
   * 判断是否存在模块
   * @param {string} mod 模块
   * @returns {boolean}
   */
  isMod (modType) {
    let fg = false
    if (this.mod[modType]) {
      fg = true
    }
    return fg
  }
  /**
   * 触发可能存在的func函数
   * @param {string} funcName 函数名
   * @param {*} originData 数据
   * @param {object} payload 参数
   * @returns {*}
   */
  triggerFunc (funcName, originData, payload) {
    let itemFunc = this.func[funcName]
    if (itemFunc) {
      return itemFunc(originData, payload)
    } else {
      return originData
    }
  }
  /**
   * 获取originprop
   * @param {string} prop prop值
   * @param {string} originfromType originfromType值
   * @returns {string}
   */
  getOriginProp (prop, originfromType) {
    if (this.prop == prop) {
      return this.getInterface('originprop', originfromType)
    } else {
      return false
    }
  }
  /**
   * 生成formData的prop值，基于自身从originitem中获取对应属性的数据并返回
   * @param {string} modType modtype
   * @param {object} option 参数
   * @param {object} option.targetitem 目标数据
   * @param {object} option.originitem 源formdata数据
   * @param {string} [option.from] 调用来源
   * @returns {*}
   */
  getFormData (modType, { targetitem, originitem, from = 'init' }) {
    let mod = this.mod[modType]
    let targetData
    // 不存在mod情况下生成值无意义，不做判断
    if (mod) {
      // 存在源数据则获取属性值并调用主要模块的edit方法格式化，否则通过模块的getValueData方法获取初始值
      if (originitem) {
        targetData = this.triggerFunc('edit', originitem[this.prop], {
          type: modType,
          targetitem,
          originitem
        })
      } else if (mod.getValueData) {
        if (from == 'reset') {
          targetData = mod.getValueData('resetdata')
        } else {
          targetData = mod.getValueData('initdata')
        }
      }
      // 调用模块的readyData
      if (mod.readyData) {
        mod.readyData().then(() => {}, err => {
            this.$exportMsg(`${modType}模块readyData调用失败！`, 'error', {
            data: err,
            type: 'error'
          })
        })
      }
      // 模块存在edit函数时将当前数据进行edit操作
      if (mod.func && mod.func.edit) {
        targetData = mod.func.edit(targetData, {
          type: modType,
          targetitem,
          originitem,
          from: from
        })
      }
    }
    return targetData
  }

  /**
   * 从数据源获取数据
   * @param {*} originData 数据源数据
   * @param {*} payload originitem(接口数据源数据)/targetitem(目标本地数据)/type(数据来源的接口)
   */
  formatOrigin (originData, payload) {
    return this.triggerFunc('format', originData, payload)
  }
}

DictionaryItem.$name = 'DictionaryItem'

export default DictionaryItem
