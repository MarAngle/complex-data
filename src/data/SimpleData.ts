import _func from 'complex-func'
import { objectAny, objectFunction } from 'complex-func/src/ts'
import Data from './Data'
import { formatInitOption } from '../utils'


export interface SimpleDataInitOption {
  name?: string,
  prop?: string,
  parent?: Data,
  func?: objectFunction,
  extra?: objectAny,
  root?: objectAny,
  methods?: objectFunction,
}

class SimpleData extends Data {
	$parent?: Data;
	$name: string;
	$prop: string;
	$func: objectAny;
	$extra: objectAny;
  [prop: string]: any
  constructor (initOption: SimpleDataInitOption) {
    initOption = formatInitOption(initOption)
    super()
    this.$name = initOption.name || ''
    this.$prop = initOption.prop || ''
    this.$func = {}
    this.$extra = {}
    this.setParent(initOption.parent)
    this.$initFunc(initOption.func)
    this.initExtra(initOption.extra)
    this.$initRoot(initOption.root)
    this.$initMethods(initOption.methods)
  }
  /**
   * 设置父数据,需要设置为不可枚举避免循环递归：主要针对微信小程序环境
   * @param {object} parent 父数据
   */
  setParent (parent?: Data) {
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
  getParent(): Data | undefined {
    return this.$parent
  }
  /**
   * 挂载根属性
   * @param {*} rootData 函数对象
   */
  $initRoot (rootData?: objectAny) {
    if (rootData) {
      for (const prop in rootData) {
        if (_func.hasProp(this, prop)) {
          const type = _func.getType(this[prop])
          this.$exportMsg(`$initRoot:对应属性${prop}存在类型为${type}的同名属性，属性未挂载!`)
        } else {
          this[prop] = rootData[prop]
        }
      }
    }
  }
  /**
   * 挂载方法
   * @param {*} methods 函数对象
   */
  $initMethods (methods?: objectAny) {
    if (methods) {
      for (const prop in methods) {
        let build = true
        if (this[prop] !== undefined) {
          const type = _func.getType(this[prop])
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
  }
  /**
   * 加载func中的函数
   * @param {object} [func] 函数对象
   * @param {*} [reset] 是否重置
   */
  $initFunc (func?: objectFunction, reset?: boolean) {
    if (reset) {
      this.$func = {}
    }
    for (const n in func) {
      this.$func[n] = func[n].bind(this)
    }
  }
  /**
   * 加载额外数据
   * @param {object} [extraData] 额外数据对象
   */
  initExtra (extraData?: objectAny) {
    this.clearExtra()
    if (_func.getType(extraData) == 'object') {
      for (const n in extraData) {
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
  setExtra (prop: string, data: any) {
    this.$extra[prop] = data
  }
  /**
   * 获取额外数据
   * @param {string} prop 属性
   * @returns {*}
   */
  getExtra (prop:string): any
  getExtra (): objectAny
  getExtra (prop?:string){
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
  clearExtra (prop?:string) {
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
  $selfName (): string {
    let parentName = ''
    const parent = this.getParent()
    if (parent && parent.$selfName) {
      parentName += `{PARENT:${parent.$selfName()}}-`
    }
    return `${parentName}[${super.$selfName()}-(${this.$name}/${this.$prop})]`
  }
}

SimpleData.$name = 'SimpleData'

export default SimpleData
