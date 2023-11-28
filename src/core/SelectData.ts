import { Life } from 'complex-utils'
import { DataWithLife, LifeInitOption } from 'complex-utils/src/class/Life'
import SelectValue, { SelectValueInitOption, SelectValueType } from "../lib/SelectValue"

export type getDataType<D extends SelectValueType = SelectValueType> = (...args: unknown[]) => Promise<{ status: string, list: D[] }>

export interface SelectDataInitOption<D extends SelectValueType = SelectValueType> extends SelectValueInitOption<D> {
  life?: LifeInitOption
  getData: getDataType<D>
}

class SelectData<D extends SelectValueType = SelectValueType> extends SelectValue implements DataWithLife {
  $getData: getDataType<D>
  $life: Life
  constructor(initOption: SelectDataInitOption<D>) {
    super(initOption)
    this.$life = new Life(initOption.life)
    this.$getData = initOption.getData
  }
  $onLife(...args: Parameters<Life['on']>) {
    return this.$life.on(...args)
  }
  $emitLife(...args: Parameters<Life['emit']>) {
    this.$life.emit(...args)
  }
  $offLife(...args: Parameters<Life['off']>): boolean {
    return this.$life.off(...args)
  }
  $triggerLife(...args: Parameters<Life['trigger']>) {
    this.$life.trigger(...args)
  }
  $clearLife(...args: Parameters<Life['clear']>) {
    this.$life.clear(...args)
  }
  $resetLife() {
    this.$life.reset()
  }
  $destroyLife() {
    this.$life.destroy()
  }
}

export default SelectData
