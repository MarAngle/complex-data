import _func from 'complex-func'

class IdData {
  constructor (initdata) {
    this.list = []
    if (initdata) {
      this.initMain(initdata)
    }
  }
  initMain ({ list }) {
    this.list = []
    for (let n in list) {
      this._initData(list[n])
    }
  }
  _initData (item) {
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
      let maxsize = item.maxsize || false
      let maxaction = item.maxaction || 'cut'
      return function () {
        let current = start.toString()
        if (current.length < minsize) {
          current = _func.fillString(current, minsize, interval, 'start')
        } else if (maxsize && current.length > maxsize) {
          if (maxaction == 'cut') {
            current.length = maxsize
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
  getData () {
    let data = ''
    for (let n in this.list) {
      data = data + this.list[n]()
    }
    return data
  }
}

export default IdData
