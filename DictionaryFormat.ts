import DictionaryData, { DictionanyModInitType, DictionaryModType } from "./src/lib/DictionaryData";
import { PageData } from "./src/lib/PageList";

export interface formatOptionItemType {
  format?: (ditem:DictionaryData, name: string, modItemData: Record<PropertyKey, any>) => Record<PropertyKey, any>,
  unformat?: (ditem:DictionaryData, name: string, payload?: Record<PropertyKey, any>) => PageData
}

const DictionaryMap: Map<string, formatOptionItemType> = new Map()

const DictionaryFormat = {
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
  format(ditem: DictionaryData, modInitOption?: DictionanyModInitType) {
    const modData: DictionaryModType = {}
    if (modInitOption) {
      const redirect: DictionaryModType = {}
      for (const modName in modInitOption) {
        let modItemData = modInitOption[modName]
        if (modItemData) {
          if (modItemData === true) {
            modItemData = {}
          }
          if (modItemData.$target) {
            redirect[modName] = modItemData.$target
          } else {
            modData[modName] = this.formatItem(ditem, modName, modItemData)
          }
        }
      }
      for (const modName in redirect) {
        modData[modName] = modData[redirect[modName]]
      }
    }
    return modData
  },
  formatItem(ditem: DictionaryData, modName: string, modItemData: Record<PropertyKey, any>) {
    if (!modItemData.$type) {
      modItemData.$type = modName
    }
    ditem.$setInterface('modType', modName, modItemData.$type)
    const formatDictionary = this.getDictionary(modItemData.$type)
    if (formatDictionary && formatDictionary.format) {
      ditem.$mod[modName] = formatDictionary.format(ditem, modName, modItemData)
    } else {
      ditem.$mod[modName] = modItemData
    }
  },
  build() {
    alert('未定义BUILD')
  },
  unformat(ditem:DictionaryData, modName: string, payload?: Record<PropertyKey, any>) {
    const formatDictionary = this.getDictionaryByMod(modName, payload)
    if (formatDictionary && formatDictionary.unformat) {
      return formatDictionary.unformat(ditem, modName, payload)
    } else {
      return ditem.$mod[modName]
    }
  }
}

export default DictionaryFormat