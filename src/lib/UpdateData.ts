import { isPromise } from 'complex-utils'
import DefaultData, { DefaultDataInitOption } from './../data/DefaultData'
import BaseData from '../data/BaseData'
// import { StatusItemInitOption } from './StatusItem'
import config from '../../config'
import { formatInitOption } from '../utils'

/**
 * 需要设置methods: trigger,其中的next必须需要调用
*/

export type offsetObjectType = {
  start?: number,
  data: number
}

export type offsetType = number | offsetObjectType

type triggerType<P extends undefined | BaseData<any> = BaseData> = (next: UpdateData<P>["$next"], index: number) => void
type getOffsetType = (offset: number, currentNumber: number) => number
type checkType = (currentNumber: number) => boolean | Promise<any>

export interface UpdateDataInitOption<P extends undefined | BaseData<any> = BaseData> extends DefaultDataInitOption<P> {
  offset?: offsetType,
  trigger?: triggerType<P>,
  getOffset?: getOffsetType,
  check?: checkType
}

class UpdateData<P extends undefined | BaseData<any> = BaseData> extends DefaultData<P> {
  static $name = 'UpdateData'
  load: {
    update: boolean
    operate: boolean
    immerdiate: boolean
  }
  num: number
  offset: {
    start: number,
    data: number
  }
  timer: undefined | number
  trigger?: triggerType<P>
  constructor(initOption: UpdateDataInitOption<P>) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('UpdateData', 'beforeCreate', initOption)
    this.trigger = initOption.trigger
    if (initOption.getOffset) {
      this.getOffset = initOption.getOffset
    }
    if (initOption.check) {
      this.check = initOption.check
    }
    this.load = {
      update: false, // 更新状态判断值，true说明update正在进行中，此时每间隔一段时间则进行触发操作
      operate: false, // 触发操作判断值，true说明trigger正在进行中
      immerdiate: false // 立即同步操作判断值，true说明正在进行强制同步操作
    }
    this.num = 0
    this.timer = undefined
    if (typeof initOption.offset != 'object') {
      const offsetData = initOption.offset === undefined ? config.UpdateData.offset : initOption.offset
      this.offset = {
        start: offsetData,
        data: offsetData
      }
    } else {
      const offsetData = initOption.offset.data === undefined ? config.UpdateData.offset : initOption.offset.data
      this.offset = {
        start: offsetData,
        data: initOption.offset.start === undefined ? offsetData : initOption.offset.start
      }
    }
    this.$next = this.$next.bind(this as UpdateData<any>)
    this.$triggerCreateLife('UpdateData', 'created')
  }
  /**
   * 获取间隔
   * @param {number} offset 间隔
   * @param {number} currentNumber 当前次数
   * @returns {number}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getOffset(offset: number, currentNumber: number): number {
    return offset
  }
  /**
   * 触发计数并获取间隔
   * @param {number} offset 间隔
   * @returns {number}
   */
  countOffset(offset: number) {
    return this.getOffset(offset, this.countNum())
  }
  /**
   * 检查下一步是否继续，next判断
   * @param {number} currentNumber 当前次数
   * @returns {boolean}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  check(currentNumber: number): boolean | Promise<any> {
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
      offset = this.offset.start
    }
    // 设置更新状态为更新中
    this.load.update = true
    this.$check(offset)
  }
  /**
   * 通过判断update判读是否设定触发
   * @param {number} offset 指定间隔，不存在读取默认
   */
  $check(offset?: number) {
    if (this.load.update) {
      this.$start(offset)
    } else {
      this.clear()
    }
  }
  $trigger(next: UpdateData<P>["$next"], index: number) {
    if (this.trigger) {
      this.trigger(next, index)
    } else {
      const parent = this.$getParent()
      if (parent && parent instanceof BaseData) {
        parent.$loadUpdateData().then(() => {
          this.$next()
        }).catch(() => {
          this.$next()
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
      offset = this.offset.data
    }
    this.timer = setTimeout(() => {
      // 准备开始trigger操作
      this.load.operate = true
      this.$triggerLife('beforeTrigger', this, offset)
      this.$trigger(this.$next, this.getNum())
    }, this.countOffset(offset)) as unknown as number
  }
  /**
   * 继续进行下一次回调
   * @param {number} offset 指定间隔，不存在读取默认
   */
  $next(this: UpdateData<P>, offset?: false | number) {
    // trigger结束
    this.load.operate = false
    this.$triggerLife('triggered', this, offset)
    if (this.load.update && !this.load.immerdiate) {
      if (offset !== false) {
        const checkRes = this.check(this.getNum())
        if (offset === undefined) {
          offset = this.offset.data
        }
        if (isPromise(checkRes)) {
          checkRes.then(() => {
            this.$check(offset as number)
          }).catch(err => {
            this.$exportMsg('stop next!', 'log', { data: err })
            this.clear()
          })
        } else if (checkRes) {
          this.$check(offset)
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
  updateImmerdiate() {
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
  getNum() {
    return this.num
  }
  /**
   * 当前次数+1
   */
  countNum() {
    this.num++
    return this.num
  }
  /**
   * 重置当前次数
   */
  resetNum() {
    this.num = 0
  }
  /**
   * 重置
   */
  reset() {
    this.clear()
    this.resetNum()
  }
  $reset(option?: boolean) {
    if (option !== false) {
      this.reset()
    }
  }
  $destroy(option?: boolean) {
    if (option !== false) {
      this.$reset(option)
    }
  }
  // $installUpdate(target: P extends BaseData ? P : BaseData) {
  //   target!.$initLoadDepend()
  //   if (!target!.$module.status?.getItem('update')) {
  //     target!.$module.status?.addData('update', config.StatusData.data.update as StatusItemInitOption)
  //   }
  // }
  // $install(target: P extends BaseData ? P : BaseData, from?: string) {
  //   super.$install(target!)
  //   if (from === 'init') {
  //     // 加载中的数据在加载完成后再进行调用，避免module还未实例化的问题
  //     // 鉴于当前target为BaseData实例，因此自动触发为BaseData实例加载完成时触发，避免后续需要数据时的BUG
  //     target!.$onLife('BaseDataCreated', {
  //       once: true,
  //       data: () => {
  //         this.$installUpdate(target)
  //       }
  //     })
  //   } else {
  //     this.$installUpdate(target)
  //   }
  // }
  // $uninstall(target: P extends BaseData ? P : BaseData, from?: string) {
  //   super.$uninstall(target!)
  //   if (target!.$module.status?.getItem('update')) {
  //     target!.$module.status?.removeData('update')
  //   }
  // }
}

export default UpdateData
