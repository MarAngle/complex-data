import { getType, getProp, setProp, isExist } from 'complex-utils'
import SimpleData, { SimpleDataInitOption } from "../data/SimpleData"
import { formatInitOption } from '../utils'
import DefaultList, { DefaultListInitOption } from '../mod/DefaultList'
import DefaultInfo, { DefaultInfoInitOption } from '../mod/DefaultInfo'
import DefaultEdit, { DefaultEditInitOption } from '../mod/DefaultEdit'
import DefaultCustom, { DefaultCustomInitOption } from '../mod/DefaultCustom'
import DictionaryList, { DictionaryListInitOption, formatDataOption } from './DictionaryList'
import InterfaceData, { InterfaceDataInitOption } from './InterfaceData'
import LayoutData, { HasLayoutData, LayoutDataInitOption } from './LayoutData'

export interface unformatOption {
  mod?: string
}
export type payloadType = { targetData: Record<PropertyKey, unknown>, originData?: Record<PropertyKey, unknown>, type: string, from?: string, depth?: number, index?: number, payload?: Record<PropertyKey, any> }

export type baseFunction<RES> = (data: unknown, payload: payloadType) => RES

interface customerFunction {
  format?: false | baseFunction<unknown> // 来源=>本地 格式化函数
  defaultGetData?: false | baseFunction<unknown> // 默认获取数据的函数
  show?: false | baseFunction<unknown> // 数据=>展示 格式化
  edit?: false | baseFunction<unknown> // 数据=>编辑 格式化
  post?: false | baseFunction<unknown> // 编辑=>来源 格式化
  check?: false | baseFunction<boolean> // 数据存在判断函数
}

export interface parentOptionType {
  layout?: LayoutDataInitOption
}

export type funcKeys = keyof customerFunction

export interface DefaultListInitOptionWithExtra extends DefaultListInitOption {
  $type?: 'list'
  $target?: string // 快捷格式化目标，内存指针指向对应的mod
}
export interface DefaultInfoInitOptionWithExtra extends DefaultInfoInitOption {
  $type?: 'info'
  $target?: string // 快捷格式化目标，内存指针指向对应的mod
}
export interface DefaultEditInitOptionWithExtra extends DefaultEditInitOption {
  $type?: 'edit'
  $target?: string // 快捷格式化目标，内存指针指向对应的mod
}
export interface DefaultCustomInitOptionWithExtra extends DefaultCustomInitOption {
  $type?: 'custom'
  $target?: string // 快捷格式化目标，内存指针指向对应的mod
}
export type DictionaryModItemType = DefaultList | DefaultInfo | DefaultEdit | DefaultCustom
export type DictionaryModItemInitOptionType = DefaultListInitOptionWithExtra | DefaultInfoInitOptionWithExtra | DefaultEditInitOptionWithExtra | DefaultCustomInitOptionWithExtra
export type DictionaryMapItemType = typeof DefaultList | typeof DefaultInfo | typeof DefaultEdit | typeof DefaultCustom

export type DictionanyModDataInitOption = {
  list?: boolean | DefaultListInitOption
  info?: boolean | DefaultInfoInitOption
  edit?: boolean | DefaultEditInitOption
  build?: boolean | DefaultEditInitOption
  change?: boolean | DefaultEditInitOption
  custom?: boolean | DefaultCustomInitOption
  [prop: string]: undefined | boolean | DictionaryModItemInitOptionType
}

export type DictionanyModDataType = {
  list?: DefaultList
  info?: DefaultInfo
  edit?: DefaultEdit
  build?: DefaultEdit
  change?: DefaultEdit
  custom?: DefaultCustom
  [prop: string]: undefined | DictionaryModItemType
}

export interface DictionaryDataInitOption extends SimpleDataInitOption, customerFunction {
  prop: string, // 属性，本地唯一
  simple?: boolean, // 简单快速处理判断值
  originProp?: InterfaceDataInitOption<string> // 来源属性
  label?: InterfaceDataInitOption<string> // 名称
  type?: InterfaceDataInitOption<string> // 值类型
  showProp?: InterfaceDataInitOption<string> // 展示的属性
  showType?: InterfaceDataInitOption<string> // 展示的类型
  originFrom?: string | string[] // 来源
  layout?: LayoutDataInitOption // 布局
  dictionary?: DictionaryListInitOption, // 子字典
  mod?: DictionanyModDataInitOption // 模块
}

type interfaceKeys = keyof DictionaryData['$interface']

const defaultGetData = function (this: DictionaryData, data: unknown, { type }: payloadType) {
  const showProp = this.$getInterface('showProp', type)
  if (showProp) {
    if (data && typeof data == 'object') {
      return getProp(data, showProp)
    } else {
      return undefined
    }
  } else {
    return data
  }
}
const defaultCheck = function (data: unknown) {
  return isExist(data)
}

const DictionaryMap: Map<string, DictionaryMapItemType> = new Map()

