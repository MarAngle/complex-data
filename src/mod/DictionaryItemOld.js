import $func from 'complex-func'
import { formatInitOption } from '../utils'
import modOption from '../../modOption'
import SimpleData from '../data/SimpleData'
import InterfaceData from './InterfaceData'
import LayoutData from './LayoutData'

class DictionaryItem extends SimpleData {
  constructor (initOption, payload = {}) {
    initOption = formatInitOption(initOption, null, 'DictionaryItem初始化参数不存在！')
    super(initOption)
    this.$mod = {}
    const originFromType = $func.getType(initOption.originFrom)
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
    this.$interface.label = new InterfaceData(initOption.label === undefined ? this.$name : this.label)
    this.$interface.showProp = new InterfaceData(initOption.showProp)
    this.$interface.showType = new InterfaceData(initOption.showType)
    // prop/originProp
    this.$interface.originProp = new InterfaceData(initOption.originProp || this.prop)
    // --- 不存在prop时默认以originProp为主，此时以默认为基准=>prop为单一字段
    if (!this.prop) {
      this.prop = this.getInterface('originProp')
    }
    // 数据格式判断，暂时判断为存在showProp则自动设置为object，暂时不考虑存在showProp{ prop: '' }情况下对应prop的情况
    let type = initOption.type
    if (!type && initOption.showProp) {
      type = 'object'
    }
    this.$interface.type = new InterfaceData(type || 'string')
    // modType为模块解析字段，主要使用在modOption
    this.$interface.modType = new InterfaceData('list')
    this.setLayout(initOption.layout, payload.layout)
    modOption.format(this, initOption.mod)
    this.$formatFunc()
  }
  // 获取moddata=>该数据为页面需要的数据格式,从外部定义
  getModData (modprop, payload = {}) {
    return modOption.unformat(this, modprop, payload)
  }
  setLayout (layoutOption, parentLayoutOption) {
    let option = layoutOption || parentLayoutOption
    if (option && option.constructor === LayoutData) {
      this.$layout = option
    } else {
      this.$layout = new LayoutData(option)
    }
  }
  getLayout (prop) {
    if (prop) {
      return this.$layout.getData(prop)
    } else {
      return this.$layout
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
  setInterface (target, prop, data, useSetData) {
    this.$interface[target].setData(prop, data, useSetData)
  }
  /**
   * 格式化func函数
   */
  $formatFunc () {
    if (this.$func.defaultGetData === undefined) {
      this.$func.defaultGetData = (data, { type }) => {
        let showProp = this.getInterface('showProp', type)
        if (showProp) {
          if (data && $func.getType(data) == 'object') {
            return $func.getProp(data, showProp)
          } else {
            return undefined
          }
        } else {
          return data
        }
      }
    }
    if (this.$func.show === undefined) {
      this.$func.show = this.$func.defaultGetData
    }
    if (this.$func.edit === undefined) {
      this.$func.edit = this.$func.defaultGetData
    }
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
    if (this.$func.check === undefined) {
      this.$func.check = (data, payload) => {
        return $func.isExist(data)
      }
    }
  }
  /**
   * 判断是否存在来源
   * @param {string} originFrom 来源
   * @returns {boolean}
   */
  isOriginFrom (originFrom) {
    return this.originFrom.indexOf(originFrom) > -1
  }
  /**
   * 判断是否存在模块
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
  /**
   * 获取originProp
   * @param {string} prop prop值
   * @param {string} originFrom originFrom值
   * @returns {string}
   */
  getOriginProp (prop, originFrom) {
    if (this.prop == prop) {
      return this.getInterface('originProp', originFrom)
    } else {
      return false
    }
  }
  /**
   * 生成formData的prop值，基于自身从originData中获取对应属性的数据并返回
   * @param {string} modType modType
   * @param {object} option 参数
   * @param {object} option.targetData 目标数据
   * @param {object} option.originData 源formdata数据
   * @param {string} [option.from] 调用来源
   * @returns {*}
   */
  getFormData (modType, { targetData, originData, from = 'init' }) {
    let mod = this.getMod(modType)
    let tData
    // 不存在mod情况下生成值无意义，不做判断
    if (mod) {
      // 存在源数据则获取属性值并调用主要模块的edit方法格式化，否则通过模块的getValueData方法获取初始值
      if (originData) {
        tData = this.triggerFunc('edit', originData[this.prop], {
          type: modType,
          targetData,
          originData
        })
      } else if (mod.getValueData) {
        if (from == 'reset') {
          tData = mod.getValueData('resetdata')
        } else {
          tData = mod.getValueData('initdata')
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
      if (mod.$func && mod.$func.edit) {
        tData = mod.$func.edit(tData, {
          type: modType,
          targetData,
          originData,
          from: from
        })
      }
    }
    return tData
  }

  /**
   * 将数据值挂载到目标数据的prop属性上
   * @param {object} targetData 目标数据
   * @param {string} prop 属性
   * @param {*} oData 数据源数据
   * @param {string} type 数据类型
   * @param {string} [formatFuncName] 需要触发的数据格式化函数名称
   * @param {object} [payload] originData(接口源数据)/targetData(本地目标数据)/type(数据来源接口)
   */
  setDataByFormat(targetData, prop, oData, type, formatFuncName, payload) {
     let tData
    if (formatFuncName) {
      tData = this.triggerFunc(formatFuncName, oData, payload)
    } else {
      tData = oData
    }
    if (type == 'number') {
      tData = $func.formatNum(tData)
    } else if (type == 'boolean') {
      tData = !!tData
    }
    $func.setProp(targetData, prop, tData, true)
  }
}

DictionaryItem.$name = 'DictionaryItem'

export default DictionaryItem
