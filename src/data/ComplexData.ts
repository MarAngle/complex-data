import BaseData, { BaseDataInitOption, loadFunctionType } from "./BaseData"
import ModuleData, { ModuleDataInitOption } from "../module/ModuleData"
import SearchData, { resetOption } from "../module/SearchData"
import DictionaryData from "../module/DictionaryData"
import PaginationData from "../module/PaginationData"
import UpdateData from "../module/UpdateData"
import ForceValue, { ForceValueInitOption } from "../lib/ForceValue"
import { DefaultBufferType } from "./DefaultData"
import ChoiceData from "../module/ChoiceData"

export type updateDataType = loadFunctionType
export type buildDataType = (targetData: Record<PropertyKey, any>, type?: string, ...args: unknown[]) => Promise<any>
export type changeDataType = (targetData: Record<PropertyKey, any>, originData: Record<PropertyKey, any>, type: string, ...args: unknown[]) => Promise<any>
export type editDataType = changeDataType
export type deleteDataType = (targetData: Record<PropertyKey, any>, ...args: unknown[]) => Promise<any>
export type refreshDataType = (targetData: Record<PropertyKey, any>, ...args: unknown[]) => Promise<any>
export type multipleDeleteDataType = (choiceList: Record<PropertyKey, any>[], ...args: unknown[]) => Promise<any>
export type exportDataType = loadFunctionType
export type importDataType = (file: File, ...args: unknown[]) => Promise<any>

export interface ComplexDataInitOption extends BaseDataInitOption {
  module: ModuleDataInitOption
  updateData?: updateDataType
  buildData?: buildDataType
  changeData?: changeDataType
  editData?: editDataType
  deleteData?: deleteDataType
  refreshData?: refreshDataType
  multipleDeleteData?: multipleDeleteDataType
  exportData?: exportDataType
  importData?: importDataType
}

interface ComplexDataWithFunction {
  updateData: updateDataType
  buildData: buildDataType
  changeData: changeDataType
  editData: editDataType
  deleteData: deleteDataType
  refreshData: refreshDataType
  multipleDeleteData: multipleDeleteDataType
  exportData: exportDataType
  importData: importDataType
}

interface ComplexDataWithMainFunction {
  $updateData: updateDataType
  $buildData: buildDataType
  $changeData: changeDataType
  $editData: editDataType
  $deleteData: deleteDataType
  $refreshData: refreshDataType
  $multipleDeleteData: multipleDeleteDataType
  $exportData: exportDataType
  $importData: importDataType
}

