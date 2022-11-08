import Data from './../data/Data'

type dataType = {
  [prop: PropertyKey]: Promise<any>
}

type optionType = {
  correct?: 'reload',
  errmsg?: string
}

export interface PromiseDataInitData {
  data?: dataType
}

class PromiseData extends Data {
  data: dataType
  constructor (initOption?: PromiseDataInitData) {
    super()
    this.data = {}
    if (initOption) {
      this.$initMain(initOption)
    }
  }
  /**
   * 加载
   * @param {*} initOption 参数
   */
  $initMain (initOption: PromiseDataInitData = {}) {
    this.$initData(initOption.data)
  }
  /**
   * 加载数据
   * @param {*} data 数据
   */
  $initData (data: dataType = {}) {
    for (const n in data) {
      this.setData(n, data[n])
    }
  }
  /**
   * 设置Promise并返回
   * @param {string} prop 属性
   * @param {Promise} data Promise数据
   * @returns {Promise}
   */
  setData (prop: PropertyKey, data: Promise<any>) {
    this.data[prop] = data
    return this.getData(prop)
  }
  /**
   * 获取Promise数据
   * @param {string} prop 属性
   * @returns {Promise}
   */
  getData (prop: PropertyKey) {
    return this.data[prop]
  }
  /**
   * 触发Promise
   * @param {string} prop 属性
   * @param {object} [option] 设置
   * @param {object} [option.correct = 'reload'] '' 不做判断 'reload' 以新Promise为基准重新触发 'reject' 走失败逻辑
   * @returns {Promise}
   */
  triggerData (prop: PropertyKey, option:optionType = {}) {
    return new Promise((resolve, reject) => {
      if (option.correct === undefined) {
        option.correct = 'reload' // '' 不做判断 'reload' 以新Promise为基准重新触发 'reject' 走失败逻辑
      }
      const data = this.getData(prop)
      if (data) {
        data.then(res => {
          // 判断Promise一致性，一致则说明就的Promise期间生成了新的Promise
          const currentData = this.getData(prop)
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

PromiseData.$name = 'PromiseData'

export default PromiseData
