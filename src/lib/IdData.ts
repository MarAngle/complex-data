import $func from 'complex-func'
import { letterType } from 'complex-func/src/data/string/getRandomLetter'

type finalFunction = (...args:unknown[]) => string

interface baseRuleOptionTypeObjectId {
  type: 'id',
  start?: number,
  step?: number,
  interval?: string,
  intervalTo?: 'start' | 'end',
  minSize?: number,
  maxSize?: number,
}

type maxActionFunction = (current: string, option: baseRuleOptionTypeObjectId) => string

interface ruleOptionTypeObjectId extends baseRuleOptionTypeObjectId {
  maxAction?: 'cut' | 'restart' | maxActionFunction
}

interface formatRuleOptionTypeObject {
  type: 'id',
  start: number,
  step: number,
  interval: string,
  intervalTo: 'start' | 'end',
  minSize: number,
  maxSize?: number,
  maxAction: 'cut' | 'restart' | maxActionFunction
}

type ruleOptionTypeObject = {
  type: 'random',
  size: number,
  letter?: letterType
} | {
  type: 'time'
} | ruleOptionTypeObjectId

type ruleOptionType = string | ruleOptionTypeObject | finalFunction

export interface IdDataInitOption {
  list: ruleOptionType[]
}

class IdData {
  list: finalFunction[]
  constructor (initOption: IdDataInitOption) {
    this.list = []
    this.$initMain(initOption)
  }
  /**
   * 加载IdData
   * @param {object} option 参数
   * @param {object[]} option.list 参数
   */
  $initMain ({ list }: IdDataInitOption) {
    this.list = []
    for (const n in list) {
      this.$initRuleData(list[n])
    }
  }
  /**
   * 生成规则对象option
   * @param {object | function} option 规则参数
   */
  $initRuleData (option:ruleOptionType) {
    if (option) {
      const type = $func.getType(option)
      if (type == 'function') {
        this.list.push(option as finalFunction)
      } else if (type == 'string') {
        this.list.push(function () { return option as string })
      } else if (type == 'object') {
        const funcitem = this.$buildFunc(option as ruleOptionTypeObject)
        this.list.push(funcitem)
      }
    }
  }
  /**
   * 生成规则函数
   * @param {*} option 基于规则参数生成函数
   * @returns {function}
   */
  $buildFunc (option: ruleOptionTypeObject):finalFunction {
    if (option.type == 'random') {
      return function () {
        return $func.getRandomData(option.size, option.letter)
      }
    } else if (option.type == 'time') {
      return function () {
        return Date.now().toString()
      }
    } else {
      if (option.start === undefined) {
        option.start = 1
      }
      if (!option.step) {
        option.step = 1
      }
      if (!option.interval) {
        option.interval = '0'
      }
      if (!option.intervalTo) {
        option.intervalTo = 'start'
      }
      if (!option.minSize) {
        option.minSize = 6
      }
      if (option.minSize) {
        if (!option.maxAction) {
          option.maxAction = 'cut'
        }
      }
      return function () {
        let current = (option as formatRuleOptionTypeObject).start.toString()
        if (current.length < (option as formatRuleOptionTypeObject).minSize) {
          current = $func.fillString(current, (option as formatRuleOptionTypeObject).minSize, (option as formatRuleOptionTypeObject).interval, (option as formatRuleOptionTypeObject).intervalTo)
        } else if ((option as formatRuleOptionTypeObject).maxSize && current.length > (option as formatRuleOptionTypeObject).maxSize!) {
          if ((option as formatRuleOptionTypeObject).maxAction == 'cut') {
            current = current.slice(0, (option as formatRuleOptionTypeObject).maxSize)
          } else if ((option as formatRuleOptionTypeObject).maxAction == 'restart') {
            (option as formatRuleOptionTypeObject).start = 1
            current = $func.fillString('1', (option as formatRuleOptionTypeObject).minSize, (option as formatRuleOptionTypeObject).interval, (option as formatRuleOptionTypeObject).intervalTo)
          } else {
            current = ((option as formatRuleOptionTypeObject).maxAction as maxActionFunction)(current, option)
          }
        }
        (option as formatRuleOptionTypeObject).start = (option as formatRuleOptionTypeObject).start + (option as formatRuleOptionTypeObject).step
        return current
      }
    }
  }
  /**
   * 获取id
   * @returns {string}
   */
  getData () {
    let data = ''
    for (const n in this.list) {
      data = data + this.list[n]()
    }
    return data
  }
}

IdData.$name = 'IdData'

export default IdData
