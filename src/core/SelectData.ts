import SelectValue, { SelectValueInitOption, SelectValueType } from "../lib/SelectValue"

export type getDataType<D extends SelectValueType = SelectValueType> = (...args: unknown[]) => Promise<{ status: string, list: D[] }>

export interface SelectDataInitOption<D extends SelectValueType = SelectValueType> extends SelectValueInitOption<D> {
  getData?: getDataType<D>
}

class SelectData<D extends SelectValueType = SelectValueType> extends SelectValue {
  $getData?: getDataType<D>
  constructor(initOption: SelectDataInitOption<D>) {
    super(initOption)
    this.$getData = initOption.getData
  }
}

export default SelectData
