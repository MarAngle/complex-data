import _func from 'complex-func'
import SimpleData from './SimpleData'
import ModuleData from './../mod/ModuleData'
import ParentData from './../mod/ParentData'

class DefaultData extends SimpleData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super()
    this.name = initOption.name || ''
    this.prop = initOption.prop || ''
    this.func = {}
    this.extra = {}
    // 模块加载
    this.module = new ModuleData({}, this)
    if (initOption.data) {
      this.data = initOption.data
    }
    this.initExtra(initOption.extra)
    this.$initParent(initOption.parent)
    this.$initFunc(initOption.func)
    this.$initMethods(initOption.methods)
  }
  /**
   * 加载func中的函数
   * @param {object} [func] 函数对象
   * @param {*} [reset] 是否重置
   */
  $initFunc (func, reset) {
    if (reset) {
      this.func = {}
    }
    for (let n in func) {
      this.func[n] = func[n].bind(this)
    }
  }
  /**
   * 挂载方法
   * @param {*} methods 函数对象
   */
  $initMethods (methods) {
    for (let prop in methods) {
      let build = true
      if (this[prop] !== undefined) {
        let type = _func.getType(this[prop])
        if (type !== 'function') {
          this.$exportMsg(`$initMethods:对应函数${prop}存在类型为${type}的同名属性，函数未挂载!`)
          build = false
        } else {
          this.$exportMsg(`$initMethods:${prop}函数已被改写!`, 'warn')
        }
      }
      if (build) {
        this[prop] = methods[prop]
      }
    }
  }
  /* --模块加载相关-- */
  /**
   * 加载模块
   * @param {*} data 模块实例对象
   */
  initModule(data) {
    this.module.initData(data)
  }
  /**
   * 设置模块
   * @param {string} prop 模块名称
   * @param {object} data 模块实例
   */
  setModule(prop, data) {
    this.module.setData(prop, data)
  }
  /**
   * 获取模块
   * @param {string} prop 模块名称
   * @returns {object} 模块实例
   */
  getModule(prop) {
    return this.module.getData(prop)
  }
  /**
   * 触发指定模块的指定函数
   * @param {string} prop 模块名称
   * @param {string} method 函数名称
   * @param {*[]} args 参数
   * @returns {*}
   */
  triggerModuleMethod(prop, method, args) {
    return this.module.triggerMethod(prop, method, args)
  }
  /* --父数据相关-- */
  // 设置父实例
  $initParent (data) {
    if (data || data === undefined) {
      this.setModule('parent', new ParentData(data))
    }
  }
  // 设置父实例
  setParent (data) {
    let parentModule = this.getModule('parent')
    if (parentModule) {
      parentModule.setData(data)
    } else {
      this.$initParent(data)
    }
  }
  // 获取上级实例
  getParent (n) {
    let parentModule = this.getModule('parent')
    if (parentModule) {
      return parentModule.getData(n)
    }
  }
  /* --额外数据相关-- */
  /**
   * 加载额外数据
   * @param {object} [extraData] 额外数据对象
   */
  initExtra (extraData) {
    this.clearExtra()
    if (_func.getType(extraData) == 'object') {
      for (let n in extraData) {
        this.setExtra(n, extraData[n])
      }
    } else if (extraData !== undefined) {
      this.$exportMsg(`初始化extra出错，数据必须为对象`)
    }
  }
  /**
   * 设置额外数据
   * @param {string} prop 属性
   * @param {*} data 数据
   */
  setExtra (prop, data) {
    this.extra[prop] = data
  }
  /**
   * 获取额外数据
   * @param {string} prop 属性
   * @returns {*}
   */
  getExtra (prop) {
    if (!prop) {
      return this.extra
    } else {
      return this.extra[prop]
    }
  }
  /**
   * 获取额外数据
   * @param {string} prop 属性
   * @returns {*}
   */
  clearExtra (prop) {
    if (!prop) {
      this.extra = {}
    } else {
      delete this.extra[prop]
    }
  }
  /**
   * 重置额外数据，清除全部数据
   */
  resetExtra () {
    this.clearExtra()
  }
  $selfName () {
    let parentName = ''
    let parent = this.getParent()
    if (parent && parent.$selfName) {
      parentName += `{PARENT:${parent.$selfName()}}-`
    }
    return `${parentName}[${super.$selfName()}-(${this.name}/${this.prop})]`
  }
}

DefaultData.$name = 'DefaultData'

export default DefaultData
