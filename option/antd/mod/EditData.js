import _func from 'complex-func'
import DefaultEdit from '../../mod/DefaultEdit'
import InterfaceData from './../../../src/mod/InterfaceData'
import config from '../../config'
import dateUtils from './../utils/date'

class EditData extends DefaultEdit {
  constructor(initOption, payload) {
    if (!initOption) {
      throw new Error('编辑数据模块初始化参数为空！')
    }
    if (initOption.module && initOption.module.pagination === true) {
      initOption.module.pagination = {
        size: 10,
        mod: {
          sizehidden: true,
          jumphidden: true,
          total: 'hidden'
        }
      }
    }
    super(initOption)
    this.triggerCreateLife('EditData', 'beforeCreate', initOption, payload)
    this.hideLabel = initOption.hideLabel === undefined ? false : initOption.hideLabel
    this.colon = initOption.colon === undefined ? true : initOption.colon // label属性：显示判断值
    this.option = {}
    // 触发操作，暂时隐藏考虑其他实现方案
    // this.eventTriggerList = defaultOption.eventList
    this.initTips(initOption)
    this.triggerCreateLife('EditData', 'created')
  }
  // 格式化编辑数据
  initTips (initOption) {
    // tips提示
    if (!initOption.tips) {
      this.tips = {
        props: {
          title: ''
        }
      }
    } else {
      let tipsType = _func.getType(initOption.tips)
      if (tipsType != 'object') {
        this.tips = {
          props: {
            title: initOption.tips
          }
        }
      } else {
        this.tips = initOption.tips
      }
    }
  }
  initLocalOption(initOption) {
    if (!initOption.option) {
      initOption.option = {}
    }
    let defaultOption = config.antd.edit.getData(this.type)
    if (this.type == 'input') {
      // 输入框
      this.option.type = initOption.option.type || 'text'
      this.option.maxLength = initOption.option.maxLength || defaultOption.option.maxLength
      this.option.hideClear = initOption.option.hideClear || defaultOption.option.hideClear
    } else if (this.type == 'inputNumber') {
      // 数字输入框
      this.option.max = initOption.option.max === undefined ? Infinity : initOption.option.max
      this.option.min = initOption.option.min === undefined ? -Infinity : initOption.option.min
      this.option.precision = initOption.option.precision === undefined ? 0 : initOption.option.precision // 精确到几位小数，接受非负整数
      this.option.step = initOption.option.step === undefined ? 1 : initOption.option.step // 点击步进
    } else if (this.type == 'switch') {
      // 开关
    } else if (this.type == 'select') {
      // 选择器
      // =>避免后期修改时存在的问题，基本数据结构提前生成，非当前必要字段也应生成
      this.option.list = initOption.option.list || []
      this.option.mode = initOption.option.mode || 'default' // 设置 Select 的模式为多选或标签	'default' | 'multiple' | 'tags' | 'combobox'
      this.option.optionValue = initOption.option.optionValue || 'value'
      this.option.optionLabel = initOption.option.optionLabel || 'label'
      this.option.optionDisabled = initOption.option.optionDisabled || 'disabled'
      // this.option.popupLocation = initOption.option.popupLocation || 'form' // 默认归属的dom元素，暂时注释等待优化
      this.option.hideArrow = initOption.option.hideArrow || false
      this.option.hideClear = initOption.option.hideClear || false
      this.option.filterOption = initOption.option.filterOption || false // 是否自动过滤
      this.option.autoWidth = initOption.option.autoWidth || false // 宽度自适应
      this.option.noDataContent = initOption.option.noDataContent // 无数据时文字显示 == 默认不传使用antd的默认模板
      if (this.option.mode == 'multiple') {
        // 多选模式下将multiple赋值，统一多选处理逻辑
        this.setMultiple(true)
      }
      if (this.$module.pagination) {
        // 存在分页相关设置
        if (!this.$func.page) {
          if (!this.$getData) {
            this.$exportMsg('选择器存在分页器时需要定义page回调或者$getData函数供分页时调用')
          }
          this.$func.page = (act, data) => {
            this.loadData(true, this.option.search.value).then(res => {}, err => { this.$exportMsg('loadData失败！', 'error', { data: err }) })
          }
        }
      }
      // 添加默认的重置选项数据
      if (!this.$func.resetList) {
        this.$func.resetList = () => {
          this.option.list = []
          this.$func.resetPagination()
        }
      }
      // 添加默认的重置分页器函数
      if (!this.$func.resetPagination) {
        this.$func.resetPagination = () => {
          if (this.$module.pagination) {
            this.$module.pagination.setTotal(0)
          }
        }
      }
      // 检索下拉设置
      let search = initOption.option.search
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
        reset: search.reset || false // 是否重新检索，默认保存上次检索值
      }
      this.option.search.noSizeContent = search.noSizeContent || `请输入${this.option.search.min}位及以上的值检索`
      if (this.option.search.show && this.option.search.auto) {
        let handleSearch = this.on.search
        this.on.search = (...args) => {
          this.$func.searchStart(...args)
          if (handleSearch) {
            handleSearch(...args)
          }
        }
        let handleDropdownVisibleChange = this.on.dropdownVisibleChange
        this.on.dropdownVisibleChange = (...args) => {
          this.$func.openStart(...args)
          if (handleDropdownVisibleChange) {
            handleDropdownVisibleChange(...args)
          }
        }
        if (!this.$func.openStart) {
          this.$func.openStart = (isOpen) => {
            if (isOpen) {
              // 下拉打开时
              if (this.option.search.reset) {
                // 当前reset模式下直接进行value和分页器的重置
                this.$func.clearPagination()
                this.on.search('')
              } else {
                // 不强制加载
                if (this.$func.autoSearch('init')) {
                  this.loadData(false, this.option.search.value).then(res => {}, err => { this.$exportMsg('loadData失败！', 'error', { data: err }) })
                }
              }
            }
          }
        }
        if (!this.$func.autoSearch) {
          this.$func.autoSearch = (act) => {
            if (act == 'init') {
              let num = this.option.search.value.length
              if (num < this.option.search.min) {
                this.option.noDataContent = this.option.search.noSizeContent
                this.$func.resetList()
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
            this.$func.autoSearch('loading')
          }
        })
        this.onLife('loaded', {
          id: 'autoSearchLoaded',
          data: () => {
            this.$func.autoSearch('loaded')
          }
        })
        this.onLife('loadFail', {
          id: 'autoSearchLoadFail',
          data: () => {
            this.$func.resetList()
            this.$func.autoSearch('loaded')
          }
        })
        // 生命周期设置完成
        if (!this.$func.searchStart) {
          this.$func.searchStart = (value) => {
            this.option.search.value = value || ''
            if (this.$func.autoSearch('init')) {
              this.loadData(true, this.option.search.value).then(res => {}, err => { this.$exportMsg('loadData失败！', 'error', { data: err }) })
            }
          }
        }
      }
    } else if (this.type == 'cascader') {
      // 考虑位置在data.list的可行性
      // =>避免后期修改时存在的问题，基本数据结构提前生成，非当前必要字段也应生成
      this.option.options = initOption.option.options
      this.option.allowClear = initOption.option.allowClear === undefined ? true : initOption.option.allowClear
      this.option.autoFocus = initOption.option.autoFocus || false
      this.option.changeOnSelect = initOption.option.changeOnSelect || false
      this.option.expandTrigger = initOption.option.expandTrigger
      this.option.size = initOption.option.size
      this.option.displayRender = initOption.option.displayRender
      this.option.fieldNames = initOption.option.fieldNames
      this.option.getPopupContainer = initOption.option.getPopupContainer
      this.option.notFoundContent = initOption.option.notFoundContent
      this.option.popupPlacement = initOption.option.popupPlacement
      this.option.suffixIcon = initOption.option.suffixIcon
      let loadData = initOption.option.loadData
      if (loadData) {
        this.option.loadData = (selectedOptions) => {
          loadData.call(this, selectedOptions)
        }
      }
      let showSearch = initOption.option.showSearch
      if (showSearch) {
        this.option.showSearch = showSearch
      }
      this.setMultiple(true)
    } else if (this.type == 'date') {
      // DATEPICKER
      this.option.showTime = dateUtils.timeOptionFormat(initOption.option.showTime)
      this.option.format = initOption.option.format || this.option.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD' // 默认显示解析
      this.option.formatEdit = initOption.option.formatEdit || this.option.format // 默认确认后的数据解析
      if (initOption.option.disabledDate) {
        let type = _func.getType(initOption.option.disabledDate)
        if (type === 'object') {
          let disabledDateOption = dateUtils.timeCheckOptionFormat(initOption.option.disabledDate)
          this.option.disabledDate = function (value) {
            return dateUtils.timeCheck(value, disabledDateOption)
          }
        } else {
          this.option.disabledDate = initOption.option.disabledDate
        }
      }
      this.option.disabledTime = initOption.option.disabledTime
      if (this.$func.edit === undefined) { // 可设置为false实现不默认格式化为moment
        this.$func.edit = (value) => {
          return dateUtils.funcEdit(value, this.option.formatEdit)
        }
      }
      if (this.$func.post === undefined) { // 可设置为false实现moment对象的传递
        this.$func.post = (value) => {
          return dateUtils.funcPost(value, this.option.formatEdit)
        }
      }
    } else if (this.type == 'dateRange') {
      // DATERANGEPICKER
      this.setMultiple(true)
      this.option.showTime = dateUtils.timeOptionFormat(initOption.option.showTime, true)
      this.option.separator = initOption.option.separator || '-' // 分隔符
      this.option.format = initOption.option.format || this.option.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD' // 默认显示解析
      this.option.formatEdit = initOption.option.formatEdit || this.option.format // 默认确认后的数据解析
      if (initOption.option.limit) {
        // 格式化时间限制参数
        this.option.limit = dateUtils.formatLimitOption(initOption.option.limit)
      }
      // 不可用时间格式化
      if (initOption.option.disabledDate) {
        let type = _func.getType(initOption.option.disabledDate)
        if (type === 'object') {
          let disabledDateOption = dateUtils.timeCheckOptionFormat(initOption.option.disabledDate)
          this.option.disabledDate = (value) => {
            return dateUtils.timeCheck(value, disabledDateOption)
          }
        } else {
          this.option.disabledDate = initOption.option.disabledDate
        }
      }
      // 通过监控change事件，实现时间限制操作，disabledNext为限制后的重置操作
      let handleChange = this.on.change
      this.on.change = (value, strValue, ...args) => {
        if (this.option.limit && value && value.length == 2) {
          let isDisabled = dateUtils.checkDateLimitByOption(value[0], value[1], this.option.limit)
          if (isDisabled && this.option.limit.disabledNext) {
            this.option.limit.disabledNext(value, strValue, this.option.limit.msg)
          }
        }
        if (handleChange) {
          handleChange(value, strValue, ...args)
        }
      }
      if (this.$func.edit === undefined) { // 可设置为false实现不默认格式化为moment
        this.$func.edit = (value) => {
          return dateUtils.funcEditRange(value, this.option.formatEdit)
        }
      }
      if (this.$func.post === undefined) { // 可设置为false实现moment对象的传递
        this.$func.post = (value) => {
          return dateUtils.funcPostRange(value, this.option.formatEdit)
        }
      }
    } else if (this.type == 'file') {
      // FILE
      this.option.accept = initOption.option.accept || ''
      this.option.multiple = this.multiple
      this.option.multipleAppend = initOption.option.multipleAppend || false // 多选状态下多个文件中一个存在问题时的操作
      this.option.maxNum = initOption.option.maxNum || 0
      this.option.minNum = initOption.option.minNum || 0
      this.option.maxSize = initOption.option.maxSize || 0
      this.option.upload = initOption.option.upload || false
      this.option.fileUpload = initOption.option.fileUpload || false
      this.option.layout = initOption.option.layout === undefined ? 'auto' : initOption.option.layout
      if (this.option.upload && !this.option.fileUpload) {
        this.$exportMsg('上传插件需要定义上传方法:fileUpload=>option')
      }
    } else if (this.type == 'button') {
      // BUTTON
      this.option.loading = initOption.option.loading || false
      this.option.type = initOption.option.type || 'default'
      this.option.icon = initOption.option.icon || ''
      this.option.name = initOption.option.name ? new InterfaceData(initOption.option.name) : this.placeholder
    } else if (this.type == 'slot') {
    }
    this.buildRules(initOption, defaultOption)
  }
  buildRules(initOption, defaultOption) {
    // 数组，对应事件触发时进行单独的rule判断
    this.autoTrigger = initOption.autoTrigger
    if (this.autoTrigger === undefined) {
      if (defaultOption.rule && defaultOption.rule.autoTrigger) {
        this.autoTrigger = defaultOption.rule.autoTrigger
      }
    }
    if (initOption.rules) {
      this.rules = new InterfaceData(initOption.rules)
    } else {
      this.rules = new InterfaceData([
        {
          required: this.required
        }
      ])
    }
    let message = new InterfaceData(initOption.ruleMessage)
    let trigger
    if (defaultOption.rule) {
      if (!message.isInit()) {
        if (defaultOption.rule.message) {
          message = new InterfaceData(defaultOption.rule.message(this.getParent().getInterfaceData('label')))
        } else {
          message = this.placeholder
        }
      }
      if (defaultOption.rule.trigger) {
        trigger = defaultOption.rule.trigger
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
  checkReadyData() {
    if (this.type == 'select') {
      if (!this.option.search.show) {
        return this.$getData
      } else {
        return false
      }
    } else {
      return this.$getData
    }
  }
}

EditData.$name = 'EditData'

export default EditData
