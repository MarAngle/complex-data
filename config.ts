import { setComplexProp, setProp } from "complex-utils"

const config = {
  empty: Symbol('empty'),
  nonEmptySetProp(data: Record<PropertyKey, any>, prop: string, value: any, useSetData?: boolean) {
    if (value !== config.empty) {
      // 不同属性则判断是否为空数据
      setProp(data, prop, value, useSetData)
    }
  },
  nonEmptySetComplexProp(data: Record<PropertyKey, any>, prop: string, value: any, useSetData?: boolean) {
    if (value !== config.empty) {
      // 不同属性则判断是否为空数据
      setComplexProp(data, prop, value, useSetData)
    }
  },
  formatPixel(value: number) {
    return value + 'px'
  }
}

export default config