class DictionaryData extends SimpleData implements customerFunction, HasLayoutData {
  static $name = 'DictionaryData'
  prop: string
  $originFrom: string[]
  $simple: boolean
  $dictionary?: DictionaryList
  $interface: {
    originProp: InterfaceData<string>
    label: InterfaceData<string>
    type: InterfaceData<string>
    showProp: InterfaceData<string>
    showType: InterfaceData<string>
    modType: InterfaceData<string>
  }
  $layout!: LayoutData
  format?: false | baseFunction<unknown>
  defaultGetData?: false | baseFunction<unknown>
  show?: false | baseFunction<unknown>
  edit?: false | baseFunction<unknown>
  post?: false | baseFunction<unknown>
  check?: false | baseFunction<boolean>
  $mod: DictionanyModDataType
  constructor(initOption: DictionaryDataInitOption, parentOption: parentOptionType = {}) {
    initOption = formatInitOption(initOption, null, 'DictionaryItem初始化参数不存在！')
    super(initOption)
    this.prop = this.$prop
    // 加载基本自定义函数
    this.format = initOption.format
    this.defaultGetData = initOption.defaultGetData === undefined ? defaultGetData.bind(this) : initOption.defaultGetData
    this.show = initOption.show === undefined ? this.defaultGetData : initOption.show
    this.edit = initOption.edit === undefined ? this.defaultGetData : initOption.edit
    this.post = initOption.post === undefined ? this.defaultGetData : initOption.post
    this.check = initOption.check === undefined ? defaultCheck : initOption.check
    // 加载来源
    switch (typeof initOption.originFrom) {
      case 'object':
        this.$originFrom = initOption.originFrom
        break;
      case 'string':
        this.$originFrom = [initOption.originFrom]
        break;
      default:
        this.$originFrom = ['list']
        break;
    }
    // 加载接口数据
    this.$interface = {
      label: new InterfaceData(initOption.label === undefined ? this.$name : initOption.label),
      showProp: new InterfaceData(initOption.showProp),
      type: new InterfaceData(initOption.type ? initOption.type : initOption.showProp ? 'object' : 'string'),
      showType: new InterfaceData(initOption.showType),
      originProp: new InterfaceData(initOption.originProp || this.prop),
      modType: new InterfaceData()
    }
    this.$setLayout(initOption.layout || parentOption.layout)
    this.$simple = initOption.simple === undefined ? false : initOption.simple
    this.$mod = this.$initMod(initOption.mod)
  }
  static setDictionary(name: string, data: DictionaryMapItemType | string, redirect?: boolean) {
    if (!redirect) {
      DictionaryMap.set(name, data as DictionaryMapItemType)
    } else {
      const target = DictionaryMap.get(data as string)!
      DictionaryMap.set(name, target)
    }
  }
  static getDictionary(name: string) {
    return DictionaryMap.get(name)
  }
  $initMod(initOption?: DictionanyModDataInitOption) {
    const modData: DictionanyModDataType = {}
    if (initOption) {
      const redirect: Record<string, string> = {}
      for (const modName in initOption) {
        let modItemInitData = initOption[modName]
        if (modItemInitData) {
          if (modItemInitData === true) {
            modItemInitData = {}
          }
          if (modItemInitData.$target) {
            redirect[modName] = modItemInitData.$target
          } else {
            modData[modName] = this.$initModItem(modName, modItemInitData)
          }
        }
      }
      for (const modName in redirect) {
        modData[modName] = modData[redirect[modName]]
      }
    }
    return modData
  }
  $initModItem(modName: string, modItemInitData: DictionaryModItemInitOptionType) {
    if (!modItemInitData.$type) {
      modItemInitData.$type = modName as DictionaryModItemInitOptionType['$type']
    }
    this.$setInterface('modType', modName, modItemInitData.$type!)
    const modClass = DictionaryData.getDictionary(modItemInitData.$type!)!
    return new modClass(modItemInitData, modName, this)
  }
  // $getModData(modName: string, option: unformatOption = {}) {
  //   if (option.mod) {
  //     modName = option.mod
  //   }
  //   return this.$getMod(modName)
  // }
  $getInterfaceData(target: interfaceKeys) {
    return this.$interface[target]
  }
  $getInterface(target: interfaceKeys, prop?: string) {
    return this.$interface[target].getData(prop)
  }
  $setInterface(target: interfaceKeys, prop: string, data: string, useSetData?: boolean) {
    this.$interface[target].setData(prop, data, useSetData)
    this.$syncData(true, '$setInterface')
  }
  $setLayout(data?: LayoutDataInitOption) {
    this.$layout = new LayoutData(data)
    this.$syncData(true, '$setLayout')
  }
  $getLayout(prop?: string) {
    return this.$layout.getData(prop)
  }
  $getLayoutData() {
    return this.$layout
  }
  /**
   * 判断是否存在来源
   * @param {string} originFrom 来源
   * @returns {boolean}
   */
  $isOriginFrom (originFrom: string) {
    return this.$originFrom.indexOf(originFrom) > -1
  }
  $triggerFunc (funcName: funcKeys, originData: unknown, payload: payloadType) {
    const itemFunc = this[funcName]
    if (itemFunc) {
      return itemFunc(originData, payload)
    } else {
      return originData
    }
  }
  $formatDataBySimple(targetData: Record<PropertyKey, any>, originData: Record<PropertyKey, any>, originFrom: string, option: formatDataOption) {
    const originProp = this.$getInterface('originProp', originFrom)!
    // 快捷模式快速判断
    if (!option.format || this.prop != originProp) {
      setProp(targetData, this.prop, getProp(originData, originProp), true)
    }
    // 非新建模式下，prop不更名则不进行任何操作
  }
  $formatDataByDictionary(targetData: Record<PropertyKey, any>, originData: Record<PropertyKey, any>, originFrom: string, option: formatDataOption, depth: number) {
    depth++
    const originProp = this.$getInterface('originProp', originFrom)!
    const type = this.$getInterface('type', originFrom)!
    const originValue = getProp(originData, originProp)
    let targetValue
    if (type != 'array') {
      if (getType(originValue) == 'object') {
        if (!option.format) {
          // 新增模式
          targetValue = this.$dictionary!.createData(originValue, originFrom, option, depth)
        } else {
          targetValue = this.$dictionary!.formatData(originValue, originValue, originFrom, option, depth)
        }
      } else {
        targetValue = {}
      }
    } else {
      if (getType(originValue) == 'array') {
        targetValue = this.$dictionary!.formatListData(targetData[this.prop], originValue, originFrom, option, depth)
      } else {
        targetValue = []
      }
    }
    return targetValue
  }
  $formatData(targetData: Record<PropertyKey, any>, originData: Record<PropertyKey, any>, originFrom: string, option: formatDataOption, depth: number) {
    if (this.$isOriginFrom(originFrom)) {
      if (!this.format && !this.$dictionary) {
        // 快捷模式快速判断
        this.$formatDataBySimple(targetData, originData, originFrom, option)
        return
      }
      const originProp = this.$getInterface('originProp', originFrom)!
      let targetValue = getProp(originData, originProp)
      if (this.$dictionary) {
        targetValue = this.$formatDataByDictionary(targetData, originData, originFrom, option, depth)
      }
      this.$setTargetData(this.prop, targetValue, 'format', {
        targetData: targetData,
        originData: originData,
        depth: depth,
        type: originFrom
      })
    }
  }
  $setTargetData(prop: string, originValue: any, funcName: funcKeys, option: payloadType ) {
    const targetValue = this.$triggerFunc(funcName, originValue, option)
    setProp(option.targetData, prop, targetValue, true)
  }
  $getMod (modName: string) {
    return this.$mod[modName]
  }
  $buildFormData (option: payloadType) {
    return new Promise((resolve) => {
      const mod = this.$getMod(option.type) as DefaultEdit
      const next = (status: string, targetValue: any) => {
        setProp(option.targetData, this.prop, targetValue, true)
        resolve({ status: status })
      }
      if (mod) {
        if (mod.readyData) {
          mod.readyData().then(() => {
            next('success', this.$getFormData(mod, option))
          }).catch((err: any) => {
            this.$exportMsg(`${option.type}模块readyData调用失败！`, 'error', {
              data: err,
              type: 'error'
            })
            next('fail', this.$getFormData(mod, option))
          })
        } else {
          next('success', this.$getFormData(mod, option))
        }
      } else {
        next('none', undefined)
      }
    })
  }
  $getFormData (mod: DefaultEdit, { targetData, originData, type, from = 'init' }: payloadType) {
    let targetValue
    // 存在源数据则获取属性值并调用主要模块的edit方法格式化，否则通过模块的getValueData方法获取初始值
    if (originData) {
      targetValue = this.$triggerFunc('edit', originData[this.prop], {
        type: type,
        targetData,
        originData
      })
    } else if (mod.getValueData) {
      if (from == 'reset') {
        targetValue = mod.getValueData('reset')
      } else {
        targetValue = mod.getValueData('init')
      }
    }
    // 模块存在edit函数时将当前数据进行edit操作
    if (mod.edit) {
      targetValue = mod.edit(targetValue, {
        type: type,
        targetData,
        originData,
        from: from
      })
    }
    return targetValue
  }
}

DictionaryData.setDictionary('list', DefaultList)
DictionaryData.setDictionary('info', DefaultInfo)
DictionaryData.setDictionary('edit', DefaultEdit)
DictionaryData.setDictionary('change', 'edit')
DictionaryData.setDictionary('build', 'edit')
DictionaryData.setDictionary('custom', DefaultCustom)

export default DictionaryData
