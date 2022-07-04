import Data from "./src/data/Data"
import DictionaryItem from "./src/mod/DictionaryItem"

const mapDictionary = new Map()

const modOption = {
  setDictionary(name: string, data: Data, redirect?: boolean) {
    if (!redirect) {
      mapDictionary.set(name, data)
    } else {
      const target = mapDictionary.get(data)
      mapDictionary.set(name, target)
    }
  },
  getDictionary(name: string) {
    return mapDictionary.get(name)
  },
  getDictionaryByMod(name: string, payload) {
    return this.getDictionary(payload.mod || name)
  },
  format(ditem: DictionaryItem, modData) {
    if (!modData) {
      modData = {}
    }
    const redirect = {}
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
  formatItem(ditem: DictionaryItem, name, modItemData) {
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
  unformat(ditem: DictionaryItem, name, payload) {
    let formatDictionary = this.getDictionaryByMod(name, payload)
    if (formatDictionary && formatDictionary.unformat) {
      return formatDictionary.unformat(ditem, name, payload)
    } else {
      return ditem.$mod[name]
    }
  }
}

export default modOption
