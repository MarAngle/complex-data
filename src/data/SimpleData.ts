import $func from 'complex-func'
import { objectUnknown, anyPromiseFunction } from './../../ts'
import Data from './Data'
import { formatInitOption } from '../utils'

export interface SimpleDataInitOption<DATA> {
  name?: string,
  prop?: string,
  data?: DATA,
  parent?: Data,
  extra?: objectUnknown
}


class SimpleData<DATA> extends Data {
	$parent?: Data;
	$name: string;
	$prop: string;
	$extra: objectUnknown;
  data?: DATA
  $getData?: anyPromiseFunction
  constructor (initOption: SimpleDataInitOption<DATA>) {
    initOption = formatInitOption(initOption)
    super()
    this.$name = initOption.name || ''
    this.$prop = initOption.prop || ''
    this.data = initOption.data
    this.$extra = {}
    this.$setParent(initOption.parent)
    this.$initExtra(initOption.extra)
  }
  /**
   * 设置父数据,需要设置为不可枚举避免循环递归：主要针对微信小程序环境
   * @param {object} parent 父数据
   */
  $setParent (parent?: Data) {
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
  $getParent(): Data | undefined {
    return this.$parent
  }
  /**
   * 加载额外数据
   * @param {object} [extraData] 额外数据对象
   */
  $initExtra (extraData?: objectUnknown) {
    this.$clearExtra()
    if ($func.getType(extraData) == 'object') {
      for (const n in extraData) {
        this.$setExtra(n, extraData[n])
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
  $setExtra (prop: string, data: unknown) {
    this.$extra[prop] = data
  }
  /**
   * 获取额外数据
   * @param {string} prop 属性
   * @returns {*}
   */
  $getExtra (prop:string): unknown
  $getExtra (): objectUnknown
  $getExtra (prop?:string){
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
  $clearExtra (prop?:string) {
    if (!prop) {
      this.$extra = {}
    } else {
      delete this.$extra[prop]
    }
  }
  /**
   * 重置额外数据，清除全部数据
   */
  $resetExtra () {
    this.$clearExtra()
  }
  $selfName (): string {
    let parentName = ''
    const parent = this.$getParent()
    if (parent && parent.$selfName) {
      parentName += `{PARENT:${parent.$selfName()}}-`
    }
    return `${parentName}[${super.$selfName()}-(${this.$name}/${this.$prop})]`
  }
}

SimpleData.$name = 'SimpleData'

export default SimpleData
