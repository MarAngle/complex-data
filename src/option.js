
let maindata = {
  data: {}
}

maindata.setData = function (data = {}) {
  let temp = {}
  for (let n in data) {
    if (!data[n].type) {
      this.data[n] = data[n]
    } else {
      temp[n] = data[n]
    }
  }
  for (let n in temp) {
    this.data[n] = this.data[temp[n].type]
  }
}

maindata.getData = function (prop) {
  if (this.data[prop]) {
    return this.data[prop]
  } else {
    return false
  }
}

maindata.getDataByProp = function (prop, payload) {
  let modprop = payload.mod || prop
  return this.getData(modprop)
}

maindata.build = function (data, prop, payload = {}) {
  let moditem = this.getDataByProp(prop, payload)
  if (moditem && moditem.build) {
    moditem.build(data, prop, payload)
  }
}

maindata.format = function (ditem, moddata) {
  if (!moddata) {
    moddata = {}
  }
  let redirect = {}
  for (const name in moddata) {
    let modItemData = moddata[name]
    if (modItemData) {
      if (modItemData === true) {
        modItemData = {}
      }
      if (modItemData.$target) {
        redirect[name] = modItemData.$target
      } else if (modItemData.type == 'edit') {
        redirect[name] = 'edit'
      } else {
        this.formatNext(ditem, name, modItemData)
      }
    }
  }
  for (const name in redirect) {
    ditem.mod[name] = ditem.mod[redirect[name]]
  }
}

maindata.formatNext = function (ditem, prop, moditem) {
  if (!moditem.formatType) {
    moditem.formatType = prop
  }
  ditem.setInterface('modtype', prop, moditem.formatType)
  let formatItem = this.getData(moditem.formatType)
  if (formatItem && formatItem.format) {
    formatItem.format(ditem, prop, moditem)
  } else {
    ditem.mod[prop] = moditem
  }
}

maindata.unformat = function (ditem, prop, payload) {
  let formatItem = this.getDataByProp(prop, payload)
  if (formatItem && formatItem.unformat) {
    return formatItem.unformat(ditem, prop, payload)
  } else {
    return ditem.mod[prop]
  }
}

export default maindata
