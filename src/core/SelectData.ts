import { Life } from 'complex-utils'
import { DataWithLife, LifeInitOption } from 'complex-utils/src/class/Life'
import { DataWithSimpleLoad, StatusItem, StatusValue } from '../module/StatusData'
import PaginationData, { PaginationDataInitOption } from '../module/PaginationData'
import CascaderValue, { CascaderValueInitOption, CascaderValueType } from "../lib/CascaderValue"
import StorageValue, { DataWithStorage, StorageValueInitOption } from '../lib/StorageValue'
import { SelectValueType } from '../lib/SelectValue'

export type getDataType<D extends SelectValueType = SelectValueType> = (...args: unknown[]) => Promise<{ status: string, list: D[] }>

export interface SelectDataInitOption<C extends PropertyKey | undefined = undefined, D extends (C extends PropertyKey ? CascaderValueType<C> : SelectValueType) = (C extends PropertyKey ? CascaderValueType<C> : SelectValueType)> extends CascaderValueInitOption<C, D> {
  reload?: boolean
  life?: LifeInitOption
  storage?: StorageValueInitOption
  pagination?: PaginationDataInitOption
  getData: getDataType<D>
}

class SelectData<C extends PropertyKey | undefined = undefined, D extends (C extends PropertyKey ? CascaderValueType<C> : SelectValueType) = (C extends PropertyKey ? CascaderValueType<C> : SelectValueType)> extends CascaderValue<C, D> implements DataWithLife, DataWithStorage, DataWithSimpleLoad {
  static $name = 'SelectData'
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
    this.$reload = initOption.reload ?? !!this.$pagination
    this.$getData = initOption.getData
    if (initOption.storage) {
      this.$storage = new StorageValue(initOption.storage, this._getConstructorName())
      this.$storage.push('list', {
        init: (value) => {
          this.list = [...value]
        },
        save: () => {
          return this.list
        }
      })
      // 数据加载完成时，触发保存到本地
      this.onLife('loaded', {
        handler: () => {
          // 数据加载完成后自动取消可能存在的数据更新逻辑
          this.$storage!.stop()
          this.saveStorage()
        }
      })
      // 本地化加载完成：本地化加载完成不触发loaded事件！
      this.onLife('initStoraged', {
        handler: () => {
          this.setLoad(StatusValue.success)
        }
      })
      // reloadStorage触发本地加载
      this.onLife('reloadStorage', {
        handler: () => {
          this.loadData({ ing: false })
        }
      })
      // 创建完成时触发本地化加载
      this.$storage.init(this)
    }
    this.triggerLife('created', this, initOption)
  }
  /* --- status start --- */
  getLoad() {
    return this.$load.getCurrent()
  }
  setLoad(...args: Parameters<StatusItem['setCurrent']>) {
    return this.$load.setCurrent(...args)
  }
  /* --- status end --- */
  /* --- life start --- */
  onLife(...args: Parameters<Life['on']>) {
    return this.$life.on(...args)
  }
  emitLife(...args: Parameters<Life['emit']>) {
    return this.$life.emit(...args)
  }
  offLife(...args: Parameters<Life['off']>): boolean {
    return this.$life.off(...args)
  }
  triggerLife(...args: Parameters<Life['trigger']>) {
    return this.$life.trigger(...args)
  }
  clearLife(...args: Parameters<Life['clear']>) {
    return this.$life.clear(...args)
  }
  resetLife() {
    return this.$life.reset()
  }
  destroyLife() {
    return this.$life.destroy()
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
    const loadStatus = this.getLoad()
    let getData = !!force || this.$reload
    // 强制加载或者需要reload的情况下，getData为真
    if (!force) {
      // 非强制获取情况下，进行状态判断
      if ([StatusValue.un, StatusValue.fail].includes(loadStatus)) {
        getData = true
      }
    } else {
      // 强制获取情况下，单独判断加载中
      if (loadStatus === StatusValue.ing && !force.ing) {
        getData = false
      }
    }
    if (getData) {
      this.setLoad(StatusValue.ing)
      this.triggerLife('beforeLoad', this, ...args)
      const promise = this.$getData(...args)
      promise.then((res: unknown) => {
        // 触发生命周期重载完成事件
        this.setLoad(StatusValue.success)
        this.triggerLife('loaded', this, { res, args })
      }).catch(err => {
        this.setLoad(StatusValue.fail)
        // eslint-disable-next-line no-console
        console.error(err)
        // 触发生命周期重载失败事件
        this.triggerLife('loadFail', this, { res: err, args })
      })
      return promise
    } else {
      return Promise.resolve({ status: 'success', code: loadStatus })
    }
  }
}

export default SelectData