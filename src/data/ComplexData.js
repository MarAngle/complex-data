import _func from 'complex-func'
import utils from './../utils/index'
import BaseData from './BaseData'

class ComplexData extends BaseData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    initOption.data = utils.formatData(initOption.data, {
      list: [],
      current: {}
    })
    super(initOption)
    this.triggerCreateLife('ComplexData', 'beforeCreate', initOption)
    this.$initComplexDataLife()
    this.triggerCreateLife('ComplexData', 'created')
  }
  /**
   * 加载生命周期函数
   */
  $initComplexDataLife() {
    // 添加重置生命周期回调，此时通过设置项对data数据进行重置操作，对象list/current属性
    this.onLife('reseted', {
      id: 'AutoComplexDataReseted',
      data: (instantiater, resetOption) => {
        if (this.parseResetOption(resetOption, 'data') !== false) {
          if (this.parseResetOption(resetOption, 'data.list') !== false) {
            this.resetDataList()
          }
          if (this.parseResetOption(resetOption, 'data.current') !== false) {
            this.resetDataCurrent()
          }
        }
      }
    })
  }
  /**
   * 重置data.list
   */
  resetDataList() {
    _func.clearArray(this.data.list)
  }
  /**
   * 重置data.current
   */
  resetDataCurrent() {
    for (let n in this.data.current) {
      delete this.data.current[n]
    }
  }
}

ComplexData.$name = 'ComplexData'

export default ComplexData
