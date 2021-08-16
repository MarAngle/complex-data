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
      update: false, // 更新状态判断值，true说明update正在进行中
      operate: false // 触发操作判断值。true说明trigger正在进行中
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
   * 开始定时器
   * @param {number} offset 指定间隔，不存在读取默认
   */
  start (offset) {
    if (offset === undefined) {
      offset = this.offset.start
    }
    // 设置更新状态为更新中
    this.load.update = true
    this.nextDo(offset)
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
   * 通过判断update判读是否继续更新
   * @param {number} offset 指定间隔，不存在读取默认
   */
  nextDo (offset) {
    if (this.load.update) {
      this.clear(true)
      if (offset === undefined) {
        offset = this.offset.data
      }
      this.timer = setTimeout(() => {
        // 准备开始trigger操作
        this.operate = true
        this.trigger(this.next.bind(this), this.getNum())
      }, this.triggerGetOffset(offset))
    } else {
      this.clear()
    }
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
   * 继续进行下一次回调
   * @param {number} offset 指定间隔，不存在读取默认
   */
  next (offset) {
    if (this.load.update) {
      this.operate = false
      if (offset !== false) {
        let checkCb = this.check(this.getNum())
        if (offset === undefined) {
          offset = this.offset.data
        }
        if (_func.isPromise(checkCb)) {
          checkCb.then(() => {
            this.nextDo(offset)
          }, err => {
            this.printMsg('stop next!', 'log', { data: err })
          })
        } else if (checkCb) {
          this.nextDo(offset)
        }
      } else {
        this.clear()
      }
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
      id: this.$getModuleId('Reseted'),
      data: (resetOption) => {
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
    target.offLife('reseted', this.$getModuleId('Reseted'))
  }
}

UpdateData._name = 'UpdateData'

export default UpdateData
