import BaseData, { BaseDataInitOption, loadFunctionType } from "./BaseData"
import ModuleData, { ModuleDataInitOption } from "../module/ModuleData"
import SearchData, { resetOption } from "../module/SearchData"
import DictionaryData from "../module/DictionaryData"
import PaginationData from "../module/PaginationData"
import UpdateData from "../module/UpdateData"
import { StatusValue } from "../module/StatusData"
import ChoiceData from "../module/ChoiceData"
import SortData from "../module/SortData"
import ForceValue, { ForceValueInitOption } from "../lib/ForceValue"
import { DefaultBufferType } from "./DefaultData"

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
const initFunctions = ['updateData', 'buildData', 'changeData', 'editData', 'deleteData', 'refreshData', 'multipleDeleteData', 'exportData', 'importData'] as const

class ComplexData<Buffer extends DefaultBufferType = DefaultBufferType> extends BaseData<Buffer> implements ComplexDataWithFunction, ComplexDataWithMainFunction {
  static $name = 'ComplexData'
  declare $module: ModuleData
  constructor(initOption: ComplexDataInitOption) {
    super(initOption)
    this._triggerCreateLife('ComplexData', false, initOption)
    initFunctions.forEach(func => {
      if (initOption[func]) {
        this[`$${func}`] = initOption[func] as any
      }
    })
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
  $triggerDataChange<P extends Promise<any> = Promise<any>>(promise: P, triggerName: string, ...args: any[]) {
    promise.then(() => {
      this.triggerLife('dataChange', this, triggerName, ...args)
    })
    return promise
  }
  // 新增数据
  buildData(targetData: Record<PropertyKey, any>, type?: string, ...args: unknown[]): Promise<any> {
    return this.$triggerDataChange(this.$buildData(targetData, type, ...args), 'buildData', targetData, type, ...args)
  }
  // 修改数据
  changeData(targetData: Record<PropertyKey, any>, originData: Record<PropertyKey, any>, type: string, ...args: unknown[]): Promise<any> {
    return this.$triggerDataChange(this.$changeData(targetData, originData, type, ...args), 'changeData', targetData, originData, type, ...args)
  }
  // 编辑数据总方法
  editData(targetData: Record<PropertyKey, any>, originData: Record<PropertyKey, any>, type: string, ...args: unknown[]): Promise<any> {
    return this.$triggerDataChange(this.$editData(targetData, originData, type, ...args), 'editData', targetData, originData, type, ...args)
  }
  // 删除数据
  deleteData(targetData: Record<PropertyKey, any>, ...args: unknown[]): Promise<any> {
    return this.$triggerDataChange(this.$deleteData(targetData, ...args), 'deleteData', targetData, ...args)
  }
  // 刷新数据
  refreshData(targetData: Record<PropertyKey, any>, ...args: unknown[]): Promise<any> {
    return this.$triggerDataChange(this.$refreshData(targetData, ...args), 'refreshData', targetData, ...args)
  }
  // 删除多选数据
  multipleDeleteData(choiceList: Record<PropertyKey, any>[], ...args: unknown[]): Promise<any> {
    return this.$triggerDataChange(this.$multipleDeleteData(choiceList, ...args), 'multipleDeleteData', choiceList, ...args)
  }
  // 导出数据
  exportData(...args: any[]): Promise<any> {
    const promise = this.$exportData(...args)
    return promise
  }
  // 导入数据
  importData(file: File, ...args: unknown[]): Promise<any> {
    return this.$triggerDataChange(this.$importData(file, ...args), 'importData', file, ...args)
  }
  /* --- update start --- */
  startUpdate(...args: Parameters<UpdateData['start']>) {
    return this.$module.update?.start(...args)
  }
  updateImmerdiate(...args: Parameters<UpdateData['immerdiate']>) {
    return this.$module.update?.immerdiate(...args)
  }
  clearUpdate(...args: Parameters<UpdateData['clear']>) {
    return this.$module.update?.clear(...args)
  }
  resetUpdate(...args: Parameters<UpdateData['reset']>) {
    return this.$module.update?.reset(...args)
  }
  destroyUpdate(...args: Parameters<UpdateData['destroy']>) {
    return this.$module.update?.destroy(...args)
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
          this.triggerLife('updated', this, { res, args })
        } else {
          this.triggerLife('updateFail', this, { res, args })
        }
      }
    })
    return this._setPromise('update', promise)
  }
  loadUpdateData (forceInitOption?: boolean | ForceValueInitOption | ForceValue, ...args: unknown[]) {
    const force = new ForceValue(forceInitOption, {
      from: 'data',
      action: 'update'
    })
    const updateStatus = this.getStatus('update')
    if ([StatusValue.un, StatusValue.success, StatusValue.fail].includes(updateStatus) || (force.data && force.ing && updateStatus === StatusValue.ing)) {
      this._triggerUpdateData(...args)
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
    return this.$module.choice?.getData(...args)
  }
  getChoiceId(...args: Parameters<ChoiceData['getId']>) {
    return this.$module.choice?.getId(...args)
  }
  getChoiceList(...args: Parameters<ChoiceData['getList']>) {
    return this.$module.choice?.getList(...args)
  }
  setChoice(...args: Parameters<ChoiceData['setData']>) {
    return this.$module.choice?.setData(...args)
  }
  resetChoice(...args: Parameters<ChoiceData['reset']>) {
    return this.$module.choice?.reset(...args)
  }
  /* --- choice end --- */
  /* --- sort start --- */
  setSortData(...args: Parameters<SortData['setData']>) {
    return this.$module.sort?.setData(...args)
  }
  getSortData(...args: Parameters<SortData['getData']>) {
    return this.$module.sort?.getData(...args)
  }
  getSortValue(...args: Parameters<SortData['getValue']>) {
    return this.$module.sort?.getValue(...args)
  }
  getSortOrder(...args: Parameters<SortData['getOrder']>) {
    return this.$module.sort?.getOrder(...args)
  }
  resetSort(...args: Parameters<SortData['reset']>) {
    return this.$module.sort?.reset(...args)
  }
  /* --- sort end --- */
  /* --- pagination start --- */
  setPageCount(...args: Parameters<PaginationData['setCount']>) {
    return this.$module.pagination?.setCount(...args)
  }
  getPageCount(...args: Parameters<PaginationData['getCount']>) {
    return this.$module.pagination?.getCount(...args)
  }
  getTotalPage(...args: Parameters<PaginationData['getTotal']>) {
    return this.$module.pagination?.getTotal(...args)
  }
  setPage(...args: Parameters<PaginationData['setPage']>) {
    return this.$module.pagination?.setPage(...args)
  }
  getPage(...args: Parameters<PaginationData['getPage']>) {
    return this.$module.pagination?.getPage(...args)
  }
  setPageSize(...args: Parameters<PaginationData['setSize']>) {
    return this.$module.pagination?.setSize(...args)
  }
  getPageSize(...args: Parameters<PaginationData['getSize']>) {
    return this.$module.pagination?.getSize(...args)
  }
  setPageAndSize(...args: Parameters<PaginationData['setPageAndSize']>) {
    this.$module.pagination?.setPageAndSize(...args)
  }
  resetPagination(option?: boolean) {
    this.$module.pagination?.reset(option)
  }
  destroyPagination(option?: boolean) {
    this.$module.pagination?.destroy(option)
  }
  /* --- pagination end --- */

  /* --- dictionary start --- */
  updateDictionary (...args: Parameters<DictionaryData['updateDictionary']>) {
    this.$module.dictionary?.updateDictionary(...args)
    this._syncData(true, 'updateDictionary')
  }
  getDictionaryValue (...args: Parameters<DictionaryData['getValue']>) {
    return this.$module.dictionary?.getValue(...args)
  }
  setDictionaryProp (...args: Parameters<DictionaryData['setProp']>) {
    this.$module.dictionary?.setProp(...args)
    this._syncData(true, 'setDictionaryProp')
  }
  getDictionaryProp (...args: Parameters<DictionaryData['getProp']>) {
    return this.$module.dictionary?.getProp(...args)
  }
  setDictionaryPropValue (...args: Parameters<DictionaryData['setPropValue']>) {
    this.$module.dictionary?.setPropValue(...args)
    this._syncData(true, 'setDictionaryPropValue')
  }
  getDictionaryPropValue (...args: Parameters<DictionaryData['getPropValue']>) {
    return this.$module.dictionary?.getPropValue(...args)
  }
  createListByDictionary (...args: Parameters<DictionaryData['createList']>) {
    return this.$module.dictionary?.createList(...args)
  }
  createDataByDictionary (...args: Parameters<DictionaryData['createData']>) {
    return this.$module.dictionary?.createData(...args)
  }
  updateDataByDictionary (...args: Parameters<DictionaryData['updateData']>) {
    return this.$module.dictionary?.updateData(...args)
  }
  getDictionaryList (...args: Parameters<DictionaryData['getList']>) {
    return this.$module.dictionary?.getList(...args)
  }
  getDictionaryPageList (...args: Parameters<DictionaryData['getPageList']>) {
    return this.$module.dictionary?.getPageList(...args)
  }
  getDictionaryObserveList (...args: Parameters<DictionaryData['getObserveList']>) {
    return this.$module.dictionary?.getObserveList(...args)
  }
  parseDataByDictionary (...args: Parameters<DictionaryData['parseData']>) {
    return this.$module.dictionary?.parseData(...args)
  }
  collectDataByDictionary (...args: Parameters<DictionaryData['collectData']>) {
    return this.$module.dictionary?.collectData(...args)
  }
  /* --- dictionary end --- */
  /* --- search start --- */
  assignSearch(...args: Parameters<SearchData['assignData']>) {
    return this.$module.search?.assignData(...args)
  }
  getSearch(...args: Parameters<SearchData['getData']>) {
    return this.$module.search?.getData(...args) || {}
  }
  setSearch(action = 'set') {
    return new Promise((resolve, reject) => {
      this.triggerLife('beforeSearch', this, action)
      this.$module.search?.validateAndSyncData().then(() => {
        this.reloadData({
          data: true,
          ing: true,
          trigger: {
            from: 'search',
            action: action
          },
          module: {
            pagination: true
          }
        })!.then((res => {
          this.triggerLife('searched', this, action)
          resolve(res)
        })).catch(err => {
          this.triggerLife('searchFail', this, action, err)
          reject(err)
        })
      }).catch(err => {
        this.triggerLife('searchFail', this, action, err)
        reject(err)
      })
    })
  }
  resetSearch(option?: resetOption) {
    this.$module.search?.resetForm('reset', option)
    return this.setSearch('reset')
  }
  $onSearchInited(next: () => void) {
    if (this.$module.search && (!this.$module.search.$runtime || (this.$module.search.$runtime && this.$module.search.$runtime.ing))) {
      // 当存在检索数据且不存在运行时或存在运行时且正在运行时，等待运行结束再加载数据
      this.onLife('searchInited', {
        handler: (lifeValue) => {
          // 仅触发一次
          lifeValue.destroy()
          next()
        }
      })
    } else {
      next()
    }
  }
  loadDataBySearchInited(...args: Parameters<BaseData['loadData']>) {
    return new Promise((resolve, reject) => {
      this.$onSearchInited(() => {
        this.loadData(...args).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    })
  }
  /* --- search end --- */
}

export default ComplexData
