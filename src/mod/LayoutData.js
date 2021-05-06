import _func from 'complex-func'
import InterfaceData from './InterfaceData'
import SimpleData from './../data/SimpleData'

class LayoutData extends SimpleData {
  constructor (initdata) {
    super()
    this.initData(initdata)
  }
  initData (initdata) {
    if (!initdata) {
      initdata = {
        default: undefined
      }
    }
    for (let n in initdata) {
      initdata[n] = this.formatLayout(initdata[n])
    }
    this.data = new InterfaceData(initdata)
  }
  formatLayout(data) {
    if (!data) {
      data = {}
    }
    if (!data.type) {
      data.type = 'grid'
    }
    if (!data.grid) {
      data.grid = 24
    }
    if (data.type == 'grid') {
      if (!data.label) {
        data.label = {
          span: 8
        }
      } else if (_func.getType(data.label) !== 'object') {
        data.label = {
          span: data.label
        }
      }
      if (!data.content) {
        data.content = {
          span: 16
        }
      } else if (_func.getType(data.content) !== 'object') {
        data.content = {
          span: data.content
        }
      }
    } else if (data.type == 'width') {
      if (!data.width) {
        data.width = undefined
      }
    }
    return data
  }
  setData (prop, data) {
    this.data.setData(prop, this.formatLayout(data))
  }
  getData (prop) {
    return this.data.getData(prop)
  }
  getMain () {
    return this.data.getMain()
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'SimpleData',
        describe: '布局描述类',
        build: [
          {
            prop: 'initdata',
            type: 'object',
            describe: 'key=>取值value值',
            data: [
              {
                prop: '[key]',
                type: 'any',
                describe: 'key的布局'
              },
              {
                prop: '[value]',
                type: 'object',
                describe: '布局数据',
                data: [
                  {
                    prop: 'type',
                    type: 'string',
                    describe: '默认grid/width'
                  },
                  {
                    prop: 'label',
                    type: 'object/number',
                    describe: 'grid状态布局数据，默认{ span: ... },可传递栅栏数据对象'
                  },
                  {
                    prop: 'content',
                    type: 'object/number',
                    describe: 'grid状态布局数据，默认{ span: ... },可传递栅栏数据对象'
                  },
                  {
                    prop: 'content',
                    type: 'number',
                    describe: 'width布局数据，默认undef'
                  }
                ]
              }
            ]
          }
        ],
        data: [
          {
            prop: 'data',
            type: 'object',
            class: 'InterfaceData',
            describe: '布局描述数据保存位置'
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

LayoutData.initInstrcution()

export default LayoutData
