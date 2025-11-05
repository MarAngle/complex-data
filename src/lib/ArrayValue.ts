export interface ArrayValueDataType {
  $prop: PropertyKey
}

class ArrayValue<D extends ArrayValueDataType = ArrayValueDataType> {
  data: D[] // 展示列表
  $prop: PropertyKey[] // 展示列表的$prop
  $map: Map<PropertyKey, D> // 所有数据
  $hidden: Map<PropertyKey, D> // 隐藏数据
  $frozen: Map<PropertyKey, D> // 冻结数据
  /**
   * 构造函数
   * @param {D[]} list - 初始数据列表
   */
  constructor(list?: D[]) {
    this.$map = new Map()
    this.$hidden = new Map()
    this.$frozen = new Map()
    this.data = []
    this.$prop = []
    if (list) {
      list.forEach(item => this.push(item))
    }
  }
  /**
   * 根据在完整列表($prop)中的位置，将一个项目插入到可见列表(data)的正确位置
   * @param {D} target - 目标项目
   * @param {number} targetIndex - 目标项目在 $prop 数组中的索引
   * @returns {number} 插入后在 data 数组中的索引
   */
  protected _insertItemByIndex(target: D, targetIndex: number) {
    let preIndex = -1
    for (let index = targetIndex - 1; index >= 0; index--) {
      // 寻找目标index前的最后一个未隐藏的index
      const prop = this.$prop[index]
      if (this.getStatus(prop) === 'show') {
        preIndex = this.data.indexOf(this.get(prop)!)
        break
      }
    }
    this.data.splice(preIndex + 1, 0, target)
    return preIndex + 1
  }
  /**
   * 检查项目是否被隐藏
   * @param {PropertyKey} prop - 项目的 $prop
   * @returns {boolean}
   */
  isHide(prop: PropertyKey) {
    return this.$hidden.has(prop)
  }
  /**
   * 检查项目是否被冻结
   * @param {PropertyKey} prop - 项目的 $prop
   * @returns {boolean}
   */
  isFrozen(prop: PropertyKey) {
    return this.$frozen.has(prop)
  }
  /**
   * 获取项目的状态 ('show', 'hide', 'frozen', '')
   * @param {PropertyKey} prop - 项目的 $prop
   * @returns {('show' | 'hide' | 'frozen' | '')}
   */
  getStatus(prop: PropertyKey) {
    if (this.isHide(prop)) {
      return 'hide'
    } else if (this.isFrozen(prop)) {
      return 'frozen'
    } else if (this.$map.has(prop)) {
      return 'show'
    } else {
      return ''
    }
  }
  /**
   * 在列表末尾添加一个新项目
   * @param {D} value - 要添加的项目
   */
  push(value: D) {
    this.data.push(value)
    this.$prop.push(value.$prop)
    this.$map.set(value.$prop, value)
  }
  /**
   * 在列表开头添加一个新项目
   * @param {D} target - 要添加的项目
   */
  unshift(target: D) {
    this.data.unshift(target)
    this.$prop.unshift(target.$prop)
    this.$map.set(target.$prop, target)
  }
  /**
   * 从列表末尾移除一个项目
   * @returns {D | undefined} 被移除的项目
   */
  pop() {
    const value = this.data.pop()
    if (value) {
      const prop = value.$prop
      // 删除顺序，为避免结尾隐藏情况，单独判断
      this.$prop.splice(this.$prop.indexOf(prop), 1)
      this.$map.delete(prop)
      this.$hidden.delete(prop)
      this.$frozen.delete(prop)
    }
    return value
  }
  /**
   * 从列表开头移除一个项目
   * @returns {D | undefined} 被移除的项目
   */
  shift() {
    const value = this.data.shift()
    // 删除顺序，为避免结尾隐藏情况，单独判断
    if (value) {
      const prop = value.$prop
      this.$prop.splice(this.$prop.indexOf(prop), 1)
      this.$map.delete(prop)
      this.$hidden.delete(prop)
      this.$frozen.delete(prop)
    }
    return value
  }
  /**
   * 通过 $prop 获取一个项目
   * @param {PropertyKey} prop - 项目的 $prop
   * @returns {D | undefined}
   */
  get(prop: PropertyKey) {
    return this.$map.get(prop)
  }
  /**
   * 通过 $prop 删除一个项目
   * @param {PropertyKey} prop - 项目的 $prop
   * @returns {D | undefined} 被删除的项目
   */
  delete(prop: PropertyKey) {
    const value = this.get(prop)
    if (value) {
      this.$map.delete(prop)
      this.$hidden.delete(prop)
      this.$frozen.delete(prop)
      const index = this.getIndex(prop)
      this.$prop.splice(index, 1)
      const dataIndex = this.data.indexOf(value)
      if (dataIndex > -1) {
        this.data.splice(dataIndex, 1)
      }
    }
    return value
  }
  /**
   * 在指定索引处插入一个新项目
   * @param {D} value - 要插入的项目
   * @param {number} index - 要插入的索引位置
   * @warning [严重 Bug] 此方法存在严重错误，splice的第三个参数应为 value.$prop，而不是数字 1。
   */
  pushByIndex(value: D, index: number) {
    this.$prop.splice(index, 0, value.$prop)
    this.$map.set(value.$prop, value)
    this._insertItemByIndex(value, index)
  }
  /**
   * 获取项目在完整列表($prop)中的索引
   * @param {PropertyKey} prop - 项目的 $prop
   * @returns {number}
   */
  getIndex(prop: PropertyKey) {
    return this.$prop.indexOf(prop)
  }
  /**
   * 隐藏一个项目
   * @param {PropertyKey} prop - 要隐藏的项目的 $prop
   */
  hide(prop: PropertyKey) {
    if (this.getStatus(prop) === 'show') {
      const value = this.get(prop)!
      const index = this.data.indexOf(value)
      this.data.splice(index, 1)
      this.$hidden.set(prop, value)
    }
  }
  /**
   * 显示一个被隐藏的项目
   * @param {PropertyKey} prop - 要显示的项目的 $prop
   */
  show(prop: PropertyKey) {
    if (this.isHide(prop)) {
      const value = this.$hidden.get(prop)
      if (value) {
        this.$hidden.delete(prop)
        const index = this.getIndex(prop)
        this._insertItemByIndex(value, index)
      }
    }
  }
  /**
   * 冻结一个项目
   * @param {PropertyKey} prop - 要冻结的项目的 $prop
   */
  freeze(prop: PropertyKey) {
    if (this.getStatus(prop) === 'show') {
      const value = this.get(prop)!
      const index = this.data.indexOf(value)
      this.data.splice(index, 1)
      this.$frozen.set(prop, value)
    }
  }
  /**
   * 解冻一个项目
   * @param {PropertyKey} prop - 要解冻的项目的 $prop
   */
  thaw(prop: PropertyKey) {
    if (this.isFrozen(prop)) {
      const value = this.$frozen.get(prop)
      if (value) {
        this.$frozen.delete(prop)
        const index = this.getIndex(prop)
        this._insertItemByIndex(value, index)
      }
    }
  }
}

export default ArrayValue
