import _func from 'complex-func'

class IdData {
  constructor (initOption) {
    this.list = []
    if (initOption) {
      this.initMain(initOption)
    }
  }
  /**
   * 加载IdData
   * @param {object} option 参数
   * @param {object[]} option.list 参数
   */
  initMain ({ list }) {
    this.list = []
    for (let n in list) {
      this.initRuleData(list[n])
    }
  }
  /**
   * 生成规则对象option
   * @param {object | function} option 规则参数
   */
  initRuleData (option) {
    if (option) {
      let type = _func.getType(option)
      if (type == 'function') {
        this.list.push(option)
      } else if (type == 'string') {
        this.list.push(function () { return option })
      } else if (type == 'object') {
        let funcitem = this.buildFunc(option)
        this.list.push(funcitem)
      }
    }
  }
  /**
   * 生成规则函数
   * @param {*} option 基于规则参数生成函数
   * @returns {function}
   */
  buildFunc (option) {
    if (option.type == 'random') {
      return function () {
        return _func.getRandomData(option.size, option.letter)
      }
    } else if (option.type == 'time') {
      return function () {
        return Date.now().toString()
      }
    } else if (option.type == 'id') {
      if (option.start === undefined) {
        option.start = 1
      }
      if (!option.step) {
        option.step = 1
      }
      if (!option.interval) {
        option.interval = '0'
      }
      if (!option.intervalTo) {
        option.intervalTo = 'start'
      }
      if (!option.minSize) {
        option.minSize = 6
      }
      if (option.minSize) {
        if (!option.maxAction) {
          option.maxAction = 'cut'
        }
      }
      return function () {
        let current = option.start.toString()
        if (current.length < option.minSize) {
          current = _func.fillString(current, option.minSize, option.interval, option.intervalTo)
        } else if (option.maxSize && current.length > option.maxSize) {
          if (option.maxAction == 'cut') {
            current = current.slice(0, option.maxSize)
          } else if (option.maxAction == 'restart') {
            option.start = 1
            current = _func.fillString('1', option.minSize, option.interval, option.intervalTo)
          } else {
            current = option.maxAction(current, option)
          }
        }
        option.start = option.start + option.step
        return current
      }
    }
  }
  /**
   * 获取id
   * @returns {string}
   */
  getData () {
    let data = ''
    for (let n in this.list) {
      data = data + this.list[n]()
    }
    return data
  }
}

IdData._name = 'IdData'

export default IdData
