import { Life } from 'complex-utils'
import { DataWithLife, LifeInitOption } from 'complex-utils/src/class/Life'
import SelectValue, { DefaultSelectValueType, SelectValueInitOption, SelectValueType } from "../lib/SelectValue"
import { StatusItem } from '../module/StatusData'
import PaginationData, { PaginationDataInitOption } from '../module/PaginationData'

export type getDataType<D extends SelectValueType = DefaultSelectValueType> = (...args: unknown[]) => Promise<{ status: string, list: D[] }>

export interface SelectDataInitOption<D extends SelectValueType = DefaultSelectValueType> extends SelectValueInitOption<D> {
  reload?: boolean
  life?: LifeInitOption
  pagination?: PaginationDataInitOption
  getData: getDataType<D>
}

class SelectData<D extends SelectValueType = DefaultSelectValueType> extends SelectValue<D> implements DataWithLife {
  $load: StatusItem
  $reload: boolean
  $life!: Life
  $pagination?: PaginationData
  $getData: getDataType<D>
  constructor(initOption: SelectDataInitOption<D>) {
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
  /* --- life end --- */
  loadData(force?: { ing?: boolean }, ...args: unknown[]) {
    const loadStatus = this.$getLoad()
    let getData = !!force || this.$reload
    // 强制加载或者需要reload的情况下，getData为真
    if (!force) {
      // 非强制获取情况下，进行状态判断
      if (['un', 'fail'].indexOf(loadStatus) > -1) {
        getData = true
      }
    } else {
      // 强制获取情况下，单独判断加载中
      if (loadStatus === 'ing' && !force.ing) {
        getData = false
      }
    }
    if (getData) {
      return new Promise((resolve, reject) => {
        this.$setLoad('ing')
        this.triggerLife('beforeLoad', this, ...args)
        this.$getData(...args).then((res: unknown) => {
          // 触发生命周期重载完成事件
          this.$setLoad('success')
          this.triggerLife('loaded', this, {
            res: res,
            args: args
          })
          resolve(res)
        }).catch(err => {
          this.$setLoad('fail')
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
