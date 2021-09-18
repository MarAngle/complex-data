import _func from 'complex-func'
import typeData from './../option/typeData'
import timeUtils from './../option/timeUtils'
import BaseData from './../../../src/data/BaseData'
import PaginationData from './../../../src/mod/PaginationData'
import InterfaceData from './../../../src/mod/InterfaceData'

class EditData extends BaseData {
  constructor(editdata, payload) {
    super(editdata)
    this.triggerCreateLife('EditData', 'beforeCreate', editdata, payload)
    this._initMainByEditData(editdata, payload)
    this.triggerCreateLife('EditData', 'created')
  }
  _initMainByEditData(editdata, payload = {}) {
    this.initMain(editdata)
    this.initSlot(editdata)
    this.initTips(editdata)
    this.initType(editdata)
  }
  initMain(editdata) {
    // this.label = parent.label // 名称设置=InterfaceData数据类型
    this.reload = editdata.reload || false // 异步二次加载判断值
    this.hideLabel = editdata.hideLabel === undefined ? false : editdata.hideLabel
    this.colon = editdata.colon === undefined ? true : editdata.colon // label属性：显示判断值
    this.disabled = new InterfaceData(editdata.disabled || false)
    this.option = {}
    this.value = {}
  }
  // slot格式化编辑数据
  initSlot (editdata) { // label / front / end
    this.slot = editdata.slot || {}
    if (!this.slot.type) { // slot类型 auto/main/item/model
      this.slot.type = 'auto'
    }
    if (!this.slot.name) { // name=>插槽默认名
      this.slot.name = this.prop
    }
    if (!this.slot.label) { // label=>title
      this.slot.label = this.slot.name + '-label'
    }
  }
  // 格式化编辑数据
  initTips (editdata) {
    // tips提示
    if (!editdata.tips) {
      this.tips = {
        props: {
          title: ''
        }
      }
    } else {
      let tipsType = _func.getType(editdata.tips)
      if (tipsType != 'object') {
        this.tips = {
          props: {
            title: editdata.tips
          }
        }
      } else {
        this.tips = editdata.tips
      }
    }
  }
  initType(editdata) {
    this.type = editdata.type || 'input'
    this.required = editdata.required || false
    // 组件事件监控
    this.on = editdata.on || {}
    let typeOption = typeData.getData(this.type)
    // 宽度设置
    if (editdata.mainwidth) {
      let type = _func.getType(editdata.mainwidth)
      if (type == 'number') {
        this.mainwidth = editdata.mainwidth + 'px'
      } else {
        this.mainwidth = editdata.mainwidth
      }
    }
    if (editdata.width) {
      let type = _func.getType(editdata.width)
      if (type == 'number') {
        this.width = editdata.width + 'px'
      } else {
        this.width = editdata.width
      }
    } else if (editdata.width === undefined && typeOption.width) {
      this.width = typeOption.width
    }
    this.initValue(editdata, typeOption)
    // 需要默认触发的函数=>数组，会默认接收对应事件的触发，主要为form的emit做基础，单独回调需要在事件中定义
    this.eventTriggerList = typeOption.eventList
    // 格式化占位符和检验规则
    if (typeOption.placeholder) {
      if (!editdata.placeholder) {
        this.placeholder = new InterfaceData(typeOption.placeholder(this.getParent().getInterfaceData('label')))
      } else {
        this.placeholder = new InterfaceData(editdata.placeholder)
      }
    }
    if (!editdata.option) {
      editdata.option = {}
    }
    // 插槽重置
    if (editdata.option.slot && this.slot.type == 'auto') {
      this.slot.type = editdata.option.slot
    }
    // 插件单独的设置，做特殊处理时使用，尽可能的将所有能用到的数据通过option做兼容处理避免问题
    // main item ...
    this.localOption = editdata.localOption || {}
    if (this.type == 'input') {
      // INPUT
      this.option.type = editdata.option.type || 'text'
      this.option.maxLength = editdata.option.maxLength || typeOption.option.maxLength
      this.option.hideClear = editdata.option.hideClear || typeOption.option.hideClear
    } else if (this.type == 'inputNumber') {
      // INPUTNUMBER
      this.option.max = editdata.option.max === undefined ? Infinity : editdata.option.max
      this.option.min = editdata.option.min === undefined ? -Infinity : editdata.option.min
      this.option.precision = editdata.option.precision === undefined ? 0 : editdata.option.precision // 精确到几位小数，接受非负整数
      this.option.step = editdata.option.step === undefined ? 1 : editdata.option.step // 点击步进
    } else if (this.type == 'switch') {
      // SWITCH
    } else if (this.type == 'select') {
      // 考虑位置在data.list的可行性
      // =>避免后期修改时存在的问题，基本数据结构提前生成，非当前必要字段也应生成
      this.option.list = editdata.option.list || []
      this.option.mode = editdata.option.mode || 'default' // 设置 Select 的模式为多选或标签	'default' | 'multiple' | 'tags' | 'combobox'
      this.option.optionValue = editdata.option.optionValue || 'value'
      this.option.optionLabel = editdata.option.optionLabel || 'label'
      this.option.optionDisabled = editdata.option.optionDisabled || 'disabled'
      // this.option.popupLocation = editdata.option.popupLocation || 'form' // 默认归属的dom元素，暂时注释等待优化
      this.option.hideArrow = editdata.option.hideArrow || false
      this.option.hideClear = editdata.option.hideClear || false
      this.option.filterOption = editdata.option.filterOption || false // 是否自动过滤
      this.option.autoWidth = editdata.option.autoWidth || false // 宽度自适应
      this.option.noDataContent = editdata.option.noDataContent // 无数据时文字显示 == 默认不传使用antd的默认模板
      if (this.option.mode == 'multiple') {
        this.setValueToArray()
      }
      // 存在分页相关设置
      if (editdata.pagination) {
        if (!this.func.page) {
          if (!this.getData) {
            this.printMsg('选择器存在分页器时需要定义page回调或者getData函数供分页时调用')
          }
          this.func.page = (act, data) => {
            this.loadData(true, this.option.search.value).then(res => {}, err => { this.printMsg('loadData失败！', 'error', { data: err }) })
          }
        }
        let paginationOption = editdata.pagination
        if (paginationOption === true) {
          paginationOption = {
            size: 10,
            mod: {
              sizehidden: true,
              jumphidden: true,
              total: 'hidden'
            }
          }
        }
        this.pagination = new PaginationData(paginationOption)
      } else {
        this.pagination = null
      }
      // 添加默认的重置选项数据
      if (!this.func.clearData) {
        this.func.clearData = () => {
          this.option.list = []
          this.func.clearPagination()
        }
      }
      // 添加默认的重置分页器函数
      if (!this.func.clearPagination) {
        this.func.clearPagination = () => {
          if (this.pagination) {
            this.pagination.setTotal(0)
          }
        }
      }
      // 检索下拉设置
      let search = editdata.option.search
      if (!search) {
        search = {
          show: false
        }
      } else if (search === true) {
        search = {
          show: true
        }
      }
      this.option.search = {
        show: search.show, // 检索模式开启判断值
        value: '', // 当前检索数据
        min: search.min || 0, // 检索触发值，auto模式下
        noDataContent: search.noDataContent || this.option.noDataContent,
        noSizeContent: search.noSizeContent || 0,
        auto: search.auto === undefined ? true : search.auto, // 是否load检索
        reset: search.reset || false // 是否重新检索，默认保存上次检索值?
      }
      this.option.search.noSizeContent = search.noSizeContent || `请输入${this.option.search.min}位及以上的值检索`
      if (this.option.search.show && this.option.search.auto) {
        let handleSearch = this.on.search
        this.on.search = (...args) => {
          this.func.searchStart(...args)
          if (handleSearch) {
            handleSearch(...args)
          }
        }
        let handleDropdownVisibleChange = this.on.dropdownVisibleChange
        this.on.dropdownVisibleChange = (...args) => {
          this.func.openStart(...args)
          if (handleDropdownVisibleChange) {
            handleDropdownVisibleChange(...args)
          }
        }
        if (!this.func.openStart) {
          this.func.openStart = (isOpen) => {
            if (isOpen) {
              // 下拉打开时
              if (this.option.search.reset) {
                // 当前reset模式下直接进行value和分页器的重置
                this.func.clearPagination()
                this.on.search('')
              } else {
                // 不强制加载
                this.loadData(false, this.option.search.value).then(res => {}, err => { this.printMsg('loadData失败！', 'error', { data: err }) })
              }
            }
          }
        }
        if (!this.func.autoSearch) {
          this.func.autoSearch = (act) => {
            if (act == 'init') {
              let num = this.option.search.value.length
              if (num < this.option.search.min) {
                this.option.noDataContent = this.option.search.noSizeContent
                this.func.clearData()
                return false
              } else {
                return true
              }
            } else if (act == 'loading') {
              this.option.noDataContent = '检索中...'
              return true
            } else if (act == 'loaded') {
              if (this.option.list.length <= 0) {
                this.option.noDataContent = this.option.search.noDataContent
                return false
              } else {
                return true
              }
            }
          }
        }
        // 通过生命周期触发对应的状态操作
        this.onLife('beforeLoad', {
          id: 'autoSearchBeforeLoad',
          data: () => {
            this.func.autoSearch('loading')
          }
        })
        this.onLife('loaded', {
          id: 'autoSearchLoaded',
          data: () => {
            this.func.autoSearch('loaded')
          }
        })
        this.onLife('loadFail', {
          id: 'autoSearchLoadFail',
          data: () => {
            this.func.clearData()
            this.func.autoSearch('loaded')
          }
        })
        // 生命周期设置完成
        if (!this.func.searchStart) {
          this.func.searchStart = (value) => {
            this.option.search.value = value || ''
            if (this.func.autoSearch('init')) {
              this.loadData(true, this.option.search.value).then(res => {}, err => { this.printMsg('loadData失败！', 'error', { data: err }) })
            }
          }
        }
      }
    } else if (this.type == 'cascader') {
      // 考虑位置在data.list的可行性
      // =>避免后期修改时存在的问题，基本数据结构提前生成，非当前必要字段也应生成
      this.option.options = editdata.option.options
      this.option.allowClear = editdata.option.allowClear === undefined ? true : editdata.option.allowClear
      this.option.autoFocus = editdata.option.autoFocus || false
      this.option.changeOnSelect = editdata.option.changeOnSelect || false
      this.option.displayRender = editdata.option.displayRender
      this.option.expandTrigger = editdata.option.expandTrigger
      this.option.fieldNames = editdata.option.fieldNames
      this.option.getPopupContainer = editdata.option.getPopupContainer
      this.option.notFoundContent = editdata.option.notFoundContent
      this.option.popupPlacement = editdata.option.popupPlacement
      this.option.showSearch = editdata.option.showSearch
      this.option.size = editdata.option.size
      this.option.suffixIcon = editdata.option.suffixIcon
      this.option.loadData = editdata.option.loadData

      this.setValueToArray()
      // 检索下拉设置
    } else if (this.type == 'date') {
      // DATEPICKER
      this.option.showTime = timeUtils.timeOptionFormat(editdata.option.showTime)
      this.option.format = editdata.option.format || this.option.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD' // 默认显示解析
      this.option.formatedit = editdata.option.formatedit || this.option.format // 默认确认后的数据解析
      if (editdata.option.disabledDate) {
        let type = _func.getType(editdata.option.disabledDate)
        if (type === 'object') {
          let disabledDateOption = timeUtils.timeCheckOptionFormat(editdata.option.disabledDate)
          this.option.disabledDate = function (value) {
            return timeUtils.timeCheck(value, disabledDateOption)
          }
        } else {
          this.option.disabledDate = editdata.option.disabledDate
        }
      }
      this.option.disabledTime = editdata.option.disabledTime
      if (this.func.edit === undefined) { // 可设置为false实现不默认格式化为moment
        this.func.edit = (value) => {
          return timeUtils.funcEdit(value, this.option.formatedit)
        }
      }
      if (this.func.unedit === undefined) { // 可设置为false实现moment对象的传递
        this.func.unedit = (value) => {
          return timeUtils.funcUnEdit(value, this.option.formatedit)
        }
      }
    } else if (this.type == 'dateRange') {
      // DATERANGEPICKER
      this.setValueToArray()
      this.option.showTime = timeUtils.timeOptionFormat(editdata.option.showTime, true)
      this.option.separator = editdata.option.separator || '-' // 分隔符
      this.option.format = editdata.option.format || this.option.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD' // 默认显示解析
      this.option.formatedit = editdata.option.formatedit || this.option.format // 默认确认后的数据解析
      if (editdata.option.limit) {
        // 格式化时间限制参数
        this.option.limit = timeUtils.formatLimitOption(editdata.option.limit)
      }
      // 时间限制逻辑，因时间time可控性差，不通过disabled进行判断
      // // 提取出来，避免后期切换limit值时无法触发响应的操作
      // let handleCalendarChange = this.on.calendarChange
      // this.on.calendarChange = (...args) => {
      //   if (this.option.limit) {
      //     let value = args[0]
      //     if (value && value.length == 1 && value[0]) {
      //       this.option.limit.current = value[0]
      //     } else {
      //       this.option.limit.current = null
      //     }
      //   }
      //   if (handleCalendarChange) {
      //     handleCalendarChange(...args)
      //   }
      // }
      // 不可用时间格式化
      if (editdata.option.disabledDate) {
        let type = _func.getType(editdata.option.disabledDate)
        if (type === 'object') {
          let disabledDateOption = timeUtils.timeCheckOptionFormat(editdata.option.disabledDate)
          this.option.disabledDate = (value) => {
            return timeUtils.timeCheck(value, disabledDateOption)
          }
        } else {
          this.option.disabledDate = editdata.option.disabledDate
        }
      }
      // // 提取disabledDate，避免后期切换limit值或者disabledDate时无法触发响应的操作
      // let handleDisabledDate = this.option.disabledDate
      // this.option.disabledDate = (value, ...args) => {
      //   let isDisabled = false
      //   if (handleDisabledDate) {
      //     isDisabled = handleDisabledDate(value, ...args)
      //   }
      //   if (!isDisabled && value && this.option.limit) {
      //     isDisabled = timeUtils.dateLimitCheck(value, this.option.limit)
      //   }
      //   return isDisabled
      // }
      // // 提取disabledTime，避免后期切换limit值或者disabledTime时无法触发响应的操作
      // let handleDisabledTime = this.option.disabledTime
      // if (handleDisabledTime) {
      //   this.option.disabledTime = handleDisabledTime
      // }
      // 通过监控change事件，实现时间限制操作，disabledNext为限制后的重置操作
      let handleChange = this.on.change
      this.on.change = (value, strValue, ...args) => {
        if (this.option.limit && value && value.length == 2) {
          let isDisabled = timeUtils.checkDateLimitByOption(value[0], value[1], this.option.limit)
          if (isDisabled && this.option.limit.disabledNext) {
            this.option.limit.disabledNext(value, strValue, this.option.limit.msg)
          }
        }
        if (handleChange) {
          handleChange(value, strValue, ...args)
        }
      }
      if (this.func.edit === undefined) { // 可设置为false实现不默认格式化为moment
        this.func.edit = (value) => {
          return timeUtils.funcEditRange(value, this.option.formatedit)
        }
      }
      if (this.func.unedit === undefined) { // 可设置为false实现moment对象的传递
        this.func.unedit = (value) => {
          return timeUtils.funcUnEditRange(value, this.option.formatedit)
        }
      }
    } else if (this.type == 'file') {
      // FILE
      this.option.accept = editdata.option.accept || ''
      this.option.multiple = editdata.option.multiple || false
      this.option.multipleAppend = editdata.option.multipleAppend || false // 多选状态下多个文件中一个存在问题时的操作
      this.option.maxNum = editdata.option.maxNum || 0
      this.option.minNum = editdata.option.minNum || 0
      this.option.maxSize = editdata.option.maxSize || 0
      this.option.upload = editdata.option.upload || false
      this.option.fileUpload = editdata.option.fileUpload || false
      this.option.layout = editdata.option.layout === undefined ? 'auto' : editdata.option.layout
      if (this.option.upload && !this.option.fileUpload) {
        this.printMsg('上传插件需要定义上传方法:fileUpload=>option')
      }
      if (this.option.multiple) {
        this.setValueToArray()
      }
    } else if (this.type == 'button') {
      // BUTTON
      this.option.loading = editdata.option.loading || false
      this.option.type = editdata.option.type || 'default'
      this.option.icon = editdata.option.icon || ''
      this.option.name = editdata.option.name ? new InterfaceData(editdata.option.name) : this.placeholder
    } else if (this.type == 'slot') {
    }
    this.buildRules(editdata, typeOption)
  }
  buildRules(editdata, typeOption) {
    // 数组，对应事件触发时进行单独的rule判断
    this.autoTrigger = editdata.autoTrigger
    if (this.autoTrigger === undefined) {
      if (typeOption.rule && typeOption.rule.autoTrigger) {
        this.autoTrigger = typeOption.rule.autoTrigger
      }
    }
    if (editdata.rules) {
      this.rules = new InterfaceData(editdata.rules)
    } else {
      this.rules = new InterfaceData([
        {
          required: this.required
        }
      ])
    }
    let message = new InterfaceData(editdata.ruleMessage)
    let trigger
    if (typeOption.rule) {
      if (!message.isInit()) {
        if (typeOption.rule.message) {
          message = new InterfaceData(typeOption.rule.message(this.getParent().getInterfaceData('label')))
        } else {
          message = this.placeholder
        }
      }
      if (typeOption.rule.trigger) {
        trigger = typeOption.rule.trigger
      }
    }
    this.rules.map((data, prop) => {
      let ruleList = data[prop]
      for (let n in ruleList) {
        let rule = ruleList[n]
        if (rule.required === undefined) {
          rule.required = this.required
        }
        if (rule.message === undefined && message.isInit()) {
          rule.message = message.getData(prop)
        }
        if (!rule.trigger && trigger) {
          rule.trigger = trigger
        }
      }
    })
  }
  initValue(editdata, typeOption) {
    if (_func.hasProp(editdata, 'defaultdata')) {
      this.setValueData(editdata.defaultdata, 'defaultdata')
    } else {
      this.setValueData(typeOption.defaultdata, 'defaultdata')
    }
    if (_func.hasProp(editdata, 'initdata')) {
      this.value.initdata = editdata.initdata
    } else {
      this.value.initdata = this.value.defaultdata
    }
    if (_func.hasProp(editdata, 'resetdata')) {
      this.value.resetdata = editdata.resetdata
    } else {
      this.value.resetdata = this.value.defaultdata
    }
  }
  readyData() {
    return new Promise((resolve, reject) => {
      let needLoad = false
      if (this.type == 'select') {
        if (!this.option.search.show && this.getData) {
          // select非search模式下需要进行数据的加载
          needLoad = true
        }
      } else if (this.type == 'cascader') {
        if (this.getData) {
          // select非search模式下需要进行数据的加载
          needLoad = true
        }
      }
      if (needLoad) {
        // search需要在打开阶段进行数据获取
        this.loadData(this.reload).then(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
      } else {
        resolve({ status: 'success' })
      }
    })
  }
  setValueToArray() {
    let proplist = ['initdata', 'defaultdata', 'resetdata']
    for (let n = 0; n < proplist.length; n++) {
      let prop = proplist[n]
      let type = _func.getType(this.getValueData(prop))
      if (type != 'array') {
        this.setValueData([], prop)
      }
    }
  }
  setValueData(data, prop = 'defaultdata') {
    this.value[prop] = data
  }
  getValueData(prop = 'defaultdata') {
    return this.value[prop]
  }
  _selfName () {
    return `(${this.constructor._name})`
  }
  printMsg(info, type = 'error', option) {
    _func.printMsgAct(this._selfName() + ':' + info, type, option)
  }
  toString() {
    return this._selfName()
  }
}

EditData._name = 'EditData'

export default EditData
