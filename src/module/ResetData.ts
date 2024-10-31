import Data from './../data/Data'
import BaseData from '../data/BaseData'
import { LocalValue, LocalValueInitOption, createLocalValue } from "../lib/AttrsValue"
import ForceValue from '../lib/ForceValue'
import { renderType } from '../../type'

type resetType = Record<string, Record<string, boolean>>

export interface ResetDataInitOption {
  option?: resetType
  local?: LocalValueInitOption
  renders?: Record<string, undefined | renderType>
}

abstract class ResetData extends Data {
  $module: string
  $option: resetType
  $local?: LocalValue
  $renders?: Record<string, undefined | renderType>
  constructor (initOption: ResetDataInitOption, module: string) {
    super()
    this.$module = module
    this.$option = {
      data: {
        load: false,
        reload: false,
        update: false
      },
      search: {
        set: true,
        reset: true
      },
      pagination: {
        page: false,
        size: false
      }
    }
    if (initOption.option) {
      for (const n in initOption.option) {
        const optionValue = initOption.option[n]
        if (typeof optionValue === 'object') {
          if (typeof this.$option[n] !== 'object') {
            this.$option[n] = {}
          }
          for (const i in optionValue) {
            this.$option[n][i] = optionValue[i]
          }
        } else {
          this.$option[n] = optionValue
        }
      }
    }
    this.$local = createLocalValue(initOption.local)
    if (initOption.renders !== undefined) {
      this.$renders = initOption.renders
    }
  }
  $resetByForce(force: ForceValue) {
    const forceModuleValue = force.module[this.$module]
    if (forceModuleValue === false) {
      // module为否则不进行重置操作
      return
    } else if (forceModuleValue === true) {
      // module为真则进行重置操作
      this.reset(true)
    } else {
      // 不传递则进行触发模块判断
      this.reset(this._parseTrigger(force.trigger.from, force.trigger.action))
    }
  }
  protected _parseTrigger(from: string, action: string) {
    const targetOption = this.$option[from]
    if (targetOption != undefined) {
      if (typeof targetOption === 'object') {
        if (!action) {
          this.$exportMsg(`$resetByForce函数中对应的from:${from}未定义action,可定义:${Object.keys(targetOption)}`)
        } else if (targetOption[action] != undefined) {
          return targetOption[action]
        } else {
          this.$exportMsg(`$resetByForce函数中对应的from:${from}中不存在action:${action},可定义:${Object.keys(targetOption)}`)
        }
      } else {
        return targetOption as boolean
      }
    } else {
      this.$exportMsg(`$resetByForce函数未找到对应的from:${from}`)
    }
    return undefined
  }
  abstract reset(force?: boolean): void

  /**
   * 模块加载
   * @param {object} target 加载到的目标
   */
  _install (target: BaseData) {
    super._install(target)
    target.$onCreatedLife('BaseDataCreated', () => {
      target.onLife('beforeReload', {
        id: this._getId('BeforeReload'),
        handler: (_lifeValue, _instantiater, force: ForceValue) => {
          this.$resetByForce(force)
        }
      })
    })
  }
  /**
   * 模块卸载
   * @param {object} target 卸载到的目标
   */
  _uninstall(target: BaseData) {
    super._uninstall(target)
    target.offLife('beforeReload', this._getId('BeforeReload'))
  }
}

export default ResetData
