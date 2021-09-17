import _func from 'complex-func'
import IdData from './IdData'
import SimpleData from './../data/SimpleData'

let lifeId = new IdData({
  list: [
    {
      type: 'time'
    },
    {
      type: 'id'
    }
  ]
})

class FuncData extends SimpleData {
  constructor (initOption = {}) {
    super()
    this.data = new Map()
    this.setName(initOption.name)
    if (initOption.data) {
      this.initData(initOption.data)
    }
  }
  /**
   * 加载
   * @param {*} data 参数
   */
  initData(data) {
    this.build(data)
  }
  /**
   * 设置名称
   * @param {string} name 名称
   */
  setName(name = '') {
    this.name = name
  }
  /**
   * 计算ID
   * @returns {string} ID
   */
  buildId () {
    return lifeId.getData()
  }
  /**
   * 设置生命周期对应函数回调
   * @param {object} data 参数
   */
  pushData(data) {
    if (data.index === undefined || data.index == 'end') {
      this.data.set(data.id, data)
    } else {
      if (data.index == 'start') {
        data.index = 0
      }
      let size = this.data.size
      if (data.index < size) {
        let mapList = []
        this.data.forEach(function(value) {
          mapList.push(value)
        })
        this.data.clear()
        for (let n = 0; n < size; n++) {
          let mapItem = mapList[n]
          if (data.index == n) {
            this.data.set(data.id, data)
          }
          this.data.set(mapItem.id, mapItem)
        }
      } else {
        this.data.set(data.id, data)
      }
    }
  }
  /**
   * build
   * @param {*} data
   * @returns {string} id
   */
  build(data) {
    let resId
    if (data) {
      let isArray = _func.isArray(data)
      if (isArray) {
        resId = []
        for (let n = 0; n < data.length; n++) {
          resId.push(this.formatData(data[n]))
        }
      } else {
        resId = this.formatData(data)
      }
    }
    return resId
  }
  /**
   * 格式化数据
   * @param {object| function} data 回调参数
   * @returns {boolean}next
   */
  formatData(data) {
    let dataType = _func.getType(data)
    let next = true
    if (dataType === 'function') {
      data = {
        data: data
      }
    } else if (dataType !== 'object') {
      next = false
    }
    if (next) {
      if (data.data) {
        if (!data.id) {
          data.id = this.buildId()
        }
        if (this.data.has(data.id) && !data.replace) {
          this.printMsg(`存在当前值:${data.id}`)
        } else {
          this.pushData(data)
          if (data.immediate) {
            this.emit(data.id)
          }
          return data.id
        }
      } else {
        this.printMsg(`设置(${data.id || '-'})未定义func`)
      }
    } else {
      this.printMsg(`设置data参数需要object或者function`)
    }
    return undefined
  }
  /**
   * 触发函数
   * @param  {...any} args 参数
   */
  trigger(...args) {
    for (let id of this.data.keys()) {
      this.emit(id, ...args)
    }
  }
  /**
   * 触发指定id的回调
   * @param {string} id id
   * @param  {...any} args 参数
   */
  emit(id, ...args) {
    let data = this.data.get(id)
    if (data && data.data) {
      data.data(...args)
      if (data.once) {
        this.off(id)
      }
    } else {
      this.printMsg(`不存在当前值(${id})`)
    }
  }
  /**
   * 删除指定id的生命周期
   * @param {string} id id
   * @returns {boolean}
   */
  off (id) {
    return this.data.delete(id)
  }
  /**
   * 清空所有回调
   */
  clear() {
    this.data.clear()
  }
  /**
   * 重置
   */
  reset () {
    this.clear()
  }
  /**
   * 销毁
   */
  destroy() {
    this.reset()
  }
  _selfName () {
    return `${super._selfName()}[生命周期:${this.name}]`
  }
}

FuncData._name = 'FuncData'

export default FuncData
