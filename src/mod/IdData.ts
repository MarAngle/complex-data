import _func from 'complex-func'

interface randomItem {
  type: 'random',
  size: number,
  letter?: undefined | {
    small?: boolean,
    big?: boolean,
    number?: boolean
  }
}
interface timeItem {
  type: 'time'
}
interface idItem {
  type: 'id',
  start?: number,
  step?: number,
  interval?: string,
  minsize?: number,
  maxsize?: number,
  maxaction?: undefined | Function | 'cut' | 'restart'
}
type Item = randomItem | timeItem | idItem

type initItem = (() => string) | string | Item

class IdData {
  list: (() => string)[]
  constructor (initdata: {
    list: initItem[]
  } | undefined) {
    this.list = []
    if (initdata) {
      this.initMain(initdata)
    }
  }
  initMain ({ list }: { list: initItem[] }):void {
    this.list = []
    for (let n in list) {
      this._initData(list[n])
    }
  }
  _initData (item: initItem):void {
    if (item) {
      let type = _func.getType(item)
      if (type == 'function') {
        this.list.push(item as () => string)
      } else if (type == 'string') {
        this.list.push(function () { return item as string })
      } else if (type == 'object') {
        let funcitem = this.buildFunc(item as Item)
        this.list.push(funcitem)
      }
    }
  }
  buildFunc (item: Item): () => string {
    if (item.type == 'random') {
      return function (): string {
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
      let minsize = item.minsize || 8
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
  getData (): string {
    let data = ''
    for (let n in this.list) {
      data = data + this.list[n]()
    }
    return data
  }
}

export default IdData
