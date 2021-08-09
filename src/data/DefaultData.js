import _func from 'complex-func'
import SimpleData from './SimpleData'
import ModuleData from './../mod/ModuleData'
import ExtraData from './../mod/ExtraData'
import ParentData from './../mod/ParentData'
import LifeData from './../mod/LifeData'

class DefaultData extends SimpleData {
  constructor (initdata) {
    if (!initdata) {
      initdata = {}
    }
    super()
    this.module = new ModuleData({
      life: new LifeData(),
      parent: new ParentData(),
      extra: new ExtraData()
    }, this)
    // 创建生命周期的名称列表-自动
    this.$LocalTempData.AutoCreateLifeNameList = []
    this.triggerCreateLife('DefaultData', 'beforeCreate', initdata)
    this.initDefaultData(initdata)
    this.triggerCreateLife('DefaultData', 'created')
  }
  initDefaultData ({ name, prop, data, life, parent, extra, func, methods }) {
    this.name = name || ''
    this.prop = prop || ''
    this._initData(data)
    this.initLife(life, false)
    this.setParent(parent)
    this.initExtra(extra)
    this.initFunc(func)
    this.initMethods(methods)
  }
  _initData(data) {
    if (data) {
      this.data = data
    }
  }
  // 加载func中的函数
  initFunc (func) {
    this.func = {}
    for (let n in func) {
      this.func[n] = func[n].bind(this)
    }
  }
  // 挂载方法
  initMethods (methods) {
    for (let prop in methods) {
      let build = true
      if (this[prop] !== undefined) {
        let type = _func.getType(this[prop])
        if (type !== 'function') {
          this.printMsg(`自定义函数${prop}存在同名属性，未生效!`)
          build = false
        } else {
          this.printMsg(`method:${prop}已被改写!`, 'warn')
        }
      }
      if (build) {
        this[prop] = methods[prop]
      }
    }
  }
  /* --模块加载相关-- */
  initModule(data) {
    return this.module.initData(data)
  }
  setModule(prop, data) {
    return this.module.setData(prop, data)
  }
  getModule(prop) {
    return this.module.getData(prop)
  }
  triggerModuleMethod(prop, method, args) {
    return this.module.triggerMethod(prop, method, args)
  }
  /* --生命周期函数-- */
  // 设置生命周期函数
  initLife (data, reset) {
    this.getModule('life').initData(data, reset)
  }
  onLife (name, data) {
    if (this.$LocalTempData.AutoCreateLifeNameList.indexOf(name) > -1) {
      this.printMsg(`正在创建一个属于创建生命周期相关的回调函数${name}，如此函数不是创建生命周期回调请修改函数名，否则请检查代码，理论上当你在设置这个触发函数时创建已经完成，此函数可能永远不会被触发！`)
    }
    return this.getModule('life').on(name, data)
  }
  // 触发特定的生命周期函数
  emitLife (name, id, ...args) {
    this.getModule('life').emit(name, id, ...args)
  }
  // 清楚指定类型指定name的生命周期回调
  offLife (name, id) {
    this.getModule('life').off(name, id)
  }
  // 触发生命周期
  triggerCreateLife (env, lifeName, ...args) {
    if (!env) {
      this.printMsg('triggerCreateLife函数需要传递env参数')
    }
    if (env != this.constructor.name) {
      lifeName = env + lifeName.charAt(0).toUpperCase() + lifeName.slice(1)
    }
    this.$LocalTempData.AutoCreateLifeNameList.push(lifeName)
    this.triggerLife(lifeName, this, ...args)
  }
  // 触发生命周期
  triggerLife (name, ...args) {
    this.getModule('life').trigger(name, ...args)
  }
  // 清楚指定类型的所有生命周期回调
  clearLife (name) {
    this.getModule('life').clear(name)
  }
  // 生命周期重置
  resetLife () {
    this.getModule('life').reset()
  }
  // 生命周期重置
  destroyLife () {
    this.getModule('life').destroy()
  }
  /* --父数据相关-- */
  // 设置父实例
  setParent (data) {
    this.getModule('parent').setData(data)
  }
  // 获取上级实例
  getParent (n) {
    return this.getModule('parent').getData(n)
  }
  /* --额外数据相关-- */
  // 加载额外数据
  initExtra (extraData) {
    if (extraData) {
      let fg = this.getModule('extra').initData(extraData)
      if (!fg) {
        this.printMsg(`设置ExtrData出错`)
      }
    }
  }
  // 设置额外数据
  setExtra (prop, data) {
    this.getModule('extra').setData(prop, data)
  }
  // 获取额外数据
  getExtra (prop) {
    return this.getModule('extra').getData(prop)
  }
  // 清除额外数据
  clearExtra (prop) {
    this.getModule('extra').clearData(prop)
  }
  // 重置额外数据
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
    return `{${pre}[${this.constructor.name}-${this.name}/${this.prop}]}`
  }
}

export default DefaultData
