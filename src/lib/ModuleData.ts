import { getType } from 'complex-utils-next'
import Data from '../data/Data'
import BaseData, { resetOptionType } from '../data/BaseData'
import DependData, { DependDataInitOption } from './DependData'
import UpdateData, { UpdateDataInitOption } from './UpdateData'

export interface ModuleDataInitOption {
  depend?: boolean | DependDataInitOption
  update?: boolean | UpdateDataInitOption
}

export type moduleKeys = keyof ModuleDataInitOption

export const ModuleDataKeys: moduleKeys[] = ['depend', 'update']

const ModuleMap = {
  depend: DependData,
  update: UpdateData
}

class ModuleData extends Data {
  static $name = 'ModuleData'
  depend?: DependData
  update?: UpdateData
  constructor(initOption: undefined | ModuleDataInitOption, parent: BaseData) {
    super()
    this.$setParent(parent)
    if (initOption && getType(initOption) === 'object') {
      let modName: moduleKeys
      for (modName in initOption) {
        this.installData(modName, initOption[modName], 'init')
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected _buildModuleData(modName: moduleKeys, modData?: boolean | Record<PropertyKey, any>) {
    const ModuleClass = ModuleMap[modName]
    if (ModuleClass && modData !== false && !(modData instanceof ModuleClass)) {
      if (modData === undefined || modData === true) {
        modData = {}
      }
      return new ModuleClass(modData, this.$getParent() as BaseData)
    }
    return modData
  }
  /**
   * 设置模块
   * @param {string} modName 模块名
   * @param {object} modData 模块实例
   * @param {boolean} [build] 自动构建判断值，默认为真
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  installData(modName: moduleKeys, modData?: any, from?: string, unTriggerSync?: boolean) {
    if (from !== 'init') {
      this.uninstallData(modName, 'install:' + from, unTriggerSync)
    }
    modData = this._buildModuleData(modName, modData)
    this.$installData(modName, modData, from, unTriggerSync)
  }
  getData(modName: moduleKeys) {
    return this[modName]
  }
  /**
   * 卸载模块
   * @param {string} modName 模块名
   * @returns {object | undefined} 卸载的模块
   */
  uninstallData(modName: moduleKeys, from?: string, unTriggerSync?: boolean) {
    const modData = this[modName]
    if (modData) {
      // 存在旧数据时需要对旧数据进行卸载操作
      if (modData.$uninstall) {
        modData.$uninstall(this.$getParent() as BaseData, from)
      }
      this[modName] = undefined
    }
    if (!unTriggerSync) {
      this.$syncData(true, 'uninstallData')
    }
    return modData
  }
  /**
   * 加载模块
   * @param {string} modName 模块名
   * @param {object} modData 模块实例
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $installData(modName: moduleKeys, modData: any, from?: string, unTriggerSync?: boolean) {
    this[modName] = modData
    if (modData && modData.$install) {
      modData.$install(this.$getParent(), from)
    }
    if (!unTriggerSync) {
      this.$syncData(true, '$installData')
    }
  }
  $getName() {
    let name = super.$getName()
    const parent = this.$getParent()
    if (parent) {
      name = `[${parent.$getName()}=>${name}]`
    }
    return name
  }
  $reset(resetOption: resetOptionType, ...args: unknown[]) {
    ModuleDataKeys.forEach(modName => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const modData = this.getData(modName) as any
      if (resetOption[modName] !== false) {
        if (modData && modData.$reset) {
          modData.$reset(resetOption[modName], ...args)
        }
      }
    })
  }
  $destroy(destroyOption: resetOptionType, ...args: unknown[]) {
    this.$reset(destroyOption)
    ModuleDataKeys.forEach(modName => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const modData = this.getData(modName) as any
      if (destroyOption[modName] !== false) {
        if (modData && modData.$destroy) {
          modData.$destroy(destroyOption[modName], ...args)
        }
      }
    })
  }
}

export default ModuleData
