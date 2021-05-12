import _func from 'complex-func'
import SimpleData from './SimpleData'
import ModuleData from './../mod/ModuleData'
import ExtraData from './../mod/ExtraData'
import ParentData from './../mod/ParentData'
import LifeData from './../mod/LifeData'

class DefaultData extends SimpleData {
  constructor (initdata = {}) {
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
    for (let n in methods) {
      let build = true
      if (this[n]) {
        let type = _func.getType(this[n])
        if (type !== 'function') {
          this.printMsg(`自定义函数${n}存在同名属性，未生效!`)
          build = false
        } else {
          this.printMsg(`method:${n}已被改写!`, 'warn')
        }
      }
      if (build) {
        this[n] = methods[n]
      }
    }
  }
  // 模块加载相关
  initModule(data) {
    return this.module.initData(data)
  }
  setModule(prop, data) {
    return this.module.setData(prop, data)
  }
  getModule(prop) {
    return this.module.getData(prop)
  }
  // 生命周期函数
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
  //
  // --- 父数据相关 --- //
  // 设置父实例
  setParent (data) {
    this.getModule('parent').setData(data)
  }
  // 获取上级实例
  getParent (n) {
    return this.getModule('parent').getData(n)
  }
  // --额外数据相关--*/
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
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'SimpleData',
        describe: '实现module/extra/parent数据的加载，实现func/method的挂载',
        build: [
          {
            prop: 'initdata',
            type: 'object',
            describe: '构建参数',
            required: true,
            data: [
              {
                prop: 'name',
                type: 'string',
                required: false,
                describe: '名称'
              },
              {
                prop: 'prop',
                type: 'string',
                required: false,
                describe: '属性'
              },
              {
                prop: 'life',
                type: 'object',
                required: false,
                describe: 'life加载数据,仅此处定义created生命周期时可实现触发'
              },
              {
                prop: 'data',
                type: 'object',
                required: false,
                describe: 'data属性赋值'
              },
              {
                prop: 'parent',
                type: 'object',
                required: false,
                describe: '父数据'
              },
              {
                prop: 'extra',
                type: 'object',
                required: false,
                describe: 'extra数据'
              },
              {
                prop: 'func',
                type: 'object',
                required: false,
                describe: 'func函数，将会挂载到跟属性func上，this指向实例'
              },
              {
                prop: 'methods',
                type: 'object',
                required: false,
                describe: 'methods函数，将会挂载到实例上，this不做操作'
              }
            ]
          }
        ],
        data: [
          {
            prop: '$LocalTempData',
            extend: true,
            data: [
              {
                prop: 'AutoCreateLifeNameList',
                type: 'array[string]',
                describe: '继承链上所有创建相关生命周期名称保存数组，创建生命周期触发仅能在创建时触发，此列表缓存实现后期挂载的生命周期创建相关函数时进行可能无法触发的提示'
              }
            ]
          },
          {
            prop: 'name',
            type: 'string',
            describe: '名称'
          },
          {
            prop: 'prop',
            type: 'string',
            describe: '属性'
          },
          {
            prop: 'data',
            type: 'object',
            describe: 'data数据对象'
          },
          {
            prop: 'func',
            type: 'object',
            describe: 'func函数列表'
          },
          {
            prop: 'module',
            class: 'ModuleData',
            describe: '模块数据',
            data: [
              {
                prop: 'life',
                class: 'LifeData',
                describe: '生命周期数据'
              },
              {
                prop: 'extra',
                class: 'ExtraData',
                describe: '属性'
              },
              {
                prop: 'parent',
                class: 'ParentData',
                describe: '属性'
              }
            ]
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

DefaultData.initInstrcution()

export default DefaultData
