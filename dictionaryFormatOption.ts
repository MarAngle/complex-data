import DictionaryItem, { PageData } from "./src/lib/DictionaryItem"

export interface formatOptionItemType {
  format?: (ditem:DictionaryItem, name: string, modItemData: Record<PropertyKey, any>) => Record<PropertyKey, any>,
  unformat?: (ditem:DictionaryItem, name: string, payload?: Record<PropertyKey, any>) => PageData
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
  getDictionaryByMod(name: string, payload: Record<PropertyKey, any> = {}) {
    return this.getDictionary(payload.mod || name)
  },
  format(ditem: DictionaryItem, modData?: Record<PropertyKey, any>) {
    if (!modData) {
      modData = {}
    }
    const redirect: Record<PropertyKey, any> = {}
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
  formatItem(ditem: DictionaryItem, name: string, modItemData: Record<PropertyKey, any>) {
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
  unformat(ditem:DictionaryItem, name: string, payload?: Record<PropertyKey, any>) {
    const formatDictionary = this.getDictionaryByMod(name, payload)
    if (formatDictionary && formatDictionary.unformat) {
      return formatDictionary.unformat(ditem, name, payload)
    } else {
      return ditem.$mod[name]
    }
  }
}

export default dictionaryFormatOption
