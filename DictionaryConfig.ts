import DictionaryData, { DictionanyModDataInitType, DictionanyModItemInitType, DictionaryModType } from "./src/lib/DictionaryData";

export interface unformatOption {
  mod?: string
}

export interface formatOptionItemType {
  format?: (ditem:DictionaryData, name: string, modItemData: DictionanyModItemInitType) => DictionaryModType,
  unformat?: (ditem:DictionaryData, name: string, option?: unformatOption) => unknown
}


const DictionaryMap: Map<string, formatOptionItemType> = new Map()

const DictionaryConfig = {
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
  getDictionaryByMod(name: string, option: unformatOption = {}) {
    return this.getDictionary(option.mod || name)
  },
  format(ditem: DictionaryData, modInitOption?: DictionanyModDataInitType) {
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
  formatItem(ditem: DictionaryData, modName: string, modItemData: DictionanyModItemInitType) {
    if (!modItemData.$type) {
      modItemData.$type = modName
    }
    ditem.$setInterface('modType', modName, modItemData.$type)
    const formatDictionary = this.getDictionary(modItemData.$type)
    if (formatDictionary && formatDictionary.format) {
      return formatDictionary.format(ditem, modName, modItemData)
    } else {
      return modItemData as DictionaryModType
    }
  },
  build() {
    alert('未定义BUILD')
  },
  unformat(ditem:DictionaryData, modName: string, option?: unformatOption) {
    const formatDictionary = this.getDictionaryByMod(modName, option)
    if (formatDictionary && formatDictionary.unformat) {
      return formatDictionary.unformat(ditem, modName, option)
    } else {
      return ditem.$mod[modName]
    }
  }
}

export default DictionaryConfig