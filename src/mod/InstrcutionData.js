import _func from 'complex-func'

const dict = {
  base: ['prop', 'extend'],
  build: {
    prop: ['type', 'required'],
    class: true,
    data: true
  },
  data: {
    prop: ['type'],
    class: true,
    data: true
  },
  method: {
    prop: ['return'],
    args: true
  }
}

class InstrcutionData {
  constructor(initOption, instrcutionMap) {
    this.build = {}
    this.data = {}
    this.method = {}
    if (initOption) {
      this.initData(initOption, instrcutionMap)
    }
  }
  initData({ prop, describe, extend, build = [], data = [], method = [] }, instrcutionMap) {
    this.setDataMap(instrcutionMap)
    this.setProp(prop)
    this.setDescribe(describe)
    this.setExtend(extend)
    this.setData(build, this.build, 'build')
    this.setData(data, this.data, 'data')
    this.setData(method, this.method, 'method')
  }
  setDataMap(instrcutionMap) {
    this.dataMap = instrcutionMap
  }
  getDataMap() {
    return this.dataMap
  }
  getDataMapItem(prop, cb) {
    let instrcutionMap = this.getDataMap()
    instrcutionMap.setCallback(prop, cb)
  }
  setProp(prop) {
    this.prop = prop
  }
  setDescribe(describe) {
    if (_func.getType(describe) != 'array') {
      this.describe = [describe]
    } else {
      this.describe = [...describe]
    }
  }
  setExtend(extend) {
    this.getDataMapItem(extend, (dataItem) => {
      this.extend = dataItem
    })
  }
  formatData(item, originitem, dictItem) {
    for (let n = 0; n < dict.base.length; n++) {
      let baseProp = dict.base[n]
      item[baseProp] = originitem[baseProp]
    }
    for (let i = 0; i < dictItem.prop.length; i++) {
      let prop = dictItem.prop[i]
      item[prop] = originitem[prop]
    }
    if (_func.getType(originitem.describe) != 'array') {
      if (originitem.describe) {
        item.describe = [originitem.describe]
      } else {
        item.describe = []
      }
    } else {
      item.describe = [...originitem.describe]
    }
  }
  setData(list, data, type) {
    for (let n = 0; n < list.length; n++) {
      let originitem = list[n]
      let dictItem = dict[type]
      let item = {}
      this.formatData(item, originitem, dictItem)
      if (dictItem.class && originitem.class) {
        this.getDataMapItem(originitem.class, (dataItem) => {
          item.class = dataItem
        })
      }
      data[originitem.prop] = item
      if (dictItem.data && originitem.data) {
        item.data = {}
        this.setData(originitem.data, item.data, type)
      }
      if (dictItem.args) {
        let args = originitem.args || []
        for (let i = 0; i < args.length; i++) {
          const arg = args[i]
          if (_func.getType(arg.describe) !== 'array') {
            arg.describe = [arg.describe]
          }
        }
        data[originitem.prop].args = args
      }
    }
  }
  getData(type) {
    let origindata = this[type]
    let data = {
      prop: this.prop,
      describe: this.describe,
      data: {}
    }
    this.getDataNext(data.data, origindata, type)
    if (this.extend) {
      let extendData = this.extend.getData(type)
      data.describe = extendData.describe.concat(data.describe)
      return this.mergeData(extendData, data)
    } else {
      return data
    }
  }
  mergeData(data, currentdata) {
    if (currentdata.extend !== true) {
      for (let n in currentdata) {
        let type = _func.getType(currentdata[n])
        if (type == 'object') {
          if (!data[n]) {
            data[n] = {}
          }
          this.mergeData(data[n], currentdata[n])
        } else {
          data[n] = currentdata[n]
        }
      }
    } else {
      // 依赖选项跟属性以data为主，describe合并
      if (data.describe && currentdata.describe) {
        data.describe = data.describe.concat(currentdata.describe)
      } else if (currentdata.describe) {
        data.describe = currentdata.describe.slice()
      } else {
        data.describe = []
      }
      if (currentdata.data) {
        if (!data.data) {
          data.data = {}
        }
        this.mergeData(data.data, currentdata.data)
      }
    }
    return data
  }
  getDataNext(data, origindata, type) {
    for (let n in origindata) {
      data[n] = {}
      let dictItem = dict[type]
      this.formatData(data[n], origindata[n], dictItem)
      data[n].from = this.prop
      if (dictItem.class && origindata[n].class) {
        data[n].class = origindata[n].class.getData(type)
      }
      if (dictItem.data && origindata[n].data) {
        data[n].data = {}
        this.getDataNext(data[n].data, origindata[n].data, type)
      }
      if (dictItem.args) {
        data[n].args = origindata[n].args
      }
    }
  }
}
export default InstrcutionData
