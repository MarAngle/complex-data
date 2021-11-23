import _func from 'complex-func'
import config from '../../config'
import DefaultDataWithLife from './../data/DefaultDataWithLife'
/**
 * 需要设置methods: trigger,其中的next必须需要调用
*/

class UpdateData extends DefaultDataWithLife {
  constructor (initOption = {}) {
    super(initOption)
    this.triggerCreateLife('UpdateData', 'beforeCreate', initOption)
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
    this._initMain(initOption)
    this.triggerCreateLife('UpdateData', 'created')
  }
  _initMain (initOption = {}) {
    this.setOffset(initOption.offset)
  }
  setOffset (offset) {
    let type = _func.getType(offset)
    if (type !== 'object') {
      offset = {
        data: offset
      }
    }
    this.offset.data = offset.data === undefined ? config.UpdateData.offset : offset.data
    this.offset.start = offset.start === undefined ? offset.data : offset.start
  }
  /**
   * 获取间隔
   * @param {number} offset 间隔
   * @param {number} currentnum 当前次数
   * @returns {number}
   */
  getOffset (offset, currentnum) {
    return offset
  }
  /**
   * 触发计数并获取间隔
   * @param {number} offset 间隔
   * @returns {number}
   */
  triggerGetOffset (offset) {
    this.countNum()
    return this.getOffset(offset, this.getNum())
  }
  /**
   * 检查下一步是否继续，next判断
   * @param {number} currentnum 当前次数
   * @returns {boolean}
   */
  check (currentnum) {
    return true
  }
  /**
   * 清除定时器
   * @param {boolean} next 不存在下一步时设置更新状态为停止更新
   */
  clear (next) {
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
  autoStart (offset) {
    if (!this.timer) {
      this.start(offset)
    }
  }
  /**
   * 开始定时器
   * @param {number} offset 指定间隔，不存在读取默认
   */
  start (offset) {
    if (offset === undefined) {
      offset = this.offset.start
    }
    // 设置更新状态为更新中
    this.load.update = true
    this.checkAndStartTrigger(offset)
  }
  /**
   * 通过判断update判读是否设定触发
   * @param {number} offset 指定间隔，不存在读取默认
   */
  checkAndStartTrigger (offset) {
    if (this.load.update) {
      this.startTrigger(offset)
    } else {
      this.clear()
    }
  }
  /**
   * 设定触发
   * @param {number} offset 指定间隔，不存在读取默认
   */
  startTrigger(offset) {
    this.clear(true)
    this.load.immerdiate = false
    if (offset === undefined) {
      offset = this.offset.data
    }
    this.timer = setTimeout(() => {
      // 准备开始trigger操作
      this.load.operate = true
      this.triggerLife('beforeTrigger', this, offset)
      this.trigger(this.triggerNext.bind(this), this.getNum())
    }, this.triggerGetOffset(offset))
  }
  /**
   * 继续进行下一次回调
   * @param {number} offset 指定间隔，不存在读取默认
   */
   triggerNext (offset) {
    // trigger结束
    this.load.operate = false
    this.triggerLife('triggered', this, offset)
    if (this.load.update && !this.load.immerdiate) {
      if (offset !== false) {
        let checkRes = this.check(this.getNum())
        if (offset === undefined) {
          offset = this.offset.data
        }
        if (_func.isPromise(checkRes)) {
          checkRes.then(() => {
            this.checkAndStartTrigger(offset)
          }, err => {
            this.$exportMsg('stop next!', 'log', { data: err })
            this.clear()
          })
        } else if (checkRes) {
          this.checkAndStartTrigger(offset)
        } else {
          this.clear()
        }
      } else {
        this.clear()
      }
    } else if (this.load.immerdiate) {
      this.startTrigger(0)
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
      this.startTrigger(0)
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
  install (target) {
    target.onLife('reseted', {
      id: this.$getId('Reseted'),
      data: (instantiater, resetOption) => {
        if (target.parseResetOption(resetOption, 'update') !== false) {
          this.reset()
        }
      }
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
  uninstall(target) {
    target.offLife('reseted', this.$getId('Reseted'))
  }
}

UpdateData.$name = 'UpdateData'

export default UpdateData
