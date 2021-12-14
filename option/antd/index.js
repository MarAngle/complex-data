
import _func from 'complex-func'
import modOption from './../../modOption'
import EditData from './../antd/mod/EditData'
import config from '../config'

let defaultOption = {
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
        return data
      }
    },
    unformat: function (ditem, mod) {
      let pitem = {
        ...ditem.$mod[mod],
        $func: ditem.$func
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
        showType: ditem.getInterface('showType', mod),
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
      data.prop = ditem.prop
      data.parent = ditem
      return new EditData(data)
    },
    unformat: function (ditem, mod) {
      let pitem = {
        prop: ditem.prop,
        label: ditem.getInterface('label', mod),
        originProp: ditem.getInterface('originProp', mod),
        type: ditem.getInterface('type', mod),
        $func: ditem.$func,
        layout: ditem.getLayout(mod),
        edit: ditem.$mod[mod]
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
  }
}

let antdOption = {
  init() {
    for (const n in defaultOption) {
      modOption.setDictionary(n, defaultOption[n])
    }
    modOption.setDictionary('build', 'edit', true)
    modOption.setDictionary('change', 'edit', true)
  }
}

export default antdOption
