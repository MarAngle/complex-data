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
   * 生成规则对象item
   * @param {object | function} item 规则参数
   */
  initRuleData (item) {
    if (item) {
      let type = _func.getType(item)
      if (type == 'function') {
        this.list.push(item)
      } else if (type == 'string') {
        this.list.push(function () { return item })
      } else if (type == 'object') {
        let funcitem = this.buildFunc(item)
        this.list.push(funcitem)
      }
    }
  }
  /**
   * 生成规则函数
   * @param {*} item 基于规则参数生成函数
   * @returns {function}
   */
  buildFunc (item) {
    if (item.type == 'random') {
      return function () {
        return _func.getRandomData({ size: item.size, letter: item.letter })
      }
    } else if (item.type == 'time') {
      return function () {
        return new Date().getTime().toString()
      }
    } else if (item.type == 'id') {
      let start = item.start || 0
      let step = item.step || 1
      let interval = item.interval || '0'
      let minsize = item.minsize || 6
      let maxsize = item.maxsize || 0
      let maxaction = item.maxaction || 'cut'
      return function () {
        let current = start.toString()
        if (current.length < minsize) {
          current = _func.fillString(current, minsize, interval, 'start')
        } else if (maxsize && current.length > maxsize) {
          if (maxaction == 'cut') {
            current = current.slice(0, maxsize)
          } else if (maxaction == 'restart') {
            start = 0
          } else {
            maxaction(current, start, step, interval)
          }
        }
        start = start + step
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
