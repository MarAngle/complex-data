import SimpleData from './../data/SimpleData'

class PromiseData extends SimpleData {
  constructor (initdata) {
    super()
    this.data = {}
    if (initdata) {
      this.initMain(initdata)
    }
  }
  initMain (initdata = {}) {
    this.initData(initdata.data)
  }
  initData (data = {}) {
    for (let n in data) {
      this.setData(n, data[n])
    }
  }
  setData (prop, data, option = {}) {
    this.data[prop] = data
    return this.getData(prop)
  }
  getData (prop) {
    return this.data[prop]
  }
  triggerData (prop, option = {}) {
    return new Promise((resolve, reject) => {
      if (option.correct === undefined) {
        option.correct = 'reload' // '' 不做判断 'reload' 以新Promise为基准重新触发 'reject' 走失败逻辑
      }
      let data = this.getData(prop)
      if (data) {
        data.then(res => {
          // 判断Promise一致性，一致则说明就的Promise期间生成了新的Promise
          let currentData = this.getData(prop)
          if (data === currentData || !option.correct) {
            resolve(res)
          } else if (option.correct == 'reload') {
            this.triggerData(prop, option).then(res => {
              resolve(res)
            }, err => {
              reject(err)
            })
          } else {
            // reject
            reject({ status: 'fail', code: 'promiseRepeat' })
          }
        }, err => {
          reject(err)
        })
      } else {
        if (option.errmsg) {
          console.error(option.errmsg)
        }
        reject({ status: 'fail', code: 'noPromise' })
      }
    })
  }
}

export default PromiseData
