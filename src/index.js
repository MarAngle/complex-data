import SimpleData from './data/SimpleData'
import DefaultData from './data/DefaultData'
import BaseData from './data/BaseData'
import ComplexData from './data/ComplexData'
import ComplexDataWithSearch from './data/ComplexDataWithSearch'
import SelectList from './data/SelectList'

import ChoiceData from './mod/ChoiceData'
import DictionaryData from './mod/DictionaryData'
import DictionaryList from './mod/DictionaryList'
import EmptyData from './mod/EmptyData'
import ExtraData from './mod/ExtraData'
import IdData from './mod/IdData'
import InstrcutionData from './mod/InstrcutionData'
import InterfaceData from './mod/InterfaceData'
import LifeData from './mod/LifeData'
import OptionData from './mod/OptionData'
import PaginationData from './mod/PaginationData'
import ParentData from './mod/ParentData'
import PromiseData from './mod/PromiseData'
import SearchData from './mod/SearchData'
import StatusData from './mod/StatusData'
import StatusDataItem from './mod/StatusDataItem'
import UpdateData from './mod/UpdateData'

import ListData from './main/ListData'
import InfoData from './main/InfoData'
import TreeData from './main/TreeData'
import option from './option'
// // -----
// const _data = require.context('./data', false, /\.js$/)
// const _mod = require.context('./mod', false, /\.js$/)
// let maindata = {}
// let mainmod = {}
// function LoadProp (data, _prop) {
//   let jslist = _prop.keys()
//   jslist.forEach(item => {
//     let moditem = _prop(item)
//     let modname = item.replace(/^\.\/(.*)\.\w+$/, '$1')
//     if (!data[modname]) {
//       data[modname] = moditem.default
//     } else {
//       console.error('auto mod load is repeat')
//     }
//   })
// }
// function countProp (data, url) {
// let importurl = ``
// let exportlist = ``
// for (let n in data) {
//   exportlist = exportlist + `
// ${n},`
//   importurl = importurl + `
// import ${n} from './${url}/${n}'`
// }
// exportlist += ``
// console.log(importurl)
// console.log(exportlist)
// }
// LoadProp(maindata, _data)
// LoadProp(mainmod, _mod)
// countProp(maindata, 'data')
// countProp(mainmod, 'mod')
// // -----

export {
  SimpleData,
  DefaultData,
  BaseData,
  ComplexData,
  ComplexDataWithSearch,
  SelectList,
  ChoiceData,
  DictionaryData,
  DictionaryList,
  EmptyData,
  ExtraData,
  IdData,
  InstrcutionData,
  InterfaceData,
  LifeData,
  OptionData,
  PaginationData,
  ParentData,
  PromiseData,
  SearchData,
  StatusData,
  StatusDataItem,
  UpdateData,
  ListData,
  InfoData,
  TreeData,
  option
}