class ComplexData<Buffer extends DefaultBufferType = DefaultBufferType> extends BaseData<Buffer> implements ComplexDataWithFunction, ComplexDataWithMainFunction {
  static $name = 'ComplexData'
  declare $module: ModuleData
  constructor(initOption: ComplexDataInitOption) {
    super(initOption)
    this._triggerCreateLife('ComplexData', false, initOption)
    if (initOption.updateData) {
      this.$updateData = initOption.updateData
    }
    if (initOption.buildData) {
      this.$buildData = initOption.buildData
    }
    if (initOption.changeData) {
      this.$changeData = initOption.changeData
    }
    if (initOption.editData) {
      this.$editData = initOption.editData
    }
    if (initOption.deleteData) {
      this.$deleteData = initOption.deleteData
    }
    if (initOption.refreshData) {
      this.$refreshData = initOption.refreshData
    }
    if (initOption.multipleDeleteData) {
      this.$multipleDeleteData = initOption.multipleDeleteData
    }
    if (initOption.exportData) {
      this.$exportData = initOption.exportData
    }
    if (initOption.importData) {
      this.$importData = initOption.importData
    }
    this._triggerCreateLife('ComplexData', true, initOption)
  }
  $updateData(..._args: any[]): Promise<any> {
    return Promise.reject({ status: 'fail', msg: '$updateData未定义' })
  }
  $buildData(_targetData: Record<PropertyKey, any>, _type?: string, ..._args: unknown[]): Promise<any> {
    return Promise.reject({ status: 'fail', msg: '$buildData未定义' })
  }
  $changeData(_targetData: Record<PropertyKey, any>, _originData: Record<PropertyKey, any>, _type: string, ..._args: unknown[]): Promise<any> {
    return Promise.reject({ status: 'fail', msg: '$changeData未定义' })
  }
  $editData(_targetData: Record<PropertyKey, any>, _originData: Record<PropertyKey, any>, _type: string, ..._args: unknown[]): Promise<any> {
    return Promise.reject({ status: 'fail', msg: '$editData未定义' })
  }
  $deleteData(_targetData: Record<PropertyKey, any>, ..._args: unknown[]): Promise<any> {
    return Promise.reject({ status: 'fail', msg: '$deleteData未定义' })
  }
  $refreshData(_targetData: Record<PropertyKey, any>, ..._args: unknown[]): Promise<any> {
    return Promise.resolve({ status: 'success', msg: '$refreshData未定义' })
  }
  $multipleDeleteData(_choiceList: Record<PropertyKey, any>[], ..._args: unknown[]): Promise<any> {
    return Promise.reject({ status: 'fail', msg: '$multipleDeleteData未定义' })
  }
  $exportData(..._args: any[]): Promise<any> {
    return Promise.reject({ status: 'fail', msg: '$exportData未定义' })
  }
  $importData(_file: File, ..._args: unknown[]): Promise<any> {
    return Promise.reject({ status: 'fail', msg: '$importData未定义' })
  }
  // 更新数据
  updateData(...args: any[]): Promise<any> {
    const promise = this.$updateData(...args)
    return promise
  }
  // 新增数据
  buildData(targetData: Record<PropertyKey, any>, type?: string, ...args: unknown[]): Promise<any> {
    const promise = this.$buildData(targetData, type, ...args)
    promise.then(() => {
      this.triggerLife('dataChange', this, 'buildData', targetData, type, ...args)
    })
    return promise
  }
  // 修改数据
  changeData(targetData: Record<PropertyKey, any>, originData: Record<PropertyKey, any>, type: string, ...args: unknown[]): Promise<any> {
    const promise = this.$updateData(targetData, originData, type, ...args)
    promise.then(() => {
      this.triggerLife('dataChange', this, 'changeData', targetData, originData, type, ...args)
    })
    return promise
  }
  // 编辑数据总方法
  editData(targetData: Record<PropertyKey, any>, originData: Record<PropertyKey, any>, type: string, ...args: unknown[]): Promise<any> {
    const promise = this.$updateData(targetData, originData, type, ...args)
    promise.then(() => {
      this.triggerLife('dataChange', this, 'editData', targetData, originData, type, ...args)
    })
    return promise
  }
  // 删除数据
  deleteData(targetData: Record<PropertyKey, any>, ...args: unknown[]): Promise<any> {
    const promise = this.$updateData(targetData, ...args)
    promise.then(() => {
      this.triggerLife('dataChange', this, 'deleteData', targetData, ...args)
    })
    return promise
  }
  // 刷新数据
  refreshData(targetData: Record<PropertyKey, any>, ...args: unknown[]): Promise<any> {
    const promise = this.$updateData(targetData, ...args)
    return promise
  }
  // 删除多选数据
  multipleDeleteData(choiceList: Record<PropertyKey, any>[], ...args: unknown[]): Promise<any> {
    const promise = this.$updateData(choiceList, ...args)
    promise.then(() => {
      this.triggerLife('dataChange', this, 'multipleDeleteData', choiceList, ...args)
    })
    return promise
  }
  // 导出数据
  exportData(...args: any[]): Promise<any> {
    const promise = this.$updateData(...args)
    return promise
  }
  // 导入数据
  importData(file: File, ...args: unknown[]): Promise<any> {
    const promise = this.$updateData(file, ...args)
    promise.then(() => {
      this.triggerLife('dataChange', this, 'importData', file, ...args)
    })
    return promise
  }
  /* --- update start --- */
  startUpdate(...args: Parameters<UpdateData['start']>) {
    return this.$module.update!.start(...args)
  }
  updateImmerdiate(...args: Parameters<UpdateData['immerdiate']>) {
    return this.$module.update!.immerdiate(...args)
  }
  clearUpdate(...args: Parameters<UpdateData['clear']>) {
    return this.$module.update!.clear(...args)
  }
  resetUpdate(...args: Parameters<UpdateData['reset']>) {
    return this.$module.update!.reset(...args)
  }
  destroyUpdate(...args: Parameters<UpdateData['destroy']>) {
    return this.$module.update!.destroy(...args)
  }
  protected _triggerUpdateData (...args: unknown[]) {
    if (this.$active.auto) {
      // 自动激活模式下主动触发激活操作
      this.changeActive('actived', 'updateData')
    }
    const promise = this.triggerMethodWithOperateAndStatus('$updateData', args, {
      status: 'update',
      strict: false,
      trigger: (target, res) => {
        if (target === 'start') {
          this.triggerLife('beforeUpdate', this, ...args)
        } else if (target === 'success') {
          this.triggerLife('updated', this, {
            res: res,
            args: args
          })
        } else {
          this.triggerLife('updateFail', this, {
            res: res,
            args: args
          })
        }
      }
    })
    return this._setPromise('update', promise)
  }
  loadUpdateData (forceInitOption?: boolean | ForceValueInitOption | ForceValue, ...args: unknown[]) {
    const force = new ForceValue(forceInitOption)
    const updateStatus = this.getStatus('update')
    if (['un', 'success', 'fail'].indexOf(updateStatus) > -1) {
      this._triggerUpdateData(...args)
    } else { // ing
      // 直接then'
      if (force.data && force.ing) {
        this._triggerUpdateData(...args)
      }
    }
    const emptyMsg = this._createMsg(`promise模块无update数据(update状态:${updateStatus})`)
    if (!force.promise) {
      force.promise = {
        emptyMsg: emptyMsg
      }
    } else if (force.promise.emptyMsg == undefined) {
      force.promise.emptyMsg = emptyMsg
    }
    return this._triggerPromise('update', force.promise)
  }
  /* --- update end --- */
  /* --- choice start --- */
  getChoiceData(...args: Parameters<ChoiceData['getData']>) {
    if (this.$module.choice) {
      return this.$module.choice.getData(...args)
    }
  }
  getChoiceId(...args: Parameters<ChoiceData['getId']>) {
    if (this.$module.choice) {
      return this.$module.choice.getId(...args)
    }
  }
  getChoiceList(...args: Parameters<ChoiceData['getList']>) {
    if (this.$module.choice) {
      return this.$module.choice.getList(...args)
    }
  }
  setChoice(...args: Parameters<ChoiceData['setData']>) {
    if (this.$module.choice) {
      return this.$module.choice.setData(...args)
    }
  }
  resetChoice(...args: Parameters<ChoiceData['reset']>) {
    if (this.$module.choice) {
      return this.$module.choice.reset(...args)
    }
  }
  /* --- choice end --- */
  /* --- pagination start --- */
  setPageCount(...args: Parameters<PaginationData['setCount']>) {
    if (this.$module.pagination) {
      return this.$module.pagination.setCount(...args)
    }
  }
  getPageCount(...args: Parameters<PaginationData['getCount']>) {
    if (this.$module.pagination) {
      return this.$module.pagination.getCount(...args)
    }
  }
  getTotalPage(...args: Parameters<PaginationData['getTotal']>) {
    if (this.$module.pagination) {
      return this.$module.pagination.getTotal(...args)
    }
  }
  setPage(...args: Parameters<PaginationData['setPage']>) {
    if (this.$module.pagination) {
      return this.$module.pagination.setPage(...args)
    }
  }
  getPage(...args: Parameters<PaginationData['getPage']>) {
    if (this.$module.pagination) {
      return this.$module.pagination.getPage(...args)
    }
  }
  setPageSize(...args: Parameters<PaginationData['setSize']>) {
    if (this.$module.pagination) {
      return this.$module.pagination.setSize(...args)
    }
  }
  getPageSize(...args: Parameters<PaginationData['getSize']>) {
    if (this.$module.pagination) {
      return this.$module.pagination.getSize(...args)
    }
  }
  setPageAndSize(...args: Parameters<PaginationData['setPageAndSize']>) {
    if (this.$module.pagination) {
      this.$module.pagination.setPageAndSize(...args)
    }
  }
  resetPagination(option?: boolean) {
    if (this.$module.pagination) {
      this.$module.pagination.reset(option)
    }
  }
  destroyPagination(option?: boolean) {
    if (this.$module.pagination) {
      this.$module.pagination.destroy(option)
    }
  }
  /* --- pagination end --- */

