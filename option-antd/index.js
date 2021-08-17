import EditData from './src/data/EditData'
import _func from 'complex-func'
import option from './../src/option'
import config from '../config'

let antdOption = {
  data: {
    list: {
      format: function (ditem, mod, data) {
        if (data) {
          if (!data.dataIndex) {
            data.dataIndex = ditem.prop
          }
          if (!data.align) {
            data.align = 'center'
          }
          if (data.width === undefined) {
            data.width = config.antd.format.list.width
          }
          if (!data.scrollWidth) {
            data.scrollWidth = config.antd.format.list.scrollWidth
          }
          if (data.ellipsis === undefined) {
            data.ellipsis = config.antd.format.list.ellipsis
          }
          if (data.autoText === undefined) {
            data.autoText = config.antd.format.list.autoText
          }
          if (data.customCell) {
            let type = _func.getType(data.customCell)
            if (type == 'object') {
              let customCellOption = data.customCell
              data.customCell = () => {
                return customCellOption
              }
            }
          }
          if (data.customHeaderCell) {
            let type = _func.getType(data.customHeaderCell)
            if (type == 'object') {
              let customHeaderCellOption = data.customHeaderCell
              data.customHeaderCell = () => {
                return customHeaderCellOption
              }
            }
          }
          ditem.mod[mod] = data
        }
      },
      unformat: function (ditem, mod) {
        let pitem = {
          ...ditem.mod[mod],
          func: ditem.func
        }
        if (!pitem.title) {
          pitem.title = ditem.getInterface('label', mod)
        }
        return pitem
      }
    },
    info: {
      unformat: function (ditem, mod, { targetitem }) {
        let pitem = {
          prop: ditem.prop,
          label: ditem.getInterface('label', mod),
          showtype: ditem.getInterface('showtype', mod),
          layout: ditem.getLayout(mod),
          option: {
            ...ditem[mod]
          }
        }
        let target = ditem.triggerFunc('show', targetitem[ditem.prop], {
          targetitem: targetitem,
          type: mod
        })
        pitem.data = target
        return pitem
      }
    },
    edit: {
      format: function (ditem, mod, data) {
        if (data.type == 'edit') {
          ditem.mod[mod] = ditem.mod.edit
        } else {
          data.prop = ditem.prop
          data.parent = ditem
          ditem.mod[mod] = new EditData(data, {})
        }
      },
      unformat: function (ditem, mod) {
        let pitem = {
          prop: ditem.prop,
          label: ditem.getInterface('label', mod),
          originprop: ditem.getInterface('originprop', mod),
          type: ditem.getInterface('type', mod),
          func: ditem.func,
          layout: ditem.getLayout(mod),
          edit: ditem.mod[mod]
        }
        return pitem
      },
      build: function (data, mod, payload) {
        data.form = {
          num: 0,
          dom: null,
          data: {}
        }
      }
    },
    build: {
      type: 'edit'
    },
    change: {
      type: 'edit'
    }
  }
}

antdOption.init = function(data = {}) {
  for (let n in data) {
    if (!this.data[n]) {
      this.data[n] = {}
      for (let i in data[n]) {
        this.data[n][i] = data[n][i]
      }
    }
  }
  option.setData(this.data)
}

export default antdOption
