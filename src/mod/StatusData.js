import SimpleData from './../data/SimpleData'
import StatusDataItem from './StatusDataItem'

class StatusData extends SimpleData {
  constructor (initdata = {}) {
    super()
    this.data = {}
    this._initMain(initdata)
  }
  _initMain ({
    list
  }) {
    this._initList(list)
  }
  _initList (list = []) {
    let defaultlist = [
      {
        prop: 'load',
        data: {
          list: [
            {
              value: 'unload',
              label: '未加载'
            },
            {
              value: 'loading',
              label: '加载中'
            },
            {
              value: 'loaded',
              label: '已加载'
            }
          ]
        }
      },
      {
        prop: 'update',
        data: {
          list: [
            {
              value: 'updated',
              label: '等待更新'
            },
            {
              value: 'updating',
              label: '更新中'
            }
          ]
        }
      },
      {
        prop: 'operate',
        data: {
          list: [
            {
              value: 'operated',
              label: '等待操作'
            },
            {
              value: 'operating',
              label: '操作中'
            }
          ],
          option: {
            type: 'count',
            prop: 'operating'
          }
        }
      }
    ]
    let mainlist = defaultlist.concat(list)
    for (let n in mainlist) {
      let item = mainlist[n]
      this.data[item.prop] = new StatusDataItem(item.data)
    }
  }
  getData (mainprop, prop) {
    return this.data[mainprop].getData(prop)
  }
  setData (mainprop, data, act) {
    this.data[mainprop].setData(data, act)
  }
  reset () {
    for (let n in this.data) {
      this.data[n].reset()
    }
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'SimpleData',
        describe: '状态数据',
        build: [
          {
            prop: 'initdata',
            data: [
              {
                prop: 'list',
                type: 'array',
                describe: '单独状态数据',
                data: [
                  {
                    prop: '[key]',
                    type: 'string',
                    describe: '属性值'
                  },
                  {
                    prop: '[value]',
                    type: 'object',
                    describe: 'StatusDataItem初始化参数'
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
            describe: 'StatusDataItem实例保存位置'
          }
        ],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

StatusData.initInstrcution()

export default StatusData
