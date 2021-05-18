import _func from 'complex-func'
import InstrcutionData from './../mod/InstrcutionData'

let instrcution = {
  show: true,
  data: new Map()
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
    this.data.set(instrcutionData.prop, new InstrcutionData(instrcutionData, this.data))
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
