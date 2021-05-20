import _func from 'complex-func'
import SimpleData from './../data/SimpleData'

class OptionData extends SimpleData {
  constructor (structData) {
    super()
    this.data = {}
    this.initStruct(structData)
  }
  // 加载结构
  initStruct (structData = {}) {
    this.data = structData
  }
  // 添加结构
  addStruct (prop, structData) {
    if (this.data[prop] === undefined) {
      this.data[prop] = structData
    } else {
      this.printMsg(`当前存在${prop}属性，无法构建对应的结构，将会导致数据内存地址的变更，请确认后重试!`)
    }
  }
  // 加载设置
  initData (data = {}) {
    if (_func.getType(data) == 'object') {
      for (let n in data) {
        this.setData(n, data[n], 'init')
      }
    } else {
      this.printMsg(`设置类的initData函数需要接受对象数据!`)
    }
  }

  // 设置数据
  setData (prop, optiondata, type) {
    this.setDataNext(this.data, prop, optiondata, type)
  }
  // 检查数据格式
  checkData (target, option, type) {
    let check = {
      target: _func.getType(target),
      option: _func.getType(option),
      fg: false
    }
    if (check.target === 'undefined' || check.option === 'undefined') {
      if (type == 'init') {
        check.fg = true
      } else {
        this.printMsg(
          `非init状态下不能进行undefined值操作!`,
          'error', {
            data: { target, option }
          }
        )
      }
      return check
    } else if (check.target == check.option) {
      check.fg = true
      return check
    } else if (!_func.isComplex(check.target) && !_func.isComplex(check.option)) {
      check.fg = true
      return check
    } else {
      this.printMsg(
        `option赋值双方格式不一致且存在复杂值,（设置目标值格式:${check.target}/设置值格式:${check.option}），禁止直接赋值，请检查代码!`,
        'error',
        {
          data: { target, option }
        }
      )
      return check
    }
  }
  // 设置数据next
  setDataNext (data, prop, optiondata, type) {
    let check = this.checkData(data[prop], optiondata, type)
    if (check.fg) {
      // init状态下的object直接赋值
      if (check.target == 'object' && type != 'init') {
        for (let n in optiondata) {
          this.setDataNext(data[prop], n, optiondata[n], type)
        }
      } else {
        data[prop] = optiondata
      }
    } else {
      return false
    }
  }
  // 获取设置
  getData (prop) {
    if (prop) {
      return _func.getProp(this.data, prop)
    } else {
      return this.data
    }
  }
  // 清除数据/结构>
  clearData (prop) {
    if (!prop) {
      this.data = {}
    } else {
      delete this.data[prop]
    }
  }
}

export default OptionData
