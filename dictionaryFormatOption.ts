import DictionaryItem, { PageData } from "./src/lib/DictionaryItem"
import { objectAny } from "./ts"


export interface formatOptionItemType {
  format?: (ditem:DictionaryItem, name: string, modItemData: objectAny) => objectAny,
  unformat?: (ditem:DictionaryItem, name: string, payload?: objectAny) => PageData
}

const DictionaryMap: Map<string, formatOptionItemType> = new Map()

const dictionaryFormatOption = {
  setDictionary(name: string, data: formatOptionItemType | string, redirect?: boolean) {
    if (!redirect) {
      DictionaryMap.set(name, data as formatOptionItemType)
    } else {
      const target = DictionaryMap.get(data as string)!
      DictionaryMap.set(name, target)
    }
  },
  getDictionary(name: string) {
    return DictionaryMap.get(name)
  },
  getDictionaryByMod(name: string, payload: objectAny = {}) {
    return this.getDictionary(payload.mod || name)
  },
  format(ditem: DictionaryItem, modData?: objectAny) {
    if (!modData) {
      modData = {}
    }
    const redirect: objectAny = {}
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
  formatItem(ditem: DictionaryItem, name: string, modItemData: objectAny) {
    if (!modItemData.$type) {
      modItemData.$type = name
    }
    ditem.$setInterface('modType', name, modItemData.$type)
    const formatDictionary = this.getDictionary(modItemData.$type)
    if (formatDictionary && formatDictionary.format) {
      ditem.$mod[name] = formatDictionary.format(ditem, name, modItemData)
    } else {
      ditem.$mod[name] = modItemData
    }
  },
  build() {
    alert('未定义BUILD')
  },
  unformat(ditem:DictionaryItem, name: string, payload?: objectAny) {
    const formatDictionary = this.getDictionaryByMod(name, payload)
    if (formatDictionary && formatDictionary.unformat) {
      return formatDictionary.unformat(ditem, name, payload)
    } else {
      return ditem.$mod[name]
    }
  }
}

export default dictionaryFormatOption
