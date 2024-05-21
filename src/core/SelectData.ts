import { Life } from 'complex-utils'
import { DataWithLife, LifeInitOption } from 'complex-utils/src/class/Life'
import { StatusItem, StatusValue } from '../module/StatusData'
import PaginationData, { PaginationDataInitOption } from '../module/PaginationData'
import SelectValue, { CascadeValueType, DefaultCascadeValueType, DefaultSelectValueType, SelectValueInitOption, SelectValueType } from "../lib/SelectValue"
import StorageValue, { DataWithStorage, StorageValueInitOption } from '../lib/StorageValue'

export type getDataType<D extends SelectValueType = DefaultSelectValueType> = (...args: unknown[]) => Promise<{ status: string, list: D[] }>

export interface SelectDataInitOption<C extends PropertyKey | undefined = undefined, D extends (C extends PropertyKey ? CascadeValueType<C> : SelectValueType) = (C extends PropertyKey ? DefaultCascadeValueType<C> : DefaultSelectValueType)> extends SelectValueInitOption<C, D> {
  reload?: boolean
  life?: LifeInitOption
  storage?: StorageValueInitOption
  pagination?: PaginationDataInitOption
  getData: getDataType<D>
}

class SelectData<C extends PropertyKey | undefined = undefined, D extends (C extends PropertyKey ? CascadeValueType<C> : SelectValueType) = (C extends PropertyKey ? DefaultCascadeValueType<C> : DefaultSelectValueType)> extends SelectValue<C, D> implements DataWithLife, DataWithStorage {
  $load: StatusItem
  $reload: boolean
  $life!: Life
  $storage?: StorageValue
  $pagination?: PaginationData
  $getData: getDataType<D>
  constructor(initOption: SelectDataInitOption<C, D>) {
    super(initOption)
    this.$load = new StatusItem('load')
    Object.defineProperty(this, '$life', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: new Life(initOption.life)
    })
    if (initOption.pagination) {
      this.$pagination = new PaginationData(initOption.pagination)
    }
    this.$reload = initOption.reload === undefined ? !!this.$pagination : initOption.reload
    this.$getData = initOption.getData
    if (initOption.storage) {
      this.$storage = new StorageValue(initOption.storage, this._getConstructorName())
      this.$storage.push('list', {
        init: (value) => {
          this.list = [
            ...value
          ]
        },
        save: () => {
          return this.list
        }
      })
      // 数据加载完成时，触发保存到本地
      this.onLife('loaded', {
        data: () => {
          // 数据加载完成后自动取消可能存在的数据更新逻辑
          this.$storage!.stop()
          this.saveStorage()
        }
      })
      // 本地化加载完成：本地化加载完成不触发loaded事件！
      this.onLife('initStoraged', {
        data: () => {
          this.$setLoad(StatusValue.success)
        }
      })
      // reloadStorage触发本地加载
      this.onLife('reloadStorage', {
        data: () => {
          this.loadData({ ing: false })
        }
      })
      // 创建完成时触发本地化加载
      this.$storage.init(this)
    }
    this.triggerLife('created', this, initOption)
  }
  /* --- status start --- */
  $getLoad() {
    return this.$load.getCurrent()
  }
  $setLoad(...args: Parameters<StatusItem['setCurrent']>) {
    return this.$load.setCurrent(...args)
  }
  /* --- status end --- */
  /* --- life start --- */
  onLife(...args: Parameters<Life['on']>) {
    return this.$life.on(...args)
  }
  emitLife(...args: Parameters<Life['emit']>) {
    this.$life.emit(...args)
  }
  offLife(...args: Parameters<Life['off']>): boolean {
    return this.$life.off(...args)
  }
  triggerLife(...args: Parameters<Life['trigger']>) {
    this.$life.trigger(...args)
  }
  clearLife(...args: Parameters<Life['clear']>) {
    this.$life.clear(...args)
  }
  resetLife() {
    this.$life.reset()
  }
  destroyLife() {
    this.$life.destroy()
  }
  saveStorage() {
    if (this.$storage) {
      this.triggerLife('beforeSaveStorage', this)
      this.$storage.save()
      this.triggerLife('saveStoraged', this)
    }
  }
  /* --- life end --- */
  loadData(force?: { ing?: boolean }, ...args: unknown[]) {
    const loadStatus = this.$getLoad()
    let getData = !!force || this.$reload
    // 强制加载或者需要reload的情况下，getData为真
    if (!force) {
      // 非强制获取情况下，进行状态判断
      if ([StatusValue.un, StatusValue.fail].indexOf(loadStatus) > -1) {
        getData = true
      }
    } else {
      // 强制获取情况下，单独判断加载中
      if (loadStatus === StatusValue.ing && !force.ing) {
        getData = false
      }
    }
    if (getData) {
      return new Promise((resolve, reject) => {
        this.$setLoad(StatusValue.ing)
        this.triggerLife('beforeLoad', this, ...args)
        this.$getData(...args).then((res: unknown) => {
          // 触发生命周期重载完成事件
          this.$setLoad(StatusValue.success)
          this.triggerLife('loaded', this, {
            res: res,
            args: args
          })
          resolve(res)
        }).catch(err => {
          this.$setLoad(StatusValue.fail)
          // eslint-disable-next-line no-console
          console.error(err)
          // 触发生命周期重载失败事件
          this.triggerLife('loadFail', this, {
            res: err,
            args: args
          })
          reject(err)
        })
      })
    } else {
      return Promise.resolve({ status: 'success', code: loadStatus })
    }
  }
}

export default SelectData
