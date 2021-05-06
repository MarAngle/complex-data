import _func from 'complex-func'
import SimpleData from './../data/SimpleData'
import IdData from './IdData'
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
  constructor (initdata = {}) {
    super()
    this.data = new Map()
    this.setName(initdata.name)
    if (initdata.data) {
      this.initData(initdata.data)
    }
  }
  initData(data) {
    this.build(data)
  }
  setName(name = '') {
    this.name = name
  }
  // 计算ID
  buildId () {
    return lifeId.getData()
  }
  // 设置生命周期对应函数回调
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
  build(data) {
    let res = false
    if (data) {
      let isArray = _func.isArray(data)
      if (isArray) {
        res = []
        for (let n = 0; n < data.length; n++) {
          res.push(this.formatData(data[n]))
        }
      } else {
        res = this.formatData(data)
      }
    }
    return res
  }
  formatData(data) {
    let dataType = typeof data
    let next = true
    if (dataType == 'function') {
      data = {
        data: data
      }
    } else if (dataType != 'object') {
      next = false
    }
    if (next) {
      if (data.data) {
        if (!data.id) {
          data.id = this.buildId()
        }
        if (this.data.has(data.id) && !data.repalce) {
          this.printInfo(`存在当前值:${data.id}`)
        } else {
          this.pushData(data)
          if (data.immediate) {
            this.emit(data.id)
          }
          return data.id
        }
      } else {
        this.printInfo(`设置(${data.id || '-'})未定义func`)
      }
    } else {
      this.printInfo(`设置data参数需要object或者function`)
    }
    return false
  }
  trigger(...args) {
    for (let id of this.data.keys()) {
      this.emit(id, ...args)
    }
  }
  emit(id, ...args) {
    let data = this.data.get(id)
    if (data && data.data) {
      data.data(...args)
      if (data.once) {
        this.off(id)
      }
    } else {
      this.printInfo(`不存在当前值(${id})`)
    }
  }
  // 删除生命周期指定函数
  off (id) {
    return this.data.delete(id)
  }
  clear() {
    this.data.clear()
  }
  // 重置
  reset () {
    this.clear()
  }
  destroy() {
    this.reset()
  }
  selfName () {
    return `${super.selfName()}[生命周期:${this.name}]`
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'SimpleData',
        describe: '生命周期数据格式',
        build: [
          {
            prop: 'initdata',
            type: 'object',
            describe: '生命周期设置数据',
            data: [
              {
                prop: 'name',
                type: 'string',
                describe: '文字标识'
              },
              {
                prop: 'data',
                type: 'function/object',
                describe: '函数对象参数'
              }
            ]
          }
        ],
        data: [
          {
            prop: 'name',
            type: 'string',
            describe: '文字标识'
          },
          {
            prop: 'data',
            type: 'map',
            describe: '函数保存位置'
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

FuncData.initInstrcution()

export default FuncData
