import _func from 'complex-func'
import DefaultData from './../data/DefaultData'
import InterfaceData from './InterfaceData'
import LayoutData from './LayoutData'
import option from './../option'

class DictionaryData extends DefaultData {
  constructor (initdata, payload = {}) {
    super(initdata)
    this.triggerCreateLife('DictionaryData', 'beforeCreate', initdata, payload)
    this.interface = {}
    this.mod = {}
    this._initDictionary(initdata, payload)
    this.triggerCreateLife('DictionaryData', 'created')
  }
  _initDictionary (initdata, payload = {}) {
    this.initMain(initdata)
    this.initInterface(initdata)
    this.setLayout(initdata.layout, payload.layout)
    option.format(this, initdata.mod)
    this.FormatFunc()
  }
  // 获取moddata=>该数据为页面需要的数据格式,从外部定义
  getModData (modprop, payload = {}) {
    return option.unformat(this, modprop, payload)
  }
  /**
   * 加载基本数据
   * @param {*} initdata
   */
  initMain (initdata) {
    this.originfrom = initdata.originfrom
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
  // 加载接口类型数据
  initInterface (initdata) {
    this.interface.label = new InterfaceData(initdata.label || initdata.name)
    this.interface.order = new InterfaceData(initdata.order)
    this.interface.showprop = new InterfaceData(initdata.showprop)
    this.interface.showtype = new InterfaceData(initdata.showtype)
    // prop/originprop
    this.interface.originprop = new InterfaceData(initdata.originprop || this.prop)
    // --- 不存在prop时默认以originprop为主，此时以默认为基准=>prop为单一字段
    if (!this.prop) {
      this.prop = this.getInterface('originprop')
    }
    // 数据格式判断，暂时判断为存在showprop则自动设置为object，暂时不考虑存在showprop{ prop: '' }情况下对应prop的情况
    let dataType = initdata.type
    if (!dataType && initdata.showprop) {
      dataType = 'object'
    }
    this.interface.type = new InterfaceData(dataType || 'string')
    this.interface.modtype = new InterfaceData('list')
  }
  // 获取接口数据
  getInterfaceData (target) {
    return this.interface[target]
  }
  // 获取接口数据
  getInterface (target, prop) {
    return this.interface[target].getData(prop)
  }
  // 设置接口数据
  setInterface (target, prop, data) {
    return this.interface[target].setData(prop, data)
  }
  // 格式化func函数
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
  // 判断是否来源
  isOrigin (origin) {
    return this.originfrom.indexOf(origin) > -1
  }
  // 判断是否属于模块
  isMod (mod) {
    let fg = false
    if (this.mod[mod]) {
      fg = true
    }
    return fg
  }
  // 触发可能存在的函数
  triggerFunc (funcname, origindata, payload) {
    let itemFunc = this.getFunc(funcname)
    if (itemFunc) {
      return itemFunc(origindata, payload)
    } else {
      return origindata
    }
  }
  // 获取originprop
  getOriginProp (prop, type) {
    if (this.prop == prop) {
      return this.getInterface('originprop', type)
    } else {
      return false
    }
  }
  // 获取func函数
  getFunc (funcname) {
    return this.func[funcname]
  }
  // 获取编辑数据
  getFormData (type, { targetitem, originitem }) {
    let mod = this.mod[type]
    let target
    if (originitem) {
      target = this.triggerFunc('edit', originitem[this.prop], {
        type: type,
        targetitem,
        originitem
      })
      if (mod && mod.func && mod.func.edit) {
        target = mod.func.edit(target, {
          type: type,
          targetitem,
          originitem
        })
      }
    } else if (mod.getValueData) {
      target = mod.getValueData('initdata')
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

export default DictionaryData
