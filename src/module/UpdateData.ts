import { isPromise } from 'complex-utils'
import DefaultData, { DefaultDataInitOption } from '../data/DefaultData'
import BaseData from '../data/BaseData'
import config from '../../config'

export type triggerType = (next: UpdateData["next"], index: number) => void

type getOffsetType = (offset: number, index: number) => number

export type checkType = (index: number) => boolean | Promise<unknown>

export interface UpdateDataInitOption extends DefaultDataInitOption {
  offset?: number
  trigger?: triggerType
  getOffset?: getOffsetType
  check?: checkType
}

class UpdateData extends DefaultData {
  static $name = 'UpdateData'
  load: {
    update: boolean
    operate: boolean
    immerdiate: boolean
  }
  index: number
  offset: number
  timer: undefined | number
  trigger?: triggerType
  constructor(initOption: UpdateDataInitOption) {
    super(initOption)
    this._triggerCreateLife('UpdateData', 'beforeCreate', initOption)
    this.load = {
      update: false, // 更新状态判断值，true说明update正在进行中，此时每间隔一段时间则进行触发操作
      operate: false, // 触发操作判断值，true说明trigger正在进行中
      immerdiate: false // 立即同步操作判断值，true说明正在进行强制同步操作
    }
    this.index = 0
    this.timer = undefined
    this.trigger = initOption.trigger
    if (initOption.getOffset) {
      this.getOffset = initOption.getOffset
    }
    if (initOption.check) {
      this.check = initOption.check
    }
    this.offset = initOption.offset === undefined ? config.update.offset : initOption.offset
    this.next = this.next.bind(this as UpdateData)
    this._triggerCreateLife('UpdateData', 'created')
  }
  /**
   * 获取间隔
   * @param {number} offset 间隔
   * @param {number} index 当前次数
   * @returns {number}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getOffset(offset: number, index: number): number {
    return offset
  }
  /**
   * 触发计数并获取间隔
   * @param {number} offset 间隔
   * @returns {number}
   */
  protected _countOffset(offset: number) {
    return this.getOffset(offset, this._getIndexByCount())
  }
  /**
   * 检查下一步是否继续，next判断
   * @param {number} index 当前次数
   * @returns {boolean}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected check(index: number): boolean | Promise<unknown> {
    return true
  }
  /**
   * 清除定时器
   * @param {boolean} next 不存在下一步时设置更新状态为停止更新
   */
  clear(next?: boolean, unTriggerSync?: boolean) {
    if (!next) {
      // 不存在下一步时设置更新状态为停止更新
      this.load.update = false
    }
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
    if (!unTriggerSync) {
      this.$syncData(true, 'clear')
    }
  }
  /**
   * 开始定时器
   * @param {number} offset 指定间隔，不存在读取默认
   */
  start(force?: boolean, offset?: number) {
    if (this.timer) {
      if (!force) {
        return
      }
      // this.clear(true)
      // 在$start阶段会再次调用此函数，此处无需重复调用
    }
    if (offset === undefined) {
      offset = this.offset
    }
    // 设置更新状态为更新中
    this.load.update = true
    this._triggerStart(offset)
  }
  /**
   * 通过判断update判读是否设定触发
   * @param {number} offset 指定间隔，不存在读取默认
   */
  protected _triggerStart(offset?: number) {
    if (this.load.update) {
      this.$start(offset)
    } else {
      // 当update为否时说明主动取消了更新
      this.clear()
    }
  }
  protected _trigger(next: UpdateData["next"], index: number) {
    if (this.trigger) {
      this.trigger(next, index)
    } else {
      const parent = this.$getParent()
      if (parent && parent instanceof BaseData) {
        parent.$loadUpdateData(true).then(() => {
          this.next()
        }).catch(() => {
          this.next()
        })
      } else {
        this.$exportMsg('触发更新函数未定义!', 'error')
      }
    }
  }
  /**
   * 设定触发
   * @param {number} offset 指定间隔，不存在读取默认
   */
  $start(offset?: number) {
    this.clear(true)
    this.load.immerdiate = false
    if (offset === undefined) {
      offset = this.offset
    }
    this.timer = setTimeout(() => {
      // 准备开始trigger操作
      this.load.operate = true
      this.$triggerLife('beforeTrigger', this, offset)
      this._trigger(this.next, this.getIndex())
    }, this._countOffset(offset)) as unknown as number
  }
  /**
   * 继续进行下一次回调
   * @param {number} offset 指定间隔，不存在读取默认
   */
  next(this: UpdateData, offset?: false | number) {
    // trigger结束
    this.load.operate = false
    this.$triggerLife('triggered', this, offset)
    if (this.load.update && !this.load.immerdiate) {
      if (offset !== false) {
        const checkRes = this.check(this.getIndex())
        if (offset === undefined) {
          offset = this.offset
        }
        if (isPromise(checkRes)) {
          checkRes.then(() => {
            this._triggerStart(offset as number)
          }).catch(err => {
            this.$exportMsg('stop update!', 'log')
            console.error(err)
            this.clear()
          })
        } else if (checkRes) {
          this._triggerStart(offset)
        } else {
          this.clear()
        }
      } else {
        this.clear()
      }
    } else if (this.load.immerdiate) {
      this.$start(0)
    }
  }
  /**
   * 立刻进行数据更新
   */
  immerdiate() {
    // 正在更新中的在更新完成直接触发下一次更新
    if (this.load.operate) {
      this.load.immerdiate = true
    } else {
      // 不在更新中直接触发下一次更新
      this.$start(0)
    }
  }
  /**
   * 获取当前次数，包括已设置被删除的数量
   * @returns {number}
   */
  getIndex() {
    return this.index
  }
  /**
   * 当前次数+1
   */
  private _getIndexByCount() {
    this.index++
    return this.index
  }
  /**
   * 重置当前次数
   */
  resetIndex() {
    this.index = 0
  }
  $reset(option?: boolean) {
    if (option !== false) {
      this.clear()
      this.resetIndex()
    }
  }
  $destroy(option?: boolean) {
    if (option !== false) {
      this.$reset(option)
    }
  }
}

export default UpdateData
