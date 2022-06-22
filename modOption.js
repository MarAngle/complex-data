let mapDictionary = new Map()

let modOption = {
  setDictionary(name, data, redirect) {
    if (!redirect) {
      mapDictionary.set(name, data)
    } else {
      let target = mapDictionary.get(data)
      mapDictionary.set(name, target)
    }
  },
  getDictionary(name) {
    return mapDictionary.get(name)
  },
  getDictionaryByMod(name, payload) {
    return this.getDictionary(payload.mod || name)
  },
  format(ditem, modData) {
    if (!modData) {
      modData = {}
    }
    let redirect = {}
    for (const name in modData) {
      let modItemData = modData[name]
      if (modItemData) {
        if (modItemData === true) {
          modItemData = {}
        }
        if (modItemData.$target) {
          redirect[name] = modItemData.$target
        } else {
          this.formatItem(ditem, name, modItemData)
        }
      }
    }
    for (const name in redirect) {
      ditem.$mod[name] = ditem.$mod[redirect[name]]
    }
  },
  formatItem(ditem, name, modItemData) {
    if (!modItemData.$type) {
      modItemData.$type = name
    }
    ditem.setInterface('modType', name, modItemData.$type)
    let formatDictionary = this.getDictionary(modItemData.$type)
    if (formatDictionary && formatDictionary.format) {
      ditem.$mod[name] = formatDictionary.format(ditem, name, modItemData)
    } else {
      ditem.$mod[name] = modItemData
    }
  },
  build() {
    alert('未定义BUILD')
  },
  unformat(ditem, name, payload) {
    let formatDictionary = this.getDictionaryByMod(name, payload)
    if (formatDictionary && formatDictionary.unformat) {
      return formatDictionary.unformat(ditem, name, payload)
    } else {
      return ditem.$mod[name]
    }
  }
}

export default modOption
