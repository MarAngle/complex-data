import _func from 'complex-func'
import SimpleData from './SimpleData'
import ModuleData from './../mod/ModuleData'
import ExtraData from './../mod/ExtraData'
import ParentData from './../mod/ParentData'
import LifeData from './../mod/LifeData'

class DefaultData extends SimpleData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super()
    this.name = initOption.name || ''
    this.prop = initOption.prop || ''
    this.func = {}
    // 模块,默认加载life/extra
    this.module = new ModuleData({
      life: new LifeData(initOption.life),
      extra: new ExtraData()
    }, this)
    // 创建生命周期的名称列表-自动
    this.$LocalTempData.AutoCreateLifeNameList = []
    this.triggerCreateLife('DefaultData', 'beforeCreate', initOption)
    this.setData(initOption.data)
    this.initParent(initOption.parent)
    this.initExtra(initOption.extra)
    this.initFunc(initOption.func)
    this.initMethods(initOption.methods)
    this.triggerCreateLife('DefaultData', 'created')
  }
  /**
   * 加载data
   * @param {*} [data]
   */
  setData(data) {
    if (data) {
      this.data = data
    }
  }
  /**
   * 加载func中的函数
   * @param {object} [func] 函数对象
   * @param {*} [reset] 是否重置
   */
  initFunc (func, reset) {
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
  initMethods (methods) {
    for (let prop in methods) {
      let build = true
      if (this[prop] !== undefined) {
        let type = _func.getType(this[prop])
        if (type !== 'function') {
          this.printMsg(`initMethods:对应函数${prop}存在类型为${type}的同名属性，函数未挂载!`)
          build = false
        } else {
          this.printMsg(`initMethods:${prop}函数已被改写!`, 'warn')
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
  /* --生命周期函数-- */
  /**
   * 设置生命周期回调函数
   * @param {string} name 对应生命周期
   * @param {*} data 回调对象
   * @returns {*}
   */
  onLife (name, data) {
    if (this.$LocalTempData.AutoCreateLifeNameList.indexOf(name) > -1) {
      this.printMsg(`正在创建一个属于创建生命周期相关的回调函数${name}，如此函数不是创建生命周期回调请修改函数名，否则请检查代码，理论上当你在设置这个触发函数时创建已经完成，此函数可能永远不会被触发！`)
    }
    return this.getModule('life').on(name, data)
  }
  /**
   * 触发生命周期指定id函数
   * @param {string} name 生命周期
   * @param {string} id 指定ID
   * @param  {...any} args 参数
   */
  emitLife (name, id, ...args) {
    this.getModule('life').emit(name, id, ...args)
  }
  /**
   * 删除生命周期指定函数
   * @param {string} name 生命周期
   * @param {string} id 指定ID
   * @returns {boolean}
   */
  offLife (name, id) {
    this.getModule('life').off(name, id)
  }
  /**
   * 触发创造生命周期
   * @param {string} env 当前调用对象名称
   * @param {string} lifeName 生命周期
   * @param  {*[]} args 参数
   */
  triggerCreateLife (env, lifeName, ...args) {
    if (!env) {
      this.printMsg('triggerCreateLife函数需要传递env参数')
    }
    if (env != this.constructor._name) {
      lifeName = env + lifeName.charAt(0).toUpperCase() + lifeName.slice(1)
    }
    this.$LocalTempData.AutoCreateLifeNameList.push(lifeName)
    this.triggerLife(lifeName, this, ...args)
  }
  /**
   * 触发生命周期
   * @param {string} name 生命周期
   * @param  {...any} args 参数
   */
  triggerLife (name, ...args) {
    this.getModule('life').trigger(name, ...args)
  }
  /**
   * 清除生命周期
   * @param {string} name 生命周期
   */
  clearLife (name) {
    this.getModule('life').clear(name)
  }
  /**
   * 生命周期重置
   */
  resetLife () {
    this.getModule('life').reset()
  }
  /**
   * 生命周期销毁
   */
  destroyLife () {
    this.getModule('life').destroy()
  }
  /* --父数据相关-- */
  // 设置父实例
  initParent (data) {
    if (data || data === undefined) {
      this.setModule('parent', new ParentData(data))
    }
  }
  // 设置父实例
  setParent (data) {
    this.getModule('parent').setData(data)
  }
  // 获取上级实例
  getParent (n) {
    return this.getModule('parent').getData(n)
  }
  /* --额外数据相关-- */
  /**
   * 加载额外数据
   * @param {object} [extraData] 额外数据对象
   */
  initExtra (extraData) {
    if (extraData) {
      let fg = this.getModule('extra').initData(extraData)
      if (!fg) {
        this.printMsg(`设置ExtrData出错`)
      }
    }
  }
  /**
   * 设置额外数据
   * @param {string} prop 属性
   * @param {*} data 数据
   */
  setExtra (prop, data) {
    this.getModule('extra').setData(prop, data)
  }
  /**
   * 获取额外数据
   * @param {string} prop 属性
   * @returns {*}
   */
  getExtra (prop) {
    return this.getModule('extra').getData(prop)
  }
  /**
   * 获取额外数据
   * @param {string} prop 属性
   * @returns {*}
   */
  clearExtra (prop) {
    this.getModule('extra').clearData(prop)
  }
  /**
   * 重置额外数据，清除全部数据
   */
  resetExtra () {
    this.getModule('extra').reset()
  }
  _selfName () {
    let parent = this.getParent()
    let pre
    if (parent && parent._selfName) {
      pre = `(${parent._selfName()})-`
    }
    if (!pre) {
      pre = ``
    }
    return `{${pre}[${this.constructor._name}-${this.name}/${this.prop}]}`
  }
}

DefaultData._name = 'DefaultData'

export default DefaultData
