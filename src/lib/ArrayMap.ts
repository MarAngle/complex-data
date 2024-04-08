export interface ArrayMapValueType {
  $prop: PropertyKey
}

class ArrayMap<D extends ArrayMapValueType = ArrayMapValueType> {
  data: D[]
  $prop: PropertyKey[]
  $map: Map<PropertyKey, D>
  $hidden: Map<PropertyKey, D>
  constructor(list?: D[]) {
    this.$map = new Map()
    this.$hidden = new Map()
    this.data = []
    this.$prop = []
    if (list) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        this.push(item)
      }
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
  }
  shift() {
    const value = this.data.shift()!
    const prop = value.$prop
    // 删除顺序，为避免结尾隐藏情况，单独判断
    this.$prop.splice(this.$prop.indexOf(prop), 1)
    this.$map.delete(prop)
    this.$hidden.delete(prop)
  }
  get(prop: PropertyKey) {
    return this.$map.get(prop)
  }
  remove(prop: PropertyKey) {
    const target = this.$map.get(prop)
    if (target) {
      this.$map.delete(prop)
      this.$hidden.delete(prop)
      const index = this.getIndex(prop)
      this.$prop.splice(index, 1)
      const dataIndex = this.data.indexOf(target)
      if (dataIndex > -1) {
        this.data.splice(dataIndex, 1)
      }
    }
  }
  protected _showByIndex(target: D, targetIndex: number) {
    let preIndex = -1
    for (let index = targetIndex - 1; index >= 0; index--) {
      // 寻找目标index前的最后一个未隐藏的index
      const prop = this.$prop[index]
      if (!this.$hidden.has(prop)) {
        const value = this.get(prop)!
        preIndex = this.data.indexOf(value)
        break
      }
    }
    this.data.splice(preIndex + 1, 0, target)
    return preIndex + 1
  }
  pushByIndex(value: D, index: number) {
    this.$prop.splice(index, 0, 1)
    this.$map.set(value.$prop, value)
    this._showByIndex(value, index)
  }
  getIndex(prop: PropertyKey) {
    return this.$prop.indexOf(prop)
  }
  hidden(prop: PropertyKey) {
    if (!this.$hidden.has(prop)) {
      const value = this.get(prop)!
      const index = this.data.indexOf(value)
      this.data.splice(index, 1)
      this.$hidden.set(prop, value)
    }
  }
  show(prop: PropertyKey) {
    const value = this.$hidden.get(prop)
    if (value) {
      this.$hidden.delete(prop)
      const index = this.getIndex(prop)
      this._showByIndex(value, index)
    }
  }
}

export default ArrayMap
