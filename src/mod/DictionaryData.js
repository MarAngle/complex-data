import _func from 'complex-func'
import DefaultData from './../data/DefaultData'
import InterfaceData from './InterfaceData'
import LayoutData from './LayoutData'
import option from './../option'

class DictionaryData extends DefaultData {
  constructor (initOption, payload = {}) {
    super(initOption)
    this.interface = {}
    this.mod = {}
    this.initMain(initOption)
    this.initInterface(initOption)
    this.setLayout(initOption.layout, payload.layout)
    option.format(this, initOption.mod)
    this.FormatFunc()
  }
  // 获取moddata=>该数据为页面需要的数据格式,从外部定义
  getModData (modprop, payload = {}) {
    return option.unformat(this, modprop, payload)
  }
  /**
   * 加载基本数据
   * @param {*} initOption
   */
  initMain (initOption) {
    this.originfrom = initOption.originfrom
    if (!this.originfrom) {
      this.originfrom = ['list']
    }
    let fromtype = _func.getType(this.originfrom)
    if (fromtype != 'array') {
      this.originfrom = [this.originfrom]
    }
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
   * 加载接口类型数据
   * @param {*} initOption
   */
  initInterface (initOption) {
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
    if (!this.func.defaultGetData) {
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
    if (!this.func.show) {
      this.func.show = this.func.defaultGetData
    }
    if (!this.func.edit) {
      this.func.edit = this.func.defaultGetData
    }
    if (!this.func.unedit) {
      this.func.unedit = (data, payload) => {
        let moditem = this.mod[payload.type]
        if (moditem && moditem.func.unedit) {
          return moditem.func.unedit(data, payload)
        } else {
          return data
        }
      }
    }
    if (!this.func.check) {
      this.func.check = (data, payload) => {
        if (data !== this.mod[payload.type].getValueData('defaultdata')) {
          return true
        } else {
          return false
        }
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
   * @param {string} funcname 函数名
   * @param {*} origindata 数据
   * @param {object} payload 参数
   * @returns {*}
   */
  triggerFunc (funcname, origindata, payload) {
    let itemFunc = this.getFunc(funcname)
    if (itemFunc) {
      return itemFunc(origindata, payload)
    } else {
      return origindata
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
   * 获取func函数
   * @param {string} funcname 函数名
   * @returns {function}
   */
  getFunc (funcname) {
    return this.func[funcname]
  }
  /**
   * 基于自身从originitem中获取对应属性的数据放返回
   * @param {string} modType modtype
   * @param {object} option 参数
   * @param {object} option.targetitem 目标数据
   * @param {object} option.originitem 源formdata数据
   * @param {string} option.from 调用来源
   * @returns {*}
   */
  getFormData (modType, option) {
    return new Promise((resolve, reject) => {
      let mod = this.mod[modType]
      if (mod) {
        if (mod.readyData) {
          mod.readyData().then(() => {
            resolve({ status: 'success', data: this.getFormDataNext(mod, modType, option) })
          }, () => {
            resolve({ status: 'fail', data: this.getFormDataNext(mod, modType, option) })
          })
        } else {
          resolve({ status: 'success', data: this.getFormDataNext(mod, modType, option) })
        }
      } else {
        reject({ status: 'fail', code: 'noMod', msg: this.buildPrintMsg(`${modType}对应的mod不存在`) })
      }
    })
  }
  /**
   * 基于自身从originitem中获取对应属性的数据放返回
   * @param {object} mod mod
   * @param {string} modType modtype
   * @param {object} option 参数
   * @param {object} option.targetitem 目标数据
   * @param {object} option.originitem 源formdata数据
   * @param {string} [option.from] 调用来源
   * @returns {*}
   */
  getFormDataNext (mod, modType, { targetitem, originitem, from = 'init' }) {
    let target
    if (originitem) {
      target = this.triggerFunc('edit', originitem[this.prop], {
        type: modType,
        targetitem,
        originitem
      })
      if (mod.func && mod.func.edit) {
        target = mod.func.edit(target, {
          type: modType,
          targetitem,
          originitem
        })
      }
    } else if (mod.getValueData) {
      if (from == 'reset') {
        target = mod.getValueData('resetdata')
      } else {
        target = mod.getValueData('initdata')
      }
    }
    return target
  }

  /**
   * 从数据源获取数据
   * @param {*} origindata 数据源数据
   * @param {*} payload originitem(接口数据源数据)/targetitem(目标本地数据)/type(数据来源的接口)
   */
  formatOrigin (origindata, payload) {
    return this.triggerFunc('format', origindata, payload)
  }
}

DictionaryData._name = 'DictionaryData'

export default DictionaryData
