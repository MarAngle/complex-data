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
      let data = this.getData(prop)
      if (data) {
        data.then(res => {
          resolve(res)
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
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'SimpleData',
        describe: 'promise数据格式',
        build: [
          {
            prop: 'initdata',
            type: 'object',
            describe: '加载数据',
            data: [
              {
                prop: 'data',
                type: 'object',
                describe: 'promise设置数据(key=>value)'
              }
            ]
          }
        ],
        data: [
          {
            prop: 'data',
            type: 'object',
            describe: 'promise数据保存位置'
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

PromiseData.initInstrcution()

export default PromiseData
