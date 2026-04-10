import Data from './../data/Data'
import BaseData from '../data/BaseData'
import type { LocalValue, LocalValueInitOption } from "../lib/AttrsValue"
import { createLocalValue } from "../lib/AttrsValue"
import ForceValue from '../lib/ForceValue'
import type { ForceValueTriggerType } from '../lib/ForceValue'
import type { renderType } from '../../type'

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
  constructor (module: string, initOption: ResetDataInitOption) {
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
      },
      sort: {
        order: false
      }
    }
    if (initOption.option) {
      for (const n in initOption.option) {
        if (typeof this.$option[n] !== 'object') {
          this.$option[n] = {}
        }
        Object.assign(this.$option[n], initOption.option[n])
      }
    }
    this.$local = createLocalValue(initOption.local)
    if (initOption.renders !== undefined) {
      this.$renders = initOption.renders
    }
  }
  $resetByForce(force: ForceValue) {
    const moduleValue = force.module[this.$module]
    if (moduleValue === false) {
      // moduleValue为否则不进行重置操作
      return
    } else if (moduleValue === true) {
      // moduleValue为真则进行重置操作
      this.reset(true)
    } else {
      // 不传递则根据触发模块判断
      this.reset(this._parseForceTrigger(force.trigger))
    }
  }
  protected _parseForceTrigger(trigger: ForceValueTriggerType) {
    const { from, action } = trigger
    const targetOption = this.$option[from]
    if (targetOption) {
      if (targetOption[action] !== undefined) {
        return targetOption[action]
      } else {
        this.$exportMsg(`resetOption中from:${from}中不存在action:${action}！存在的action如下:${Object.keys(targetOption)}`)
      }
    } else {
      this.$exportMsg(`resetOption中不存在from:${from}！`)
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
