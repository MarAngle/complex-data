import { formatInitOption } from "../utils"
import BaseData, { BaseDataInitOption } from "../data/BaseData"
import DictionaryList from '../lib/DictionaryList'
import PaginationData from '../lib/PaginationData'
import DefaultData from "../data/DefaultData"
import SearchData from "../data/SearchData"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ComplexDataInitOption<P extends undefined | DefaultData = undefined> extends BaseDataInitOption<P> {
}

class ComplexData<P extends undefined | DefaultData = undefined> extends BaseData<P> {
  static $name = 'ComplexData'
  constructor(initOption: ComplexDataInitOption<P>) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('ComplexData', 'beforeCreate', initOption)
    this.$initLoadDepend()
    this.$triggerCreateLife('ComplexData', 'created', initOption)
  }
  /* --- pagination start --- */
  $setPageData(data: number, prop: 'current' | 'size' | 'num', unTriggerLife?: boolean) {
    if (this.$module.pagination) {
      if (prop === 'current') {
        this.$module.pagination.setCurrent(data, unTriggerLife)
      } else if (prop === 'size') {
        this.$module.pagination.setSize(data, unTriggerLife) // { size, page }
      } else if (prop === 'num') {
        this.$module.pagination.setNum(data)
      }
    }
  }
  $getPageData(prop?: Parameters<PaginationData['getData']>[0]) {
    if (this.$module.pagination) {
      return this.$module.pagination.getData(prop)
    }
  }
  $getPageObject(propList?: Parameters<PaginationData['getDataObject']>[0]) {
    if (this.$module.pagination) {
      return this.$module.pagination.getDataObject(propList)
    }
  }
  $setPageCurrentAndSize(...args: Parameters<PaginationData['setCurrentAndSize']>) {
    if (this.$module.pagination) {
      this.$module.pagination.setCurrentAndSize(...args)
    }
  }
  $resetPagination() {
    if (this.$module.pagination) {
      this.$module.pagination.reset()
    }
  }
  /* --- pagination end --- */
  /* --- dictionary start --- */
  $rebuildDictionary (...args: Parameters<DictionaryList['rebuildData']>) {
    this.$module.dictionary!.rebuildData(...args)
    this.$syncData(true, '$rebuildDictionary')
  }
  $getDictionaryItem (...args: Parameters<DictionaryList['getItem']>) {
    return this.$module.dictionary!.getItem(...args)
  }
  $setDictionaryPropData (...args: Parameters<DictionaryList['$setPropData']>) {
    this.$module.dictionary!.$setPropData(...args)
    this.$syncData(true, '$setDictionaryPropData')
  }
  $getDictionaryPropData (...args: Parameters<DictionaryList['$getPropData']>) {
    return this.$module.dictionary!.$getPropData(...args)
  }
  $getDictionaryList (...args: Parameters<DictionaryList['$getList']>) {
    return this.$module.dictionary!.$getList(...args)
  }
  $getDictionaryPageList (...args: Parameters<DictionaryList['$getPageList']>) {
    return this.$module.dictionary!.$getPageList(...args)
  }
  $buildDictionaryPageList (...args: Parameters<DictionaryList['$buildPageList']>) {
    return this.$module.dictionary!.$buildPageList(...args)
  }
  $buildFormDataByDictionary (...args: Parameters<DictionaryList['$buildFormData']>) {
    return this.$module.dictionary!.$buildFormData(...args)
  }
  $buildEditDataByDictionary (...args: Parameters<DictionaryList['$buildEditData']>) {
    return this.$module.dictionary!.$buildEditData(...args)
  }
  $createDataByDictionary (...args: Parameters<DictionaryList['createData']>) {
    return this.$module.dictionary!.createData(...args)
  }
  $updateDataByDictionary (...args: Parameters<DictionaryList['updateData']>) {
    return this.$module.dictionary!.updateData(...args)
  }
  $formatDataByDictionary (...args: Parameters<DictionaryList['formatData']>) {
    return this.$module.dictionary!.formatData(...args)
  }
  $formatListDataByDictionary (...args: Parameters<DictionaryList['formatListData']>) {
    return this.$module.dictionary!.formatListData(...args)
  }
  /* --- dictionary end --- */

  /* --- search start --- */
  $setSearchForm(...args: Parameters<SearchData['setForm']>) {
    this.$module.search!.setForm(...args)
  }
  $getSearch(...args: Parameters<SearchData['getData']>) {
    if (this.$module.search) {
      return this.$module.search.getData(...args)
    } else {
      return {}
    }
  }
  $initSearchData(...args: Parameters<SearchData['$initSearchData']>) {
    this.$module.search!.$initSearchData(...args)
  }
  $setSearch(modName?: string, from = 'set') {
    return new Promise((resolve, reject) => {
      this.$triggerLife('beforeSearch', this, modName, from)
      this.$module.search!.$syncFormData(modName).then(() => {
        this.$reloadData({
          page: true,
          choice: {
            from: 'search',
            act: from
          }
        })!.then((res => {
          this.$triggerLife('searched', this, modName, from)
          resolve(res)
        })).catch(err => {
          this.$triggerLife('searchFail', this, modName, from, err)
          reject(err)
        })
      }).catch(err => {
        this.$triggerLife('searchFail', this, modName, from, err)
        reject(err)
      })
    })
  }
  $resetSearch(modName?: string) {
    return new Promise((resolve, reject) => {
      this.$module.search!.$resetFormData('reset', modName)
      this.$setSearch(modName, 'reset').then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
  /* --- search end --- */
}

export default ComplexData
