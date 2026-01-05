import { getNum } from "complex-utils"
import { notice } from "complex-plugin"
import Data from "./../data/Data"

export type trackStatus = 'stop' | 'pause' | 'moving'
export type trackPointProp = 'start' | 'current' | 'end'
export type trackLineProp = 'total' | 'current'
export type directionProp = 'forward' | 'backward'
export type connectProp = 'total' | 'current'
export type lnglatType = {
  lng: number
  lat: number
}

export interface TrackDataOptions {
  autoView: boolean
  icon?: {
    start?: Record<PropertyKey, any>
    end?: Record<PropertyKey, any>
    current?: Record<PropertyKey, any>
  }
  point?: {
    start?: Record<PropertyKey, any>
    end?: Record<PropertyKey, any>
    current?: Record<PropertyKey, any>
  }
  line?: {
    total?: Record<PropertyKey, any>
    current?: Record<PropertyKey, any>
  }
  connect?: {
    total?: Record<PropertyKey, any>
    current?: Record<PropertyKey, any>
  }
}

export interface TrackDataInitOption {
  speed: number // 基础定时器时间间隔
  options: TrackDataOptions
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
  static $minSize = 2
  /**
   * 
   * @param current 当前经纬度
   * @param next 目标经纬度
   * @param jitterCm 抖动值（单位cm，低于抖动值则返回undefined）
   * @returns 
   */
  static parseAngle( current: lnglatType, next: lnglatType, jitterCm?: number): number | undefined {
    if (current && next) {
      const dx = next.lng - current.lng
      const dy = next.lat - current.lat
      // ===== 抖动过滤（可选）=====
      if (typeof jitterCm === 'number' && jitterCm > 0) {
        // 将厘米换算为“近似经纬度距离”
        const latMeter = dy * 111000
        const lngMeter = dx * 111000 * Math.cos(current.lat * Math.PI / 180)
        const distanceMeter = Math.sqrt(latMeter * latMeter + lngMeter * lngMeter)
        if (distanceMeter * 100 < jitterCm) {
          return undefined
        }
      }
      // ===== 正常角度计算（永远可算）=====
      // 正东 = 0°，逆时针
      let angle = Math.atan2(dy, dx) * 180 / Math.PI
      angle = (angle + 360) % 360
      // 转换为：正北 = 0°，顺时针（地图语义）
      angle = (90 - angle + 360) % 360
      return angle
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
  $options: TrackDataOptions
  $marker: {
    line: {
      total: LINE[]
      current: LINE[]
    }
    connect: {
      total: CONNECT[]
      current: CONNECT[]
    }
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
    dict: number[] // 记录的是每条线的最后一个点的索引即 maxIndex
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
    this.$options = initOption.options
    this.$marker = {
      // 图标
      icon: {
        start: undefined,
        end: undefined,
        current: undefined
      },
      // 点
      point: {
        start: undefined,
        end: undefined,
        current: undefined
      },
      // 路线
      line: {
        total: [],
        current: []
      },
      // 连接点：仅限全轨迹
      connect: {
        total: [],
        current: []
      },
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
  abstract clearOverlay(map: MAP, marker: LINE | POINT | CONNECT, type: 'point' | 'line' | 'connect'): void
  abstract autoView(map: MAP, lnglatList: LNGLAT[]): void
  abstract parseLnglat(lnglat: LNGLAT): lnglatType
  abstract createIcon(prop: trackPointProp): ICON
  abstract createLnglat(value: VALUE): LNGLAT
  abstract createPoint(prop: trackPointProp, map: MAP, icon: ICON, lnglat: LNGLAT): POINT
  abstract createLine(prop: trackLineProp, map: MAP, lnglat: LNGLAT[]): LINE
  abstract createConnect(option: { start: LNGLAT, startIndex: number, end: LNGLAT, endIndex: number }, prop: connectProp): CONNECT
  abstract movePoint(point: POINT, lnglat: LNGLAT, angle: undefined | number, option: { lastIndex: number, index: number, nextIndex: number, nextLnglat: LNGLAT }): void
  abstract moveLine(direction: directionProp, line: LINE, list: LNGLAT[]): void
  setMap(map: MAP, unCreate?: boolean) {
    this.$map = map
    if (!unCreate) {
      this.create()
    }
  }
  getMap() {
    return this.$map
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
  pushData(value: VALUE) {
    if (this.hasPoint(value)) {
      if (!this.status.data) {
        // 未进行数据加载则进行数据初始化
        this.setData([[value]])
      } else {
        this.data.list.push(value)
        this.data.maxIndex++
        if (this.data.dict.length > 0) {
          // 这里应该直接赋值为当前maxIndex
          this.data.dict[this.data.dict.length - 1] = this.data.maxIndex
        } else {
          this.data.dict = [this.data.maxIndex]
        }
        const map = this.getMap()
        if (map) {
          if (this.status.init) {
            // 已加载则进行push数据
            this.data.lnglat.push(this.createLnglat(value))
            const lineList = this.getLineList(this.data.dict.length - 1, this.data.dict[this.data.dict.length - 1] + 1)
            const lastLine = this.$marker.line.total[this.$marker.line.total.length - 1]
            this.moveLine('forward', lastLine, lineList)
          } else {
            // 可能存在未创建的情况，未创建则创建
            this.$create(map, true)
          }
        }
      }
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
    const map = this.getMap()!
    // 增加判空，防止无数据时报错
    if (startLnglat) {
      this.$marker.point.start = this.createPoint('start', map, this.$marker.icon.start!, startLnglat)
      this.$marker.point.current = this.createPoint('current', map, this.$marker.icon.current!, startLnglat)
    }
    if (endLnglat) {
      this.$marker.point.end = this.createPoint('end', map, this.$marker.icon.end!, endLnglat)
    }
  }
  $create(map: MAP, unShortMsg?: boolean) {
    const minSize = (this.constructor as typeof TrackData).$minSize
    if (this.data.maxIndex + 1 >= minSize) {
      this.createIcons()
      this.data.lnglat = this.data.list.map(lineValue => this.createLnglat(lineValue))
      this.createPoints()
      let startIndex = 0
      for (let i = 0; i < this.data.dict.length; i++) {
        const currentIndex = this.data.dict[i]
        const lineList = this.getLineList(i, currentIndex)
        const line = this.createLine('total', map, lineList)
        this.$marker.line.total.push(line)
        const currentLine = this.createLine('current', map, [])
        this.$marker.line.current.push(currentLine)
        if (i != 0) {
          // 开始轨迹中间的连接操作
          const endIndex = startIndex - 1
          const endPoint = this.data.lnglat[endIndex]
          const startPoint = this.data.lnglat[startIndex]
          this.$marker.connect.total.push(this.createConnect({
            end: endPoint,
            start: startPoint,
            endIndex: endIndex,
            startIndex: startIndex
          }, 'total'))
        }
        startIndex = currentIndex + 1
      }
      this.status.init = true
      if (this.$options.autoView) {
        this.autoView(map, this.data.lnglat)
      }
    } else if (!unShortMsg) {
      this.shortMsg(this.data.maxIndex + 1, minSize)
    } 
  }
  create(unShortMsg?: boolean) {
    const map = this.getMap()
    if (map && this.status.data) {
      this.$reset()
      this.$create(map, unShortMsg)
    }
  }
  $clearOverlay() {
    const map = this.getMap()
    if (map) {
      for (const line of this.$marker.line.total) {
        this.clearOverlay(map, line, 'line')
      }
      this.$marker.line.total = []
      for (const line of this.$marker.line.current) {
        this.clearOverlay(map, line, 'line')
      }
      this.$marker.line.current = []
      for (const connect of this.$marker.connect.total) {
        this.clearOverlay(map, connect, 'connect')
      }
      this.$marker.connect.total = []
      for (const connect of this.$marker.connect.current) {
        this.clearOverlay(map, connect, 'connect')
      }
      this.$marker.connect.current = []
      if (this.$marker.point.start) {
        this.clearOverlay(map, this.$marker.point.start, 'point')
        this.$marker.point.start = undefined
      }
      if (this.$marker.point.end) {
        this.clearOverlay(map, this.$marker.point.end, 'point')
        this.$marker.point.end = undefined
      }
      if (this.$marker.point.current) {
        this.clearOverlay(map, this.$marker.point.current, 'point')
        this.$marker.point.current = undefined
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
  }
  resetInit() {
    this.status.init = false
  }
  changeStatusByMove() {
    if (this.getStatus() === 'stop') {
      this.setStatus('pause')
    }
  }
  // drag start ---
  triggerDrag(percent: number, drag: boolean) {
    if (drag) {
      if (!this.status.drag) {
        this.status.drag = true
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
    this.setCurrentByOffset('backward', offset)
    this.$start()
  }
  moveForward() {
    const num = 1000 / this.speed.current
    const offset = num * 5
    this.setCurrentByOffset('forward', offset)
    this.$start()
  }
  setCurrentByOffset (direction: directionProp, offset: number) {
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
  getCurrentIndex() {
    return this.$index.current.data
  }
  getCurrentValue() {
    return this.data.list[this.getCurrentIndex()]
  }
  setIndex(index?: number) {
    this.$setIndex(index)
    this.countPercent()
  }
  protected _setIndex(currentIndex: number, currentLine?: number) {
    this.$index.current.data = currentIndex
    this.$index.current.line = currentLine !== undefined ? currentLine : this._getLineIndex(currentIndex)
    if (!this.$isEnd(currentIndex)) {
      this.$index.next.data = currentIndex + 1
      this.$index.next.line = this._getLineIndex(this.$index.next.data)
    } else if (currentLine !== undefined) {
      // 结束状态 存在currentLine时不需要进行赋值，因为currentLine的来源就是next的值
      this.$index.next.data = currentIndex
      this.$index.next.line = this.$index.current.line
    }
    return currentIndex
  }
  protected $setIndex(currentIndex?: number) {
    const lastIndex = this.$index.current.data
    const lastLineIndex = this.$index.current.line
    if (currentIndex === undefined) {
      // 未传递时直接获取下一步数据
      currentIndex = this._setIndex(this.$index.next.data, this.$index.next.line)
    } else {
      if (currentIndex < 0) {
        currentIndex = 0
      } else if (this.$isEnd(currentIndex)) {
        currentIndex = this.data.maxIndex
      }
      currentIndex = this._setIndex(currentIndex)
    }
    this.$onIndexChange(currentIndex, lastIndex, lastLineIndex)
    this.changeStatusByMove()
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
            // 前进操作，对连接点进行操作:创建连接点:需要遍历可能存在的多个连接点
            // this.createConnect(direction, this.$marker.connect[i])
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
            // 后退操作，对连接点进行操作:删除连接点:需要遍历可能存在的多个连接点
            // this.clearOverlay(direction, this.$marker.connect[i])
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
    this.percent = 0
  }
  countPercent() {
    this.percent = getNum(this.$index.current.data * 100 / ( this.data.maxIndex), 'round', 0)
  }
  setPercent(data: number) {
    this.percent = data
    const index = getNum(this.percent / 100 * ( this.data.maxIndex), 'round', 0)
    this.$setIndex(index)
  }
  start() {
    if (this.getStatus() === 'stop') {
      this.$setIndex(0)
    }
    this.setStatus('moving')
    this.$start()
  }
  pause() {
    this.clearNextTimer()
    this.setStatus('pause')
  }
  stop() {
    // 重置index,percent,speed,status，终止计时
    this.clearNextTimer()
    this.resetIndex()
    this.resetStatus()
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
    // 清除地图覆盖物
    // 此重置保存当前数据，作为基础重置使用
    this.resetSpeed()
    this.stop()
    this.$clearOverlay()
    this.resetInit()
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
