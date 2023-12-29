import BaseData, { BaseDataInitOption, loadFunctionType } from "../data/BaseData"
import ModuleData, { ModuleDataInitOption } from "../module/ModuleData"
import SearchData, { resetFormOption } from "../module/SearchData"
import DictionaryData from "../module/DictionaryData"
import PaginationData from "../module/PaginationData"
import UpdateData from "../module/UpdateData"
import ForceValue, { ForceValueInitOption } from "../lib/ForceValue"

export type buildDataType = (targetData: Record<PropertyKey, unknown>, type?: string, payload?: unknown) => Promise<unknown>
export type changeDataType = (targetData: Record<PropertyKey, unknown>, originData: Record<PropertyKey, unknown>, type?: string, payload?: unknown) => Promise<unknown>
export type deleteDataType = (targetData: Record<PropertyKey, unknown>, payload?: unknown) => Promise<unknown>
export type multipleDeleteDataType = (choiceList: Record<PropertyKey, unknown>[], payload?: unknown) => Promise<unknown>
export type exportDataType = loadFunctionType
export type importDataType = (file: File, payload?: unknown) => Promise<unknown>

export interface ComplexDataInitOption extends BaseDataInitOption {
  module: ModuleDataInitOption
  updateData?: loadFunctionType
  buildData?: buildDataType
  changeData?: changeDataType
  deleteData?: deleteDataType
  multipleDeleteData?: multipleDeleteDataType
  exportData?: exportDataType
  importData?: importDataType
}

class ComplexData extends BaseData {
  static $name = 'ComplexData'
  declare $module: ModuleData
  $updateData?: loadFunctionType
  $buildData?: buildDataType
  $changeData?: changeDataType
  $deleteData?: deleteDataType
  $multipleDeleteData?: multipleDeleteDataType
  $exportData?: exportDataType
  $importData?: importDataType
  constructor(initOption: ComplexDataInitOption) {
    super(initOption)
    this._triggerCreateLife('ComplexData', false, initOption)
    this.$updateData = initOption.updateData
    this.$buildData = initOption.buildData
    this.$changeData = initOption.changeData
    this.$deleteData = initOption.deleteData
    this.$multipleDeleteData = initOption.multipleDeleteData
    this.$exportData = initOption.exportData
    this.$importData = initOption.importData
    this._triggerCreateLife('ComplexData', true, initOption)
  }
  /* --- update start --- */
  $startUpdate(...args: Parameters<UpdateData['start']>) {
    return this.$module.update!.start(...args)
  }
  $updateImmerdiate(...args: Parameters<UpdateData['immerdiate']>) {
    return this.$module.update!.immerdiate(...args)
  }
  $clearUpdate(...args: Parameters<UpdateData['clear']>) {
    return this.$module.update!.clear(...args)
  }
  $resetUpdate(...args: Parameters<UpdateData['$reset']>) {
    return this.$module.update!.$reset(...args)
  }
  $destroyUpdate(...args: Parameters<UpdateData['$destroy']>) {
    return this.$module.update!.$destroy(...args)
  }
  protected _triggerUpdateData (...args: unknown[]) {
    if (this.$active.auto) {
      // 自动激活模式下主动触发激活操作
      this.$changeActive('actived', 'updateData')
    }
    const promise = this.$triggerMethodByOperate(['$updateData', args, 'update', false, (target, res) => {
      if (target === 'start') {
        this.$triggerLife('beforeUpdate', this, ...args)
      } else if (target === 'success') {
        this.$triggerLife('updated', this, {
          res: res,
          args: args
        })
      } else {
        this.$triggerLife('updateFail', this, {
          res: res,
          args: args
        })
      }
    }])
    return this._setPromise('update', promise)
  }
  $loadUpdateData (forceInitOption?: boolean | ForceValueInitOption | ForceValue, ...args: unknown[]) {
    const force = new ForceValue(forceInitOption)
    const updateStatus = this.$getStatus('update')
    if (['un', 'success', 'fail'].indexOf(updateStatus) > -1) {
      this._triggerUpdateData(...args)
    } else { // ing
      // 直接then'
      if (force.data && force.ing) {
        this._triggerUpdateData(...args)
      }
    }
    const emptyMsg = this.$createMsg(`promise模块无update数据(update状态:${updateStatus})`)
    if (!force.promise) {
      force.promise = {
        emptyMsg: emptyMsg
      }
    } else if (force.promise.emptyMsg === undefined) {
      force.promise.emptyMsg = emptyMsg
    }
    return this._triggerPromise('update', force.promise)
  }
  /* --- update end --- */
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
  $getDictionaryList (...args: Parameters<DictionaryData['$getList']>) {
    return this.$module.dictionary!.$getList(...args)
  }
  $getDictionaryPageList (...args: Parameters<DictionaryData['$getPageList']>) {
    return this.$module.dictionary!.$getPageList(...args)
  }
  $buildDictionaryObserveList (...args: Parameters<DictionaryData['$buildObserveList']>) {
    return this.$module.dictionary!.$buildObserveList(...args)
  }
  $createEditDataByDictionary (...args: Parameters<DictionaryData['$createEditData']>) {
    return this.$module.dictionary!.$createEditData(...args)
  }
  $createPostDataByDictionary (...args: Parameters<DictionaryData['$createPostData']>) {
    return this.$module.dictionary!.$createPostData(...args)
  }
  /* --- dictionary end --- */
  /* --- search start --- */
  $setSearchForm(...args: Parameters<SearchData['setForm']>) {
    return this.$module.search!.setForm(...args)
  }
  $getSearch(...args: Parameters<SearchData['getData']>) {
    if (this.$module.search) {
      return this.$module.search.getData(...args)
    } else {
      return {}
    }
  }
  $setSearch(from = 'set') {
    return new Promise((resolve, reject) => {
      this.$triggerLife('beforeSearch', this, from)
      this.$module.search!.$syncFormData().then(() => {
        this.$reloadData({
          data: true,
          ing: true,
          module: {
            pagination: true,
            choice: {
              from: 'search',
              act: from
            }
          }
        })!.then((res => {
          this.$triggerLife('searched', this, from)
          resolve(res)
        })).catch(err => {
          this.$triggerLife('searchFail', this, from, err)
          reject(err)
        })
      }).catch(err => {
        this.$triggerLife('searchFail', this, from, err)
        reject(err)
      })
    })
  }
  $resetSearch(option?: resetFormOption) {
    return new Promise((resolve, reject) => {
      this.$module.search!.$resetFormData('reset', option)
      this.$setSearch('reset').then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
  /* --- search end --- */
}

export default ComplexData
