import _func from 'complex-func'
import utils from './../utils/index'
import DefaultData from './../data/DefaultData'
import EmptyData from './EmptyData'

class ChoiceData extends DefaultData {
  constructor (initdata = {}) {
    initdata.data = utils.formatData(initdata.data, {
      id: [],
      list: []
    })
    super(initdata)
    this.triggerCreateLife('ChoiceData', 'beforeCreate', initdata)
    this.status = {
      show: false
    }
    this.resetOption = {
      load: false,
      reload: false,
      update: false,
      search: {
        set: true,
        reset: true
      },
      page: {
        page: false,
        size: false
      }
    }
    this.option = {}
    this.checkInit(initdata)
    this.triggerCreateLife('ChoiceData', 'created')
  }
  checkInit(initdata = {}) {
    if (initdata.show) {
      this.setShow(true)
      this.initChoiceData(initdata)
    }
  }
  setShow(data = false) {
    this.status.show = data
  }
  getShow() {
    return this.status.show
  }
  initChoiceData(initdata = {}) {
    if (initdata.reset) {
      for (let n in initdata.reset) {
        if (typeof initdata.reset[n] == 'object') {
          if (typeof this.resetOption[n] != 'object') {
            this.resetOption[n] = {}
          }
          for (let i in initdata.reset[n]) {
            this.resetOption[n][i] = initdata.reset[n][i]
          }
        } else {
          this.resetOption[n] = initdata.reset[n]
        }
      }
    }
    if (initdata.option) {
      this.option = {
        ...initdata.option
      }
    }
  }
  getOption() {
    return this.option
  }
  getData(prop) {
    if (prop) {
      return this.data[prop]
    } else {
      return this.data
    }
  }
  formatItemFromList(id, totalList, idProp = 'id') {
    for (let n = 0; n < totalList.length; n++) {
      let item = totalList[n]
      if (item && item[idProp] == id) {
        totalList.splice(n, 1)
        return item
      }
    }
    return new EmptyData('ChoiceData空选项数据')
  }
  // 数据变更=>id作为唯一基准
  changeData(idList, currentList = [], check = 'auto', idProp) {
    // check 'auto'/'force'
    if (check == 'force' || idList.length != currentList.length) {
      let totalList = currentList
      for (let n = 0; n < this.data.list.length; n++) {
        let item = this.data.list[n]
        if (totalList.indexOf(item) < 0) {
          totalList.push(item)
        }
      }
      let list = []
      for (let i = 0; i < idList.length; i++) {
        let id = idList[i]
        list[i] = this.formatItemFromList(id, totalList, idProp)
      }
      this.setData(idList, list)
    } else {
      this.setData(idList, currentList)
    }
  }
  // 添加选择
  addData(idList, list = [], idProp) {
    let currentIdList = this.data.id
    for (let i = 0; i < idList.length; i++) {
      let id = idList[i]
      if (currentIdList.indexOf(id) < 0) {
        currentIdList.push(id)
      }
    }
    this.changeData(idList, list, idProp)
  }
  setData(idList, list) {
    this.data.id = idList
    this.data.list = list
  }
  autoReset(option, defaultOption) {
    option = this.formatResetOption(option, defaultOption)
    let force = this.checkReset(option)
    this.reset(force)
  }
  formatResetOption(option, defaultOption = 'load') {
    if (!option) {
      option = defaultOption
    }
    if (typeof option != 'object') {
      option = {
        from: option
      }
    }
    return option
  }
  checkReset(option = {}) {
    let from = option.from
    let reset
    if (from === true) {
      reset = true
    } else if (this.resetOption[from] !== undefined) {
      if (this.resetOption[from] && typeof this.resetOption[from] == 'object') {
        let act = option.act
        if (!act) {
          this.printInfo(`checkReset函数中对应的from:${from}未定义act,可定义:${Object.keys(this.resetOption[from])}`)
        } else if (this.resetOption[from][act] !== undefined) {
          reset = this.resetOption[from][act]
        } else {
          this.printInfo(`checkReset函数中对应的from:${from}中不存在act:${act},可定义:${Object.keys(this.resetOption[from])}`)
        }
      } else {
        reset = this.resetOption[from]
      }
    } else {
      this.printInfo(`checkReset函数未找到对应的from:${from}`)
    }
    return reset
  }
  reset(force) {
    if (force) {
      this.setData([], [])
    }
  }
  install (target) {
    target.onLife('reseted', {
      id: this.$getModuleName('Reseted'),
      data: () => {
        this.reset(true)
      }
    })
  }
  uninstall(target) {
    target.offLife('reseted', this.$getModuleName('Reseted'))
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'DefaultData',
        describe: '选择类',
        build: [
          {
            prop: 'initdata',
            extend: true,
            data: [
              {
                prop: 'show',
                type: 'boolean',
                required: false,
                describe: 'choice加载显示判断值'
              },
              {
                prop: 'reset',
                type: 'object',
                required: false,
                describe: '各个阶段重置判断值',
                data: [
                  {
                    prop: 'load',
                    type: 'boolean',
                    describe: '加载重置'
                  },
                  {
                    prop: 'reload',
                    type: 'boolean',
                    describe: '重新加载重置'
                  },
                  {
                    prop: 'update',
                    type: 'boolean',
                    describe: '更新重置'
                  },
                  {
                    prop: 'search',
                    type: 'object/boolean',
                    describe: '加载重置',
                    data: [
                      {
                        prop: 'set',
                        type: 'boolean',
                        describe: '检索重置'
                      },
                      {
                        prop: 'reset',
                        type: 'boolean',
                        describe: '检索重置重置'
                      }
                    ]
                  },
                  {
                    prop: 'page',
                    type: 'object/boolean',
                    describe: '加载重置',
                    data: [
                      {
                        prop: 'page',
                        type: 'boolean',
                        describe: '分页切换'
                      },
                      {
                        prop: 'size',
                        type: 'boolean',
                        describe: 'size切换重置'
                      }
                    ]
                  }
                ]
              },
              {
                prop: 'option',
                type: 'object',
                required: false,
                describe: 'choice列表中额外字段的接受，可根据组件自由定制'
              }
            ]
          }
        ],
        data: [
          {
            prop: 'data',
            extend: true,
            data: [
              {
                prop: 'id',
                class: 'array',
                describe: 'id列表 '
              },
              {
                prop: 'list',
                class: 'array',
                describe: '数据列表'
              }
            ]
          },
          {
            prop: 'status',
            type: 'object',
            describe: '状态对象',
            data: [
              {
                prop: 'show',
                type: 'boolean',
                describe: '显示加载判断值'
              }
            ]
          },
          {
            prop: 'resetOption',
            type: 'object',
            describe: '重置判断值对象',
            data: [
              {
                prop: 'load',
                type: 'boolean',
                describe: '加载重置'
              },
              {
                prop: 'reload',
                type: 'boolean',
                describe: '重新加载重置'
              },
              {
                prop: 'update',
                type: 'boolean',
                describe: '更新重置'
              },
              {
                prop: 'search',
                type: 'object',
                describe: '加载重置',
                data: [
                  {
                    prop: 'set',
                    type: 'boolean',
                    describe: '检索重置'
                  },
                  {
                    prop: 'reset',
                    type: 'boolean',
                    describe: '检索重置重置'
                  }
                ]
              },
              {
                prop: 'page',
                type: 'object',
                describe: '加载重置',
                data: [
                  {
                    prop: 'page',
                    type: 'boolean',
                    describe: '分页切换'
                  },
                  {
                    prop: 'size',
                    type: 'boolean',
                    describe: 'size切换重置'
                  }
                ]
              }
            ]
          },
          {
            prop: 'option',
            type: 'object',
            describe: 'choice列表中额外字段的接受，可根据组件自由定制'
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

ChoiceData.initInstrcution()

export default ChoiceData
