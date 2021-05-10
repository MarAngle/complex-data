import _func from 'complex-func'
import DefaultData from './../data/DefaultData'
/**
 * 需要设置methods: trigger
*/

class UpdateData extends DefaultData {
  constructor (initdata = {}) {
    super(initdata)
    this.triggerCreateLife('UpdateData', 'beforeCreate', initdata)
    this.current = {
      num: 0
    }
    this.timer = undefined
    this.offset = {
      start: 1000,
      data: 1000
    }
    this._initMain(initdata)
    this.triggerCreateLife('UpdateData', 'created')
  }
  _initMain (initdata = {}) {
    this.setOffset(initdata.offset)
  }
  setOffset (offset) {
    let type = _func.getType(offset)
    if (type !== 'object') {
      offset = {
        data: offset
      }
    }
    this.offset.data = offset.data === undefined ? 1000 : offset.data
    this.offset.start = offset.start === undefined ? offset.data : offset.start
  }
  // 获取间隔
  getOffset (offset, currentnum) {
    return offset
  }
  // 触发获取间隔
  triggerGetOffset (offset) {
    this.countNum()
    return this.getOffset(offset, this.getNum())
  }
  // 清除定时器
  clear () {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
  }
  // 开始定时器
  start (offset) {
    if (offset === undefined) {
      offset = this.offset.start
    }
    this.nextDo(offset)
  }
  // 自动开始，当前存在定时器不操作，不存在时则开始
  autoStart (offset) {
    if (!this.timer) {
      this.start(offset)
    }
  }
  // nextDo
  nextDo (offset) {
    this.clear()
    if (offset === undefined) {
      offset = this.offset.data
    }
    this.timer = setTimeout(() => {
      this.trigger(this.getNum(), this.next.bind(this))
    }, this.triggerGetOffset(offset))
  }
  // 检查下一步是否继续，next判断
  check (currentnum) {
    return true
  }
  // 继续进行下一次回调
  next (offset) {
    let checkCb = this.check(this.getNum())
    if (offset === undefined) {
      offset = this.offset.data
    }
    if (_func.isPromise(checkCb)) {
      checkCb.then(() => {
        this.nextDo(offset)
      }, err => {
        this.printInfo('stop next', 'log', err)
      })
    } else if (checkCb) {
      this.nextDo(offset)
    }
  }
  // 获取当前次数，包括以设置被删除的数量
  getNum () {
    return this.current.num
  }
  // 当前次数+1
  countNum () {
    this.current.num++
  }
  // 重置当前次数
  resetNum () {
    this.current.num = 0
  }
  // 重置
  reset () {
    this.clear()
    this.resetNum()
  }
  install (target) {
    target.onLife('reseted', {
      id: this.$getModuleName('Reseted'),
      data: (resetModule) => {
        if (target.analyzeResetModule(resetModule, 'update') !== false) {
          this.reset()
        }
      }
    })
  }
  uninstall(target) {
    target.offLife('reseted', this.$getModuleName('Reseted'))
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'DefaultData',
        describe: '更新数据格式',
        build: [
          {
            prop: 'initdata',
            extend: true,
            data: [
              {
                prop: 'offset',
                type: 'object/number',
                describe: '间隔设置数据',
                data: [
                  {
                    prop: 'data',
                    type: 'number',
                    describe: '时间间隔'
                  },
                  {
                    prop: 'start',
                    type: 'number',
                    describe: '第一次触发间隔'
                  }
                ]
              }
            ]
          }
        ],
        data: [
          {
            prop: 'current',
            type: 'object',
            describe: '当前次数保存位置',
            data: [
              {
                prop: 'num',
                type: 'number',
                describe: '当前次数'
              }
            ]
          },
          {
            prop: 'timer',
            type: 'number',
            describe: '定时器ID'
          },
          {
            prop: 'offset',
            type: 'object',
            describe: '间隔设置数据',
            data: [
              {
                prop: 'data',
                type: 'number',
                describe: '时间间隔'
              },
              {
                prop: 'start',
                type: 'number',
                describe: '第一次触发间隔'
              }
            ]
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

UpdateData.initInstrcution()

export default UpdateData
