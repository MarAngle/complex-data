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
  // 加载生命周期状态列表
  initData (data = {}, reset = true) {
    if (reset) {
      this.reset()
    }
    for (let n in data) {
      let item = data[n]
      this.on(n, item)
    }
  }
  // 创建对应的生命周期 auto = true
  build(name, auto = true) {
    if (!this.data[name] && auto) {
      this.data[name] = new FuncData({
        name: name
      })
    }
  }
  // 获取对应生命周期对象
  get(name, auto) {
    this.build(name, auto)
    return this.data[name]
  }
  // 设置生命周期回调
  on (name, data) {
    let funcItem = this.get(name, true)
    return funcItem.build(data)
  }
  // 触发生命周期指定函数
  emit (name, id, ...args) {
    let funcItem = this.get(name, true)
    funcItem.emit(id, ...args)
  }
  // 触发生命周期
  trigger (name, ...args) {
    let funcItem = this.get(name, true)
    funcItem.trigger(...args)
  }
  // 删除生命周期指定函数
  off (name, id) {
    let funcItem = this.get(name, false)
    if (funcItem) {
      return funcItem.off(id)
    }
  }
  // 清除生命周期
  clear (name) {
    let funcItem = this.get(name, false)
    if (funcItem) {
      funcItem.clear()
    }
  }
  // 重置
  reset () {
    for (let name in this.data) {
      this.clear(name)
    }
  }
  // 销毁
  destroy () {
    this.reset()
    this.data = {}
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'SimpleData',
        describe: '生命周期数据格式',
        build: [
          {
            prop: 'data',
            type: 'object',
            describe: '生命周期设置数据',
            data: [
              {
                prop: '[key]',
                type: 'string',
                describe: '生命周期名称'
              },
              {
                prop: '[value]',
                type: 'object/function',
                describe: '函数回调对象/函数'
              }
            ]
          }
        ],
        data: [
          {
            prop: 'data',
            type: 'object',
            describe: '函数数据保存位置'
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

LifeData.initInstrcution()

export default LifeData
