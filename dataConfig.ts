import { setComplexProp, setProp } from "complex-utils"

const dataConfig = {
  empty: Symbol('empty'),
  style: {
    color: {
      primary: '#1677ff',
      success: '#52c41a',
      link: '#1677ff',
      realLink: 'rgba(24,144,255,1)',
      warning: '#faad14',
      danger: '#ff4d4f',
      disabled: 'rgba(0,0,0,0.25)',
      headText: 'rgba(0,0,0,0.85)',
      text: 'rgba(0,0,0,0.65)',
      secondaryText: 'rgba(0,0,0,0.45)',
      border: 'rgba(217,217,217,1)',
    } as Record<string, string>,
    data: {
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    } as Record<string, string | number>
  },
  nonEmptySetProp(data: Record<PropertyKey, any>, prop: string, value: any, useSetData?: boolean) {
    if (value !== dataConfig.empty) {
      // 不同属性则判断是否为空数据
      setProp(data, prop, value, useSetData)
    }
  },
  nonEmptySetComplexProp(data: Record<PropertyKey, any>, prop: string, value: any, useSetData?: boolean) {
    if (value !== dataConfig.empty) {
      // 不同属性则判断是否为空数据
      setComplexProp(data, prop, value, useSetData)
    }
  },
  formatPixel(value: number) {
    return value + 'px'
  }
}

export default dataConfig
