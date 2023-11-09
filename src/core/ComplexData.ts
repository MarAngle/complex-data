import BaseData, { BaseDataInitOption } from "../data/BaseData"
import DictionaryData from "../module/DictionaryData"
import PaginationData from "../module/PaginationData"

export type ComplexDataInitOption = BaseDataInitOption

class ComplexData extends BaseData {
  static $name = 'ComplexData'
  constructor(initOption: ComplexDataInitOption) {
    super(initOption)
    this._triggerCreateLife('ComplexData', 'beforeCreate', initOption)
    this._triggerCreateLife('ComplexData', 'created', initOption)
  }
  /* --- pagination start --- */
  $setPageCount(...args: Parameters<PaginationData['setCount']>) {
    if (this.$module.pagination) {
      this.$module.pagination.setCount(...args)
    }
  }
  $getPageCount(...args: Parameters<PaginationData['getCount']>) {
    if (this.$module.pagination) {
      return this.$module.pagination.getCount(...args)
    }
  }
  $getTotalPage(...args: Parameters<PaginationData['getTotal']>) {
    if (this.$module.pagination) {
      return this.$module.pagination.getTotal(...args)
    }
  }
  $setPage(...args: Parameters<PaginationData['setPage']>) {
    if (this.$module.pagination) {
      return this.$module.pagination.setPage(...args)
    }
  }
  $getPage(...args: Parameters<PaginationData['getPage']>) {
    if (this.$module.pagination) {
      return this.$module.pagination.getPage(...args)
    }
  }
  $setSize(...args: Parameters<PaginationData['setSize']>) {
    if (this.$module.pagination) {
      return this.$module.pagination.setSize(...args)
    }
  }
  $getSize(...args: Parameters<PaginationData['getSize']>) {
    if (this.$module.pagination) {
      return this.$module.pagination.getSize(...args)
    }
  }
  $setPageAndSize(...args: Parameters<PaginationData['setPageAndSize']>) {
    if (this.$module.pagination) {
      this.$module.pagination.setPageAndSize(...args)
    }
  }
  $resetPagination(option?: boolean) {
    if (this.$module.pagination) {
      this.$module.pagination.$reset(option)
    }
  }
  $destroyPagination(option?: boolean) {
    if (this.$module.pagination) {
      this.$module.pagination.$destroy(option)
    }
  }
  /* --- pagination end --- */

  /* --- dictionary start --- */
  $updateDictionary (...args: Parameters<DictionaryData['$updateDictionary']>) {
    this.$module.dictionary!.$updateDictionary(...args)
    this.$syncData(true, '$rebuildDictionary')
  }
  $getDictionaryValue (...args: Parameters<DictionaryData['$getValue']>) {
    return this.$module.dictionary!.$getValue(...args)
  }
  $setDictionaryProp (...args: Parameters<DictionaryData['$setProp']>) {
    this.$module.dictionary!.$setProp(...args)
    this.$syncData(true, '$setDictionaryProp')
  }
  $getDictionaryProp (...args: Parameters<DictionaryData['$getProp']>) {
    return this.$module.dictionary!.$getProp(...args)
  }
  $setDictionaryPropValue (...args: Parameters<DictionaryData['$setPropValue']>) {
    this.$module.dictionary!.$setPropValue(...args)
    this.$syncData(true, '$setDictionaryPropValue')
  }
  $getDictionaryPropValue (...args: Parameters<DictionaryData['$getPropValue']>) {
    return this.$module.dictionary!.$getPropValue(...args)
  }
  $createListByDictionary (...args: Parameters<DictionaryData['$createList']>) {
    return this.$module.dictionary!.$createList(...args)
  }
  $createDataByDictionary (...args: Parameters<DictionaryData['$createData']>) {
    return this.$module.dictionary!.$createData(...args)
  }
  $updateDataByDictionary (...args: Parameters<DictionaryData['$updateData']>) {
    return this.$module.dictionary!.$updateData(...args)
  }
  $buildDictionaryPageList (...args: Parameters<DictionaryData['$buildPageList']>) {
    return this.$module.dictionary!.$buildPageList(...args)
  }
  $buildDictionaryObserveList (...args: Parameters<DictionaryData['$buildObserveList']>) {
    return this.$module.dictionary!.$buildObserveList(...args)
  }
  $createFormDataByDictionary (...args: Parameters<DictionaryData['$createFormData']>) {
    return this.$module.dictionary!.$createFormData(...args)
  }
  $createPostDataByDictionary (...args: Parameters<DictionaryData['$createPostData']>) {
    return this.$module.dictionary!.$createPostData(...args)
  }
  /* --- dictionary end --- */
}

export default ComplexData
