import _func from 'complex-func'
import SimpleData from './../data/SimpleData'
import FuncData from './FuncData'

/*
传参问题不能用apply解决，避免箭头函数产生的this指向错误问题
生命周期函数暂行方案
通过Map实现，可实现对应的顺序
基本周期函数
created
beforeLoad
loaded
loadFail
beforeUpdate
updated
updateFail
beforeReset
reseted
beforeDestroy
destroyed
*/

class LifeData extends SimpleData {
  constructor (initdata) {
    super()
    this.data = {}
    if (initdata) {
      this.initData(initdata)
    }
  }
  /**
   * 加载生命周期状态列表
   * @param {object} [data] 生命周期参数
   * @param {boolean} [reset = true] 是否重置
   */
  initData (data = {}, reset = true) {
    if (reset) {
      this.reset()
    }
    for (let n in data) {
      let item = data[n]
      this.on(n, item)
    }
  }
  /**
   * 创建对应的生命周期对象:存储
   * @param {string} name 生命周期名称
   * @param {boolean} [auto = true] 不存在时自动设置
   */
  build(name, auto = true) {
    if (!this.data[name] && auto) {
      this.data[name] = new FuncData({
        name: name
      })
    }
  }
  /**
   * 获取对应生命周期对象
   * @param {string} name 生命周期名称
   * @param {boolean} [auto = true] 不存在时自动设置
   * @returns {FuncData}
   */
  get(name, auto) {
    this.build(name, auto)
    return this.data[name]
  }
  /**
   * 设置生命周期回调
   * @param {string} name 生命周期名称
   * @param {*} data FuncData参数
   * @returns {boolean}
   */
  on (name, data) {
    let funcItem = this.get(name, true)
    return funcItem.build(data)
  }
  /**
   * 触发生命周期指定id函数
   * @param {string} name 生命周期
   * @param {string} id 指定ID
   * @param  {...any} args 参数
   */
  emit (name, id, ...args) {
    let funcItem = this.get(name, true)
    funcItem.emit(id, ...args)
  }
  /**
   * 触发生命周期
   * @param {string} name 生命周期
   * @param  {...any} args 参数
   */
  trigger (name, ...args) {
    let funcItem = this.get(name, true)
    funcItem.trigger(...args)
  }
  /**
   * 删除生命周期指定函数
   * @param {string} name 生命周期
   * @param {string} id 指定ID
   * @returns {boolean}
   */
  off (name, id) {
    let funcItem = this.get(name, false)
    if (funcItem) {
      return funcItem.off(id)
    }
  }
  /**
   * 清除生命周期
   * @param {string} name 生命周期
   */
  clear (name) {
    let funcItem = this.get(name, false)
    if (funcItem) {
      funcItem.clear()
    }
  }
  /**
   * 重置
   */
  reset () {
    for (let name in this.data) {
      this.clear(name)
    }
  }
  /**
   * 销毁
   */
  destroy () {
    this.reset()
    this.data = {}
  }
}

LifeData._name = 'LifeData'

export default LifeData