  /* --- dictionary start --- */
  updateDictionary (...args: Parameters<DictionaryData['updateDictionary']>) {
    this.$module.dictionary!.updateDictionary(...args)
    this._syncData(true, 'updateDictionary')
  }
  getDictionaryValue (...args: Parameters<DictionaryData['getValue']>) {
    return this.$module.dictionary!.getValue(...args)
  }
  setDictionaryProp (...args: Parameters<DictionaryData['setProp']>) {
    this.$module.dictionary!.setProp(...args)
    this._syncData(true, 'setDictionaryProp')
  }
  getDictionaryProp (...args: Parameters<DictionaryData['getProp']>) {
    return this.$module.dictionary!.getProp(...args)
  }
  setDictionaryPropValue (...args: Parameters<DictionaryData['setPropValue']>) {
    this.$module.dictionary!.setPropValue(...args)
    this._syncData(true, 'setDictionaryPropValue')
  }
  getDictionaryPropValue (...args: Parameters<DictionaryData['getPropValue']>) {
    return this.$module.dictionary!.getPropValue(...args)
  }
  createListByDictionary (...args: Parameters<DictionaryData['createList']>) {
    return this.$module.dictionary!.createList(...args)
  }
  createDataByDictionary (...args: Parameters<DictionaryData['createData']>) {
    return this.$module.dictionary!.createData(...args)
  }
  updateDataByDictionary (...args: Parameters<DictionaryData['updateData']>) {
    return this.$module.dictionary!.updateData(...args)
  }
  getDictionaryList (...args: Parameters<DictionaryData['getList']>) {
    return this.$module.dictionary!.getList(...args)
  }
  getDictionaryPageList (...args: Parameters<DictionaryData['getPageList']>) {
    return this.$module.dictionary!.getPageList(...args)
  }
  getDictionaryObserveList (...args: Parameters<DictionaryData['getObserveList']>) {
    return this.$module.dictionary!.getObserveList(...args)
  }
  parseDataByDictionary (...args: Parameters<DictionaryData['parseData']>) {
    return this.$module.dictionary!.parseData(...args)
  }
  collectDataByDictionary (...args: Parameters<DictionaryData['collectData']>) {
    return this.$module.dictionary!.collectData(...args)
  }
  /* --- dictionary end --- */
  /* --- search start --- */
  assignSearch(...args: Parameters<SearchData['assignData']>) {
    return this.$module.search!.assignData(...args)
  }
  getSearch(...args: Parameters<SearchData['getData']>) {
    if (this.$module.search) {
      return this.$module.search.getData(...args)
    } else {
      return {}
    }
  }
  setSearch(from = 'set') {
    return new Promise((resolve, reject) => {
      this.triggerLife('beforeSearch', this, from)
      this.$module.search!.validateAndSyncData().then(() => {
        this.reloadData({
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
          this.triggerLife('searched', this, from)
          resolve(res)
        })).catch(err => {
          this.triggerLife('searchFail', this, from, err)
          reject(err)
        })
      }).catch(err => {
        this.triggerLife('searchFail', this, from, err)
        reject(err)
      })
    })
  }
  resetSearch(option?: resetOption) {
    return new Promise((resolve, reject) => {
      this.$module.search!.resetForm('reset', option)
      this.setSearch('reset').then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
  /* --- search end --- */
}

export default ComplexData
