import { formatInitOption } from "../utils"
import BaseData, { BaseDataInitOption, forceType, promiseFunction } from "./BaseData"
import DictionaryList from '../lib/DictionaryList'
import PaginationData from '../lib/PaginationData'
import UpdateData from '../lib/UpdateData'

export interface ComplexDataInitOption extends BaseDataInitOption {
  $updateData?: promiseFunction
}


class ComplexData extends BaseData {
  static $name = 'ComplexData'
  $updateData?: promiseFunction
  constructor(initOption: ComplexDataInitOption) {
    initOption = formatInitOption(initOption)
    super(initOption)
    this.$triggerCreateLife('ComplexData', 'beforeCreate', initOption)
    this.$updateData = initOption.$updateData
    this.$triggerCreateLife('ComplexData', 'created', initOption)
  }
  /* --- update start --- */

  $startUpdate(...args: Parameters<UpdateData['start']>) {
    return this.$module.update!.start(...args)
  }
  $updateImmerdiate(...args: Parameters<UpdateData['updateImmerdiate']>) {
    return this.$module.update!.updateImmerdiate(...args)
  }
  $resetUpdateNum(...args: Parameters<UpdateData['resetNum']>) {
    return this.$module.update!.resetNum(...args)
  }
  $clearUpdate(...args: Parameters<UpdateData['clear']>) {
    return this.$module.update!.clear(...args)
  }
  $resetUpdate(...args: Parameters<UpdateData['reset']>) {
    return this.$module.update!.reset(...args)
  }
  $triggerUpdateData (...args: any[]) {
    const promise = this.$triggerMethodByStatusWidthOperate(['$updateData', args, 'update', false, (target, res) => {
      if (target == 'start') {
        this.$triggerLife('beforeUpdate', this, ...args)
      } else if (target == 'success') {
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
    return this.$setPromise('update', promise)
  }
  $loadUpdateData (force?: forceType, ...args: any[]) {
    if (force === true) {
      force = {}
    }
    const updateStatus = this.$getStatus('update')
    if (updateStatus == 'un') {
      this.$triggerUpdateData(...args)
    } else { // ing
      // 直接then'
      if (force) {
        this.$triggerUpdateData(...args)
      }
    }
    return this.$triggerPromise('update', {
      errmsg: this.$createMsg(`promise模块无update数据(update状态:${updateStatus})`),
      correct: force ? force.correct : undefined
    })
  }
  /* --- update end --- */
  $autoLoadData(...args: any[]) {
    let next: string
    const loadStatus = this.$getStatus('load')
    if (loadStatus != 'success') {
      next = 'load'
    } else {
      next = 'update'
    }
    if (next == 'load') {
      return this.$loadData(true, ...args)
    } else {
      return this.$loadUpdateData(true, ...args)
    }
  }
  /* --- pagination start --- */
  $setPageData(data: number, prop?: 'current' | 'size' | 'num', unTriggerLife?: boolean) {
    if (this.$module.pagination) {
      if (prop == 'current') {
        this.$module.pagination.setCurrent(data, unTriggerLife)
      } else if (prop == 'size') {
        this.$module.pagination.setSize(data, unTriggerLife) // { size, page }
      } else if (prop == 'num') {
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
    this.$syncData('rebuildDictionary')
  }
  $getDictionaryItem (...args: Parameters<DictionaryList['getItem']>) {
    return this.$module.dictionary!.getItem(...args)
  }
  $setDictionaryPropData (...args: Parameters<DictionaryList['$setPropData']>) {
    this.$module.dictionary!.$setPropData(...args)
    this.$syncData('setDictionaryPropData')
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
  /* --- choice start --- */
  /* --- choice end --- */

  /* --- search start --- */
  /* --- search end --- */
}

export default ComplexData
