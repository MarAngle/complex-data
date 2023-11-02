import Data from '../data/Data'

type  PromiseDataValueType = {
  [prop: PropertyKey]: Promise<unknown>
}

export type PromiseOptionType = {
  correct?: 'reload'
  emptySuccess?: boolean
  emptyMsg?: string
}

export interface PromiseDataInitData {
  data?:  PromiseDataValueType
}

class PromiseData extends Data {
  static $name = 'PromiseData'
  data:  PromiseDataValueType
  constructor(initOption?: PromiseDataInitData) {
    super()
    this.data = {}
    if (initOption) {
      this.$initData(initOption.data)
    }
  }
  /**
   * 加载数据
   * @param {*} data 数据
   */
  $initData(data:  PromiseDataValueType = {}) {
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
  setData(prop: PropertyKey, data: Promise<unknown>) {
    this.data[prop] = data
    return data
  }
  /**
   * 获取Promise数据
   * @param {string} prop 属性
   * @returns {Promise}
   */
  getData(prop: PropertyKey) {
    return this.data[prop]
  }
  /**
   * 触发Promise
   * @param {string} prop 属性
   * @param {object} [option] 设置
   * @param {object} [option.correct = 'reload'] '' 不做判断 'reload' 以新Promise为基准重新触发 'reject' 走失败逻辑
   * @returns {Promise}
   */
  triggerData(prop: PropertyKey, option: PromiseOptionType = {}) {
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
          } else if (option.correct === 'reload') {
            this.triggerData(prop, option).then(res => {
              resolve(res)
            }).catch(err => {
              reject(err)
            })
          } else {
            // reject
            reject({ status: 'fail', code: 'repeat' })
          }
        }).catch(err => {
          reject(err)
        })
      } else if (!option.emptySuccess) {
        if (option.emptyMsg) {
          console.error(option.emptyMsg)
        }
        reject({ status: 'fail', code: 'empty' })
      } else {
        resolve({ status: 'success', code: 'empty' })
      }
    })
  }
  $reset(option?: boolean) {
    if (option !== false) {
      for (const prop in this.data) {
        delete this.data[prop]
      }
    }
  }
  $destroy(option?: boolean) {
    if (option !== false) {
      this.$reset(option)
    }
  }
}

export default PromiseData
