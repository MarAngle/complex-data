import { DefaultEditButtonInitOption, DefaultEditButtonOption } from "../dictionary/DefaultEditButton"
import DictionaryData, { DictionaryDataInitOption } from "../module/DictionaryData"

export interface searchMenuType extends DefaultEditButtonOption {
  prop: string
  name: string
  click?: DefaultEditButtonInitOption['click']
  reactive?: DefaultEditButtonInitOption['reactive']
}

export interface SearchDataInitOption extends DictionaryDataInitOption {
  prop?: string
  menu?: searchMenuType[]
}

class SearchData extends DictionaryData {
  static $name = 'SearchData'
  $prop: string
  constructor(initOption: SearchDataInitOption) {
    const prop = initOption.prop || 'search'
    const menu = initOption.menu
    if (menu) {
      if (!initOption.list) {
        initOption.list = []
      }
      for (let i = 0; i < menu.length; i++) {
        const menuInitOption = menu[i]
        initOption.list.push({
          prop: menuInitOption.prop,
          name: menuInitOption.name,
          simple: true,
          mod: {
            [prop]: {
              $format: 'edit',
              type: 'button',
              option: {
                type: menuInitOption.type,
                icon: menuInitOption.icon,
                name: menuInitOption.name,
                loading: menuInitOption.loading
              },
              click: menuInitOption.click,
              reactive: menuInitOption.reactive
            }
          }
        })
      }
    }
    super(initOption)
    this._triggerCreateLife('SearchData', 'beforeCreate', initOption)
    this.$prop = prop
    this._triggerCreateLife('SearchData', 'created')
  }
}

export default SearchData
