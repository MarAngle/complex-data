import _func from 'complex-func'
import ComplexDataWithSearch from './../data/ComplexDataWithSearch'

class InfoData extends ComplexDataWithSearch {
  constructor (initdata) {
    if (!initdata) {
      initdata = {}
    }
    super(initdata)
    this.triggerCreateLife('InfoData', 'beforeCreate', initdata)
    this.triggerCreateLife('InfoData', 'created')
  }
  // 格式化信息数据
  formatData (origindata = {}, type = 'list', option = {}) {
    if (!option.type) {
      option.type = 'add'
    }
    this.updateItem(this.data.current, origindata, type, option)
  }
  // 数据重新拉取
  reloadData (force, ...args) {
    return new Promise((resolve, reject) => {
      this.loadData(force, ...args).then(res => {
        resolve(res)
      }, err => {
        console.error(err)
        reject(err)
      })
    })
  }
  // --数据相关--*/
  // 获取对象
  getItem(prop) {
    if (prop) {
      return this.data.current[prop]
    } else {
      return this.data.current
    }
  }
  static initInstrcution() {
    if (this.instrcutionShow()) {
      const instrcutionData = {
        extend: 'ComplexDataWithSearch',
        describe: '信息模块',
        build: [],
        data: [],
        method: []
      }
      instrcutionData.prop = this.name
      this.buildInstrcution(instrcutionData)
    }
  }
}

InfoData.initInstrcution()

export default InfoData
