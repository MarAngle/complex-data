import _func from 'complex-func'
import Data from './Data'

class DefaultData extends Data {
  constructor (initOption) {
    super()
    if (!initOption) {
      initOption = {}
    }
    this.$name = initOption.name || ''
    this.$prop = initOption.prop || ''
    this.$func = {}
    this.$extra = {}
    this.data = initOption.data || {}
    this.setParent(initOption.parent)
    this.initFunc(initOption.func)
    this.initExtra(initOption.extra)
    this.initMethods(initOption.methods)
  }
  /**
   * 设置父数据,需要设置为不可枚举避免循环递归：主要针对微信小程序环境
   * @param {object} parent 父数据
   */
  setParent (parent) {
    Object.defineProperty(this, '$parent', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: parent
    })
  }
  /**
   * 获取父数据
   * @returns {object | undefined}
   */
  getParent() {
    return this.$parent
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
          this.$exportMsg(`initMethods:对应函数${prop}存在类型为${type}的同名属性，函数未挂载!`)
          build = false
        } else {
          this.$exportMsg(`initMethods:${prop}函数已被改写!`, 'warn')
        }
      }
      if (build) {
        this[prop] = methods[prop]
      }
    }
  }
  /**
   * 加载func中的函数
   * @param {object} [func] 函数对象
   * @param {*} [reset] 是否重置
   */
  initFunc (func, reset) {
    if (reset) {
      this.$func = {}
    }
    for (let n in func) {
      this.$func[n] = func[n].bind(this)
    }
  }
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
    this.$extra[prop] = data
  }
  /**
   * 获取额外数据
   * @param {string} prop 属性
   * @returns {*}
   */
  getExtra (prop) {
    if (!prop) {
      return this.$extra
    } else {
      return this.$extra[prop]
    }
  }
  /**
   * 获取额外数据
   * @param {string} prop 属性
   * @returns {*}
   */
  clearExtra (prop) {
    if (!prop) {
      this.$extra = {}
    } else {
      delete this.$extra[prop]
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
