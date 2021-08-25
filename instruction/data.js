import _func from 'complex-func'
import InstrcutionData from './../src/mod/InstrcutionData'

let instrcution = {
  show: true,
  data: new Map(),
  callback: new Map()
}

instrcution.setShow = function() {
  return this.show
}

instrcution.getShow = function() {
  return this.show
}

instrcution.init = function() {
  let realEnv = _func.getEnv('real')
  if (realEnv != 'development') {
    this.setShow(false)
  }
}

instrcution.build = function(instrcutionData) {
  if (this.getShow()) {
    this.data.set(instrcutionData.prop, new InstrcutionData(instrcutionData, this))
    this.triggerCallback(instrcutionData.prop)
  }
}

instrcution.setCallback = function(prop, cb) {
  let data = this.data.get(prop)
  if (data) {
    cb(data)
  } else {
    let list = this.callback.get(prop)
    if (!list) {
      list = []
    }
    list.push(cb)
    this.callback.set(prop, list)
  }
}

instrcution.triggerCallback = function(prop) {
  let list = this.callback.get(prop)
  if (list) {
    let data = this.data.get(prop)
    for (let i = 0; i < list.length; i++) {
      const cb = list[i]
      cb(data)
    }
    this.callback.set(prop, [])
  }
}

instrcution.get = function(prop, type) {
  if (this.getShow()) {
    let data = this.data.get(prop)
    if (data) {
      return data.getData(type)
    } else {
      console.error(`instrcution不存在${prop}说明，请检查代码`)
      return null
    }
  }
}

instrcution.init()

export default instrcution
