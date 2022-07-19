import _func from 'complex-func'

function def(object, prop, data, enumerable) {
  Object.defineProperty(object, prop, {
    enumerable: !!enumerable,
    configurable: true,
    writable: true,
    value: data
  })
}

let utils = {}

/**
 * 合并数据，仅合并一层
 * @param {*} originData
 * @param {*} defaultData
 * @returns {object}
 */
utils.formatData = function(originData, defaultData) {
  if (originData) {
    return {
      ...defaultData,
      ...originData
    }
  } else {
    return defaultData
  }
}

utils.createDictionaryPageList = function(type, olist) {
  const list = []
  def(list, '$type', type)
  def(list, '$order', [])
  def(list, '$map', { data: new Map(), hidden: new Map() })
  def(list, '$data', null)
  def(list, '$watch', new Map())

  def(list, '$push', function(target) {
    this.push(target)
    this.$order.push(target.prop)
    this.$map.data.set(target.prop, target)
  })
  def(list, '$unshift', function(target) {
    this.unshift(target)
    this.$order.unshift(target.prop)
    this.$map.data.set(target.prop, target)
  })
  def(list, '$pop', function() {
    const deleteItem = this.pop()
    const deleteItemProp = deleteItem.prop
    // 删除顺序，为避免结尾隐藏情况，单独判断
    this.$order.splice(this.$order.indexOf(this.$order), 1)
    this.$map.data.delete(deleteItemProp)
    this.$map.hidden.delete(deleteItemProp)
  })
  def(list, '$shift', function() {
    const deleteItem = this.shift()
    const deleteItemProp = deleteItem.prop
    // 删除顺序，为避免结尾隐藏情况，单独判断
    this.$order.splice(this.$order.indexOf(this.$order), 1)
    this.$map.data.delete(deleteItemProp)
    this.$map.hidden.delete(deleteItemProp)
  })
  def(list, '$addItemByPreIndex', function(preIndex, target) {
    let preCurrentIndex = -1
    for (preIndex; preIndex >= 0; preIndex--) {
      // 获取总顺序
      const preProp = this.$order[preIndex]
      if (!this.$map.hidden.get(preProp)) {
        const preItem = this.$map.data.get(preProp)
        preCurrentIndex = this.indexOf(preItem)
        break
      }
    }
    this.splice(preCurrentIndex + 1, 0, target)
  })

  def(list, 'showOrder', function() {
    return console.log(JSON.stringify(this.$order))
  })
  def(list, 'setOrder', function(order) {
    let currentOrder = []
    for (let i = 0; i < order.length; i++) {
      const prop = order[i]
      const index = this.$order.indexOf(prop)
      if (index > -1) {
        currentOrder.push(prop)
        this.$order.splice(index, 1)
      }
    }
    for (let n = 0; n < this.$order.length; n++) {
      const prop = this.$order[n];
      currentOrder.push(prop)
    }
    this.$order = currentOrder
    this.syncOrder()
  })
  def(list, 'syncOrder', function() {
    _func.clearArray(this)
    for (let n = 0; n < this.$order.length; n++) {
      this.push(this.getItem(this.$order[n]))
    }
  })
  def(list, 'getItem', function(prop) {
    return this.$map.data.get(prop)
  })
  // 根据前prop添加对象
  def(list, 'addItem', function(target, preProp) {
    if (preProp) {
      const preIndex = this.$order.indexOf(preProp)
      this.$addItemByPreIndex(preIndex, target)
      this.$order.splice(preIndex + 1, 0, target.prop)
    } else {
      this.unshift(target)
    }
  })
  // 删除对象
  def(list, 'delItem', function(prop) {
    const target = this.$map.data.get(prop)
    this.$map.data.delete(prop)
    this.$map.hidden.delete(prop)
    const totalIndex = this.$order.indexOf(prop)
    this.$order.splice(totalIndex, 1)
    const index = this.indexOf(target)
    if (index > -1) {
      this.splice(index, 1)
    }
  })
  def(list, 'hidden', function(prop) {
    if (!this.$map.hidden.has(prop)) {
      const target = this.getItem(prop)
      const index = this.indexOf(target)
      this.splice(index, 1)
      this.$map.hidden.set(prop, target)
    }
  })
  def(list, 'show', function(prop) {
    const target = this.$map.hidden.get(prop)
    if (target) {
      this.$map.hidden.delete(prop)
      const totalIndex = this.$order.indexOf(prop)
      this.$addItemByPreIndex(totalIndex - 1, target)
    }
  })

  def(list, 'setData', function(data) {
    _func.observe(data)
    this.$data = data
    this.$observe()
  })
  def(list, '$triggerObserve', function(prop, val, from) {
    this.$map.data.forEach((item) => {
      if (item.edit.$observe) {
        item.edit.$observe(list, prop, val, from)
      }
    })
  })
  def(list, '$observe', function() {
    this.$watch.forEach(function(watcher) {
      watcher.stop()
    })
    if (this.$data) {
      for (const prop in this.$data) {
        this.$watch.set(prop, new _func.Watcher(this.$data, prop, {
          deep: true,
          handler: (val) => {
            this.$triggerObserve(prop, val, 'watch')
          }
        }))
        this.$triggerObserve(prop, this.$data[prop], 'init')
      }
    }
  })
  if (olist) {
    for (let i = 0; i < olist.length; i++) {
      const item = olist[i];
      list.$push(item)
    }
  }
  return list
}

export default utils
