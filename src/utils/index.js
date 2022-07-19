import _func from 'complex-func'
import config from '../../config'

function setUnEnumProp(object, prop, data) {
  Object.defineProperty(object, prop, {
    enumerable: false,
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
  let list = []
  setUnEnumProp(list, '$type', type)
  setUnEnumProp(list, '$order', { data: [] })
  setUnEnumProp(list, '$map', { data: new Map(), hidden: new Map() })
  setUnEnumProp(list, '$watch', new Map())
  setUnEnumProp(list, '$data', null)

  setUnEnumProp(list, '$push', function(target) {
    this.push(target)
    this.$order.data.push(target.prop)
    this.$map.data.set(target.prop, target)
  })
  setUnEnumProp(list, '$unshift', function(target) {
    this.unshift(target)
    this.$order.data.unshift(target.prop)
    this.$map.data.set(target.prop, target)
  })
  setUnEnumProp(list, '$pop', function() {
    const deleteItem = this.pop()
    const deleteItemProp = deleteItem.prop
    // 删除顺序，为避免结尾隐藏情况，单独判断
    this.$order.data.splice(this.$order.data.indexOf(this.$order.data), 1)
    this.$map.data.delete(deleteItemProp)
    this.$map.hidden.delete(deleteItemProp)
  })
  setUnEnumProp(list, '$shift', function() {
    const deleteItem = this.shift()
    const deleteItemProp = deleteItem.prop
    // 删除顺序，为避免结尾隐藏情况，单独判断
    this.$order.data.splice(this.$order.data.indexOf(this.$order.data), 1)
    this.$map.data.delete(deleteItemProp)
    this.$map.hidden.delete(deleteItemProp)
  })

  setUnEnumProp(list, '$hidden', function(prop) {
    if (!this.$map.hidden.get(prop)) {
      let target = this.$map.data.get(prop)
      let index = this.indexOf(target)
      this.splice(index, 1)
      this.$map.hidden.set(prop, target)
    }
  })
  setUnEnumProp(list, '$show', function(prop) {
    let target = this.$map.hidden.get(prop)
    if (target) {
      this.$map.hidden.delete(prop)
      let totalIndex = this.$order.data.indexOf(prop)
      this.$addItemByPreIndex(totalIndex - 1, target)
    }
  })
  setUnEnumProp(list, '$addItemByPreIndex', function(preIndex, target) {
    let preCurrentIndex = -1
    for (preIndex; preIndex >= 0; preIndex--) {
      // 获取总顺序
      let preProp = this.$order.data[preIndex]
      if (!this.$map.hidden.get(preProp)) {
        let preItem = this.$map.data.get(preProp)
        preCurrentIndex = this.indexOf(preItem)
        break
      }
    }
    this.splice(preCurrentIndex + 1, 0, target)
  })

  // 根据前prop添加对象
  setUnEnumProp(list, '$addItem', function(target, preProp) {
    if (preProp) {
      let preIndex = this.$order.data.indexOf(preProp)
      this.$addItemByPreIndex(preIndex, target)
      this.$order.data.splice(preIndex + 1, 0, target.prop)
    } else {
      this.unshift(target)
    }
  })
  // 删除对象
  setUnEnumProp(list, '$delItem', function(prop) {
    let target = this.$map.data.get(prop)
    this.$map.data.delete(prop)
    this.$map.hidden.delete(prop)
    let totalIndex = this.$order.data.indexOf(prop)
    this.$order.data.splice(totalIndex, 1)
    let index = this.indexOf(target)
    if (index > -1) {
      this.splice(index, 1)
    }
  })
  setUnEnumProp(list, '$setData', function(data) {
    _func.observe(data)
    this.$data = data
    this.$observe()
  })
  setUnEnumProp(list, '$triggerObserve', function(prop, val) {
    this.$map.data.forEach((item) => {
      if (item.edit.$observe) {
        item.edit.$observe(list, prop, val)
      }
    })
  })
  setUnEnumProp(list, '$observe', function() {
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
