import { getNum } from "complex-utils"
import { notice } from "complex-plugin"
import Data from "./../data/Data"

export type trackStatus = 'stop' | 'pause' | 'moving'
export type trackPointProp = 'start' | 'current' | 'end'
export type trackLineProp = 'total' | 'current'
export type directionProp = 'forward' | 'backward'
export type lnglatType = {
  lng: number
  lat: number
}

export interface TrackDataInitOption {
  speed: number
}

// 需要检测在前进后退时的connect是否正确
abstract class TrackData<
  VALUE extends any = Record<PropertyKey, any>,
  MAP extends Record<PropertyKey, any> = Record<PropertyKey, any>,
  LNGLAT extends Record<PropertyKey, any> = Record<PropertyKey, any>,
  ICON extends any = any,
  POINT extends Record<PropertyKey, any> = Record<PropertyKey, any>,
  LINE extends Record<PropertyKey, any> = Record<PropertyKey, any>,
  CONNECT extends any = any
> extends Data {
  static $name = 'TrackData'
  static $formatConfig = { name: 'TrackData', level: 50, recommend: true }
  static $minSize = 3
  static parseAngle (currentLnglat: lnglatType, nextLnglat: lnglatType) {
    if (currentLnglat && nextLnglat) {
      const rad = Math.PI / 180
      const lat1 = currentLnglat.lat * rad
      const lat2 = nextLnglat.lat * rad
      const lng1 = currentLnglat.lng * rad
      const lng2 = nextLnglat.lng * rad
      const x = Math.sin(lng2 - lng1) * Math.cos(lat2)
      const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1)
      const radians = Math.atan2(x, y)
      let angle = radians % (2 * Math.PI)
      angle = (180 * radians) / Math.PI
      return angle
    } else {
      return undefined
    }
  }
  status: {
    init: boolean
    data: boolean
    drag: boolean
    last: '' | trackStatus
    value: trackStatus
  }
  $map?: MAP
  $marker: {
    line: {
      data: LINE[]
      current: LINE[]
    }
    connect: CONNECT[]
    icon: Record<trackPointProp, undefined | ICON>
    point: Record<trackPointProp, undefined | POINT>
  }
  $index: {
    current: {
      data: number
      line: number
    }
    next: {
      data: number
      line: number
    }
  }
  speed: {
    base: number
    rate: number
    current: number
  }
  nextTimer?: number
  percent: number
  data: {
    dict: number[]
    list: VALUE[]
    lnglat: LNGLAT[]
    maxIndex: number
  }
  constructor(initOption: TrackDataInitOption) {
    super()
    this.status = {
      init: false,
      data: false,
      drag: false,
      last: '',
      value: 'stop'
    }
    this.$index = {
      current: {
        data: 0,
        line: 0
      },
      next: {
        data: 1,
        line: 0
      }
    }
    this.speed = {
      base: initOption.speed,
      rate: 1,
      current: initOption.speed
    }
    this.$marker = {
      icon: {
        start: undefined,
        end: undefined,
        current: undefined
      },
      point: {
        start: undefined,
        end: undefined,
        current: undefined
      },
      line: {
        data: [],
        current: []
      },
      connect: [],
    }
    this.percent = 0
    this.data = {
      dict: [],
      list: [],
      lnglat: [],
      maxIndex: -1
    }
  }
  abstract hasPoint(value: VALUE): boolean
  abstract resetMap(map: MAP): void
  abstract clearOverlay(map: MAP, marker: LINE | POINT | CONNECT, type: 'point' | 'line' | 'connect'): LINE
  abstract autoView(map: MAP, lnglatList: LNGLAT[]): void
  abstract parseLnglat(lnglat: LNGLAT): lnglatType
  abstract createIcon(prop: trackPointProp): ICON
  abstract createLnglat(value: VALUE): LNGLAT
  abstract createPoint(prop: trackPointProp, map: MAP, icon: ICON, lnglat: LNGLAT): POINT
  abstract createLine(prop: trackLineProp, map: MAP, lnglat: LNGLAT[]): LINE
  abstract createConnect(option: { start: LNGLAT, startIndex: number, end: LNGLAT, endIndex: number }): CONNECT
  abstract movePoint(point: POINT, lnglat: LNGLAT, angle: undefined | number, option: { lastIndex: number, index: number, nextIndex: number, nextLnglat: LNGLAT }): void
  abstract moveLine(direction: directionProp, line: LINE, list: LNGLAT[]): void
  abstract moveConnect(direction: directionProp, connect: CONNECT): void
  setMap(map: MAP, unCreate?: boolean) {
    this.$map = map
    if (!unCreate) {
      this.create()
    }
  }
  $resetMap() {
    if (this.$map) {
      this.resetMap(this.$map)
    }
    this.$map = undefined
  }
  setData(lineList: VALUE[][], unCreate?: boolean) {
    this.resetData()
    const list: VALUE[] = []
    let size = 0
    for (let i = 0; i < lineList.length; i++) {
      const line = lineList[i]
      if (line && line.length > 0) {
        let length = 0
        line.forEach((lineValue: VALUE) => {
          if (this.hasPoint(lineValue)) {
            length++
            list.push(lineValue)
          }
        })
        if (length > 0) {
          size += length
          this.data.dict.push(size - 1)
        }
      }
    }
    this.data.list = list
    this.data.maxIndex = list.length - 1
    this.status.data = true
    if (!unCreate) {
      this.create()
    }
  }
  resetData() {
    this.status.data = false
    this.data.dict = []
    this.data.list = []
    this.data.lnglat = []
    this.data.maxIndex = -1
  }
  protected _getLineIndex(index: number) {
    for (let i = 0; i < this.data.dict.length; i++) {
      const lineIndex = this.data.dict[i]
      if (index <= lineIndex) {
        return i
      }
    }
    return this.data.dict.length - 1
  }
  getLineList(index: number, endIndex?: number) {
    if (endIndex === undefined) {
      endIndex = this.data.dict[index]
    }
    const startIndex = index == 0 ? 0 : this.data.dict[index - 1] + 1
    return this.data.lnglat.slice(startIndex, endIndex + 1)
  }
  createIcons() {
    if (!this.$marker.icon.start) {
      this.$marker.icon.start = this.createIcon('start')
    }
    if (!this.$marker.icon.end) {
      this.$marker.icon.end = this.createIcon('end')
    }
    if (!this.$marker.icon.current) {
      this.$marker.icon.current = this.createIcon('current')
    }
  }
  createPoints() {
    const startLnglat = this.data.lnglat[0]
    const endLnglat = this.data.lnglat[this.data.maxIndex]
    this.$marker.point.end = this.createPoint('end', this.$map!, this.$marker.icon.end!, endLnglat)
    this.$marker.point.start = this.createPoint('start', this.$map!, this.$marker.icon.start!, startLnglat)
    this.$marker.point.current = this.createPoint('current', this.$map!, this.$marker.icon.current!, startLnglat)
  }
  create() {
    if (this.$map && this.status.data) {
      this.$reset()
      const minSize = (this.constructor as typeof TrackData).$minSize
      if (this.data.maxIndex >= minSize) {
        this.createIcons()
        this.data.lnglat = this.data.list.map(lineValue => {
          return this.createLnglat(lineValue)
        })
        this.createPoints()
        let startIndex = 0
        for (let i = 0; i < this.data.dict.length; i++) {
          const currentIndex = this.data.dict[i]
          const lineList = this.getLineList(i, currentIndex)
          const line = this.createLine('total', this.$map, lineList)
          this.$marker.line.data.push(line)
          const currentLine = this.createLine('current', this.$map, [])
          this.$marker.line.current.push(currentLine)
          if (i != 0) {
            // 开始轨迹中间的连接操作
            const endIndex = startIndex - 1
            const endPoint = this.data.lnglat[endIndex]
            const startPoint = this.data.lnglat[startIndex]
            this.$marker.connect.push(this.createConnect({
              end: endPoint,
              start: startPoint,
              endIndex: endIndex,
              startIndex: startIndex
            }))
          }
          startIndex = currentIndex + 1
        }
        this.status.init = true
        this.autoView(this.$map, this.data.lnglat)
      } else {
        this.shortMsg(this.data.maxIndex + 1, minSize)
      }
    }
  }
  $clearOverlay() {
    if (this.$map) {
      if (this.$marker.line.data.length > 0) {
        for (let i = 0; i < this.$marker.line.data.length; i++) {
          const line = this.$marker.line.data[i]
          this.clearOverlay(this.$map, line, 'line')
        }
        this.$marker.line.data = []
      }
      if (this.$marker.line.current.length > 0) {
        for (let i = 0; i < this.$marker.line.current.length; i++) {
          const line = this.$marker.line.current[i]
          this.clearOverlay(this.$map, line, 'line')
        }
        this.$marker.line.current = []
      }
      if (this.$marker.connect.length > 0) {
        for (let i = 0; i < this.$marker.connect.length; i++) {
          const connect = this.$marker.connect[i]
          this.clearOverlay(this.$map, connect, 'connect')
        }
        this.$marker.connect = []
      }
      if (this.$marker.point.start) {
        this.clearOverlay(this.$map, this.$marker.point.start, 'point')
      }
      if (this.$marker.point.end) {
        this.clearOverlay(this.$map, this.$marker.point.end, 'point')
      }
      if (this.$marker.point.current) {
        this.clearOverlay(this.$map, this.$marker.point.current, 'point')
      }
    }
  }
  shortMsg(size: number, minSize: number) {
    if (size === 0) {
      notice.message(`当前无轨迹点，无法生成轨迹！`, 'error')
    } else {
      notice.message(`轨迹生成至少需要${minSize}个点，当前轨迹点仅为${size}个，无法生成轨迹！`, 'error')
    }
  }
  setStatus(status: trackStatus) {
    if (this.status.value !== status) {
      this.status.last = this.status.value
      this.status.value = status
    }
  }
  getStatus() {
    return this.status.value
  }
  resetStatus() {
    this.setStatus('stop')
    this.status.last = ''
    this.status.init = false
  }
  // drag start ---
  triggerDrag(percent: number, drag: boolean) {
    if (drag) {
      if (!this.status.drag) {
        this.status.drag = true
        if (this.getStatus() === 'stop') {
          this.setStatus('pause')
        }
      }
      this.setPercent(percent)
    } else {
      this.status.drag = false
      this.$start()
    }
  }
  getDrag() {
    return this.status.drag
  }
  // drag end ---
  moveBackward() {
    const num = 1000 / this.speed.current
    const offset = num * 5
    this.set1CurrentByOffset('backward', offset)
    if (this.getStatus() === 'stop') {
      this.setStatus('pause')
    }
    this.$start()
  }
  moveForward() {
    const num = 1000 / this.speed.current
    const offset = num * 5
    this.set1CurrentByOffset('forward', offset)
    if (this.getStatus() === 'stop') {
      this.setStatus('pause')
    }
    this.$start()
  }
  set1CurrentByOffset (direction: directionProp, offset: number) {
    if (direction === 'backward') {
      this.setIndex(this.$index.current.data - offset)
    } else if (direction === 'forward') {
      this.setIndex(this.$index.current.data + offset)
    }
  }
  $start() {
    this.clearNextTimer()
    if (this.check()) {
      this.nextTimer = setTimeout(() => {
        this.$next()
      }, this.getSpeed()) as unknown as number
    }
  }
  clearNextTimer () {
    if (this.nextTimer) {
      clearTimeout(this.nextTimer)
      this.nextTimer = undefined
    }
  }
  check() {
    if (this.$isEnd(this.$index.current.data)) {
      this.setStatus('stop')
    }
    return this.getStatus() === 'moving' && !this.getDrag()
  }
  $next() {
    this.setIndex()
    this.$start()
  }
  setIndex(index?: number) {
    this.$setIndex(index)
    this.countPercent()
  }
  protected $setIndex(currentIndex?: number) {
    const lastIndex = this.$index.current.data
    const lastLineIndex = this.$index.current.line
    if (currentIndex === undefined) {
      // 未传递时直接获取下一步数据
      this.$index.current.data = this.$index.next.data
      this.$index.current.line = this.$index.next.line
      this.$index.next.data = this.$index.current.data + 1
      this.$index.next.line = this._getLineIndex(this.$index.next.data)
      currentIndex = this.$index.current.data
    } else if (this.$isEnd(currentIndex)) {
      // 当前index值超过或为结束值时，直接进行结束赋值操作
      currentIndex = this.data.maxIndex
      this.$index.current.data = currentIndex
      this.$index.current.line = this._getLineIndex(currentIndex)
      // 结束后的下一个点同最后点避免BUG
      this.$index.next.data = currentIndex
      this.$index.next.line = this.$index.current.line
    } else {
      if (currentIndex < 0) {
        currentIndex = 0
      }
      // 存在index且未结束时
      this.$index.current.data = currentIndex
      this.$index.current.line = this._getLineIndex(this.$index.current.data)
      this.$index.next.data = currentIndex + 1
      this.$index.next.line = this._getLineIndex(this.$index.next.data)
    }
    this.$onIndexChange(currentIndex, lastIndex, lastLineIndex)
  }
  protected $onIndexChange(currentIndex: number, lastIndex: number, lastLineIndex: number) {
    if (this.$marker.point.current && this.$marker.line.current.length > 0) {
      const direction = currentIndex > lastIndex ? 'forward' : 'backward'
      const currentLnglat = this.data.lnglat[currentIndex]
      const nextLnglat = this.data.lnglat[this.$index.next.data]
      const angle = TrackData.parseAngle(this.parseLnglat(currentLnglat), this.parseLnglat(nextLnglat))
      this.movePoint(this.$marker.point.current, currentLnglat, angle, {
        lastIndex: lastIndex,
        index: currentIndex,
        nextIndex: this.$index.next.data,
        nextLnglat: nextLnglat
      })
      if (direction == 'forward') {
        // 从上一个点的路线开始绘制
        for (let i = lastLineIndex; i <= this.$index.current.line; i++) {
          if (i == this.$index.current.line) {
            this.moveLine(direction, this.$marker.line.current[i], this.getLineList(i, currentIndex))
          } else {
            this.moveLine(direction, this.$marker.line.current[i], this.getLineList(i))
            // 前进操作，对连接点进行操作
            this.moveConnect(direction, this.$marker.connect[i])
          }  
        }
      } else {
        for (let i = this.$index.current.line; i <= lastLineIndex; i++) {
          if (i == this.$index.current.line) {
            this.moveLine(direction, this.$marker.line.current[i], this.getLineList(i, currentIndex))
          } else {
            this.moveLine(direction, this.$marker.line.current[i], [])
          }
          if (i != lastLineIndex) {
            // 后退操作，对连接点进行操作
            this.moveConnect(direction, this.$marker.connect[i])
          }        
        }
      }
    }
  }
  resetIndex (move?: boolean) {
    if (move) {
      this.$setIndex(0)
    }
    this.$index.current.data = 0
    this.$index.current.line = 0
    this.$index.next.data = 1
    this.$index.next.line = 0
  }
  countPercent() {
    this.percent = getNum(this.$index.current.data * 100 / ( this.data.maxIndex), 'round', 0)
  }
  setPercent(data: number) {
    this.percent = data
    const index = getNum(this.percent / 100 * ( this.data.maxIndex), 'round', 0)
    this.$setIndex(index)
  }
  resetPercent() {
    this.percent = 0
  }
  start() {
    if (this.getStatus() === 'stop') {
      this.$setIndex(0)
    }
    this.setStatus('moving')
    this.$start()
  }
  pause() {
    this.setStatus('pause')
  }
  stop() {
    this.setStatus('stop')
  }

  setSpeed (rate: number) {
    this.speed.rate = rate
    this.speed.current = this.speed.base / this.speed.rate
  }
  getSpeed () {
    return this.speed.current
  }
  resetSpeed () {
    this.setSpeed(1)
  }

  $isEnd(index: number) {
    return index >= this.data.maxIndex
  }
  $reset() {
    // 清除地图覆盖物,重置index,percent,speed,status，终止计时
    // 此重置保存当前数据，作为基础重置使用
    this.$clearOverlay()
    this.clearNextTimer()
    this.resetIndex()
    this.resetPercent()
    this.resetSpeed()
    this.resetStatus()
  }
  reset() {
    // $reset的基础上重置数据
    this.$reset()
    this.resetData()
  }
  destroy() {
    this.reset()
    this.$resetMap()
  }
}

export default TrackData
