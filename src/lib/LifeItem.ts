/* eslint-disable @typescript-eslint/no-explicit-any */
import { getType, isArray } from 'complex-utils'
import IdData from './IdData'
import Data from '../data/Data'
import { formatInitOption } from '../utils'

const lifeId = new IdData({
  list: [
    {
      type: 'time'
    },
    {
      type: 'id'
    }
  ]
})

export type idType = string | number | symbol

type LifeItemDataFunction = (...args: any[]) => any

export interface LifeItemDataObject {
  id?: idType,
  data: LifeItemDataFunction,
  index?: number,
  replace?: boolean,
  immediate?: boolean,
  once?: boolean
}

export type LifeItemDataType = LifeItemDataFunction | LifeItemDataObject

export interface LifeItemInitOption {
  name: string,
  data?: LifeItemDataType | LifeItemDataType[]
}

class LifeItem extends Data {
  static $name = 'LifeItem'
  name: string;
  data: Map<idType, LifeItemDataObject>
  constructor(initOption: LifeItemInitOption) {
    initOption = formatInitOption(initOption)
    super()
    this.name = initOption.name
    this.data = new Map()
    if (initOption.data) {
      this.build(initOption.data)
    }
  }
  /**
   * 设置生命周期对应函数回调
   * @param {object} data 参数
   */
  $pushData(data: LifeItemDataObject) {
    if (data.index === undefined) {
      this.data.set(data.id!, data)
    } else {
      const size = this.data.size
      if (data.index < size) {
        const mapList: LifeItemDataObject[] = []
        this.data.forEach(function (value) {
          mapList.push(value)
        })
        this.data.clear()
        for (let n = 0; n < size; n++) {
          const mapItem = mapList[n]
          if (data.index === n) {
            this.data.set(data.id!, data)
          }
          this.data.set(mapItem.id!, mapItem)
        }
      } else {
        this.data.set(data.id!, data)
      }
    }
  }
  /**
   * build
   * @param {*} data
   * @returns {string} id
   */
  build(data?: LifeItemDataType | LifeItemDataType[]) {
    let resId
    if (data) {
      const dataIsArray = isArray(data)
      if (dataIsArray) {
        resId = []
        for (let n = 0; n < data.length; n++) {
          resId.push(this.$formatData(data[n]))
        }
      } else {
        resId = this.$formatData(data)
      }
    }
    return resId
  }
  /**
   * 格式化数据
   * @param {object| function} data 回调参数
   * @returns {boolean}next
   */
  $formatData(data: LifeItemDataType): idType | undefined {
    const dataType = getType(data)
    let next = true
    if (dataType === 'function') {
      data = {
        data: data as LifeItemDataFunction
      }
    } else if (dataType !== 'object') {
      next = false
    }
    if (next) {
      if ((<LifeItemDataObject>data).data) {
        if (!(<LifeItemDataObject>data).id) {
          (<LifeItemDataObject>data).id = lifeId.getData()
        }
        if (this.data.has((<LifeItemDataObject>data).id!) && !(<LifeItemDataObject>data).replace) {
          this.$exportMsg(`存在当前值:${String((<LifeItemDataObject>data).id)}`)
        } else {
          this.$pushData(<LifeItemDataObject>data)
          if ((<LifeItemDataObject>data).immediate) {
            this.emit((<LifeItemDataObject>data).id!)
          }
          return (<LifeItemDataObject>data).id
        }
      } else {
        this.$exportMsg(`设置(${String((<LifeItemDataObject>data).id) || '-'})未定义func`)
      }
    } else {
      this.$exportMsg(`设置data参数需要object或者function`)
    }
    return undefined
  }
  /**
   * 触发函数
   * @param  {...any} args 参数
   */
  trigger(...args: any[]) {
    for (const id of this.data.keys()) {
      this.emit(id, ...args)
    }
  }
  /**
   * 触发指定id的回调
   * @param {string} id id
   * @param  {...any} args 参数
   */
  emit(id: idType, ...args: any[]) {
    const data = this.data.get(id)
    if (data && data.data) {
      data.data(...args)
      if (data.once) {
        this.off(id)
      }
    } else {
      this.$exportMsg(`不存在当前值(${String(id)})`)
    }
  }
  /**
   * 删除指定id的生命周期
   * @param {string} id id
   * @returns {boolean}
   */
  off(id: idType) {
    return this.data.delete(id)
  }
  /**
   * 清除所有回调
   */
  clear() {
    this.data.clear()
  }
  /**
   * 重置
   */
  reset() {
    this.clear()
  }
  /**
   * 销毁
   */
  destroy() {
    this.reset()
  }
  $selfName() {
    return `${super.$selfName()}-NAME:${this.name}`
  }
}

export default LifeItem
