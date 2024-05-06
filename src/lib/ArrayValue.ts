export interface ArrayValueDataType {
  $prop: PropertyKey
}

class ArrayValue<D extends ArrayValueDataType = ArrayValueDataType> {
  data: D[] // 展示列表
  $prop: PropertyKey[] // 展示列表的$prop
  $map: Map<PropertyKey, D> // 所有数据
  $hidden: Map<PropertyKey, D> // 隐藏数据
  $frozen: Map<PropertyKey, D> // 冻结数据
  constructor(list?: D[]) {
    this.$map = new Map()
    this.$hidden = new Map()
    this.$frozen = new Map()
    this.data = []
    this.$prop = []
    if (list) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        this.push(item)
      }
    }
  }
  protected _showByIndex(target: D, targetIndex: number) {
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
  getStatus(prop: PropertyKey) {
    if (this.$hidden.has(prop)) {
      return 'hide'
    } else if (this.$frozen.has(prop)) {
      return 'frozen'
    } else if (this.$map.has(prop)) {
      return 'show'
    } else {
      return ''
    }
  }
  push(value: D) {
    this.data.push(value)
    this.$prop.push(value.$prop)
    this.$map.set(value.$prop, value)
  }
  unshift(target: D) {
    this.data.unshift(target)
    this.$prop.unshift(target.$prop)
    this.$map.set(target.$prop, target)
  }
  pop() {
    const value = this.data.pop()!
    const prop = value.$prop
    // 删除顺序，为避免结尾隐藏情况，单独判断
    this.$prop.splice(this.$prop.indexOf(prop), 1)
    this.$map.delete(prop)
    this.$hidden.delete(prop)
    this.$frozen.delete(prop)
  }
  shift() {
    const value = this.data.shift()!
    const prop = value.$prop
    // 删除顺序，为避免结尾隐藏情况，单独判断
    this.$prop.splice(this.$prop.indexOf(prop), 1)
    this.$map.delete(prop)
    this.$hidden.delete(prop)
    this.$frozen.delete(prop)
  }
  get(prop: PropertyKey) {
    return this.$map.get(prop)
  }
  // 删除
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
  }
  // 基于实际index插入
  pushByIndex(value: D, index: number) {
    this.$prop.splice(index, 0, 1)
    this.$map.set(value.$prop, value)
    this._showByIndex(value, index)
  }
  // 获取实际index
  getIndex(prop: PropertyKey) {
    return this.$prop.indexOf(prop)
  }
  // 隐藏
  hide(prop: PropertyKey) {
    if (this.getStatus(prop) === 'show') {
      const value = this.get(prop)!
      const index = this.data.indexOf(value)
      this.data.splice(index, 1)
      this.$hidden.set(prop, value)
    }
  }
  // 显示
  show(prop: PropertyKey) {
    if (this.getStatus(prop) === 'hide') {
      const value = this.$hidden.get(prop)
      if (value) {
        this.$hidden.delete(prop)
        const index = this.getIndex(prop)
        this._showByIndex(value, index)
      }
    }
  }
  // 冻结
  freeze(prop: PropertyKey) {
    if (this.getStatus(prop) === 'show') {
      const value = this.get(prop)!
      const index = this.data.indexOf(value)
      this.data.splice(index, 1)
      this.$frozen.set(prop, value)
    }
  }
  // 解冻
  thaw(prop: PropertyKey) {
    if (this.getStatus(prop) === 'frozen') {
      const value = this.$frozen.get(prop)
      if (value) {
        this.$frozen.delete(prop)
        const index = this.getIndex(prop)
        this._showByIndex(value, index)
      }
    }
  }
}

export default ArrayValue
