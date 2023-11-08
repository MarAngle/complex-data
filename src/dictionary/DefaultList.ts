import DefaultMod, { DefaultModInitOption } from "./DefaultMod"
import config from "../../config"
import DictionaryValue from "./DictionaryValue"

type renderType = (payload: {
  text: unknown,
  record: Record<PropertyKey, unknown>,
  index: number,
  target: unknown,
  list: DefaultList[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => any

export interface DefaultListInitOption extends DefaultModInitOption {
  align?: 'center' | 'left' | 'right'
  width?: number | string
  ellipsis?: boolean
  auto?: boolean
  show?: DictionaryValue['show']
  render?: renderType
  pureRender?: renderType
}

class DefaultList extends DefaultMod {
  static $name = 'DefaultList'
  align: 'center' | 'left' | 'right'
  width?: number | string
  ellipsis: boolean
  auto: boolean
  show: DictionaryValue['show']
  render?: renderType
  pureRender?: renderType
  constructor(initOption: DefaultListInitOption | true, modName?: string, parent?: DictionaryValue) {
    if (initOption === true) {
      initOption = {}
    }
    super(initOption, modName, parent)
    this.show = initOption.show || (parent ? parent.show : undefined)
    this.align = initOption.align || 'center'
    this.width = initOption.width === undefined ? config.dictionary.module.list.width : initOption.width
    this.ellipsis = initOption.ellipsis === undefined ? config.dictionary.module.list.ellipsis : initOption.ellipsis
    this.auto = initOption.auto === undefined ? config.dictionary.module.list.auto : initOption.auto
    this.render = initOption.render
    this.pureRender = initOption.pureRender
  }
}

export default DefaultList