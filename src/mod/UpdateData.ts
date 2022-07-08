import $func from 'complex-func'
import config from '../../config'
import { anyFunction } from '../../ts'
import BaseData from '../data/BaseData'
import { formatInitOption } from '../utils'
import DefaultData, { DefaultDataInitOption } from './../data/DefaultData'
/**
 * 需要设置methods: trigger,其中的next必须需要调用
*/


export type offsetObjectType = {
  start?: number,
  data: number
}

export type offsetType = number | offsetObjectType


type triggerType = (func: UpdateData["$triggerNext"], index: number) => void

export interface UpdateDataInitOption extends DefaultDataInitOption {
  offset?: offsetType,
  methods: {
    trigger: triggerType,
    [prop: string]: anyFunction
  }
}

class UpdateData extends DefaultData {
  load: {
    update: boolean
    operate: boolean
    immerdiate: boolean
  }
  current: {
    num: number
  }
  offset: {
    start: number,
    data: number
  }
  timer: undefined | number
  trigger!: triggerType
  constructor (initOption: UpdateDataInitOption) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('UpdateData', 'beforeCreate', initOption)
    this.load = {
      update: false, // 更新状态判断值，true说明update正在进行中，此时每间隔一段时间则进行触发操作
      operate: false, // 触发操作判断值，true说明trigger正在进行中
      immerdiate: false // 立即同步操作判断值，true说明正在进行强制同步操作
    }
    this.current = {
      num: 0
    }
    this.timer = undefined
    this.offset = {
      start: config.UpdateData.offset,
      data: config.UpdateData.offset
    }
    this.setOffset(initOption.offset)
    this.$triggerCreateLife('UpdateData', 'created')
  }
  setOffset (offset?: offsetType) {
    const type = $func.getType(offset)
    if (type !== 'object') {
      offset = {
        data: offset as number
      }
    }
    this.offset.data =( offset as offsetObjectType).data === undefined ? config.UpdateData.offset :( offset as offsetObjectType).data
    this.offset.start =( offset as offsetObjectType).start === undefined ?(offset as offsetObjectType).data! :( offset as offsetObjectType).start!
  }
  /**
   * 获取间隔
   * @param {number} offset 间隔
   * @param {number} currentnum 当前次数
   * @returns {number}
   */
  getOffset (offset: number, currentnum: number) {
    return offset
  }
  /**
   * 触发计数并获取间隔
   * @param {number} offset 间隔
   * @returns {number}
   */
  triggerGetOffset (offset: number) {
    this.countNum()
    return this.getOffset(offset, this.getNum())
  }
  /**
   * 检查下一步是否继续，next判断
   * @param {number} currentnum 当前次数
   * @returns {boolean}
   */
  check (currentnum: number): boolean | Promise<any> {
    return true
  }
  /**
   * 清除定时器
   * @param {boolean} next 不存在下一步时设置更新状态为停止更新
   */
  clear (next?: boolean) {
    if (!next) {
      // 不存在下一步时设置更新状态为停止更新
      this.load.update = false
    }
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }
  /**
   * 自动开始，当前存在定时器不操作，不存在时则开始
   * @param {number} offset 指定间隔，不存在读取默认
   */
  autoStart (offset?: number) {
    if (!this.timer) {
      this.start(offset)
    }
  }
  /**
   * 开始定时器
   * @param {number} offset 指定间隔，不存在读取默认
   */
  start (offset?: number) {
    if (offset === undefined) {
      offset = this.offset.start
    }
    // 设置更新状态为更新中
    this.load.update = true
    this.$checkAndStartTrigger(offset)
  }
  /**
   * 通过判断update判读是否设定触发
   * @param {number} offset 指定间隔，不存在读取默认
   */
  $checkAndStartTrigger (offset?: number) {
    if (this.load.update) {
      this.$startTrigger(offset)
    } else {
      this.clear()
    }
  }
  /**
   * 设定触发
   * @param {number} offset 指定间隔，不存在读取默认
   */
  $startTrigger(offset?: number) {
    this.clear(true)
    this.load.immerdiate = false
    if (offset === undefined) {
      offset = this.offset.data
    }
    this.timer = setTimeout(() => {
      // 准备开始trigger操作
      this.load.operate = true
      this.triggerLife('beforeTrigger', this, offset)
      this.trigger(this.$triggerNext.bind(this), this.getNum())
    }, this.triggerGetOffset(offset)) as unknown as number
  }
  /**
   * 继续进行下一次回调
   * @param {number} offset 指定间隔，不存在读取默认
   */
   $triggerNext (offset?: false | number) {
    // trigger结束
    this.load.operate = false
    this.triggerLife('triggered', this, offset)
    if (this.load.update && !this.load.immerdiate) {
      if (offset !== false) {
        const checkRes = this.check(this.getNum())
        if (offset === undefined) {
          offset = this.offset.data
        }
        if ($func.isPromise(checkRes)) {
          (checkRes as Promise<any>).then(() => {
            this.$checkAndStartTrigger(offset as number)
          }, err => {
            this.$exportMsg('stop next!', 'log', { data: err })
            this.clear()
          })
        } else if (checkRes) {
          this.$checkAndStartTrigger(offset)
        } else {
          this.clear()
        }
      } else {
        this.clear()
      }
    } else if (this.load.immerdiate) {
      this.$startTrigger(0)
    }
  }
  /**
   * 立刻进行数据更新
   */
  updateImmerdiate() {
    // 正在更新中的在更新完成直接触发下一次更新
    if (this.load.operate) {
      this.load.immerdiate = true
    } else {
      // 不在更新中直接触发下一次更新
      this.$startTrigger(0)
    }
  }
  /**
   * 获取当前次数，包括已设置被删除的数量
   * @returns {number}
   */
  getNum () {
    return this.current.num
  }
  /**
   * 当前次数+1
   */
  countNum () {
    this.current.num++
  }
  /**
   * 重置当前次数
   */
  resetNum () {
    this.current.num = 0
  }
  /**
   * 重置
   */
  reset () {
    this.clear()
    this.resetNum()
  }
  /**
   * 模块加载
   * @param {object} target 加载到的目标
   */
  install (target: BaseData) {
    target.onLife('reseted', {
      id: this.$getId('Reseted'),
      data: (instantiater, resetOption) => {
        if (target.$parseResetOption(resetOption, 'update') !== false) {
          this.reset()
        }
      }
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
  uninstall(target: BaseData) {
    target.offLife('reseted', this.$getId('Reseted'))
  }
}

UpdateData.$name = 'UpdateData'

export default UpdateData
