import BaseData from './src/data/BaseData'
import DefaultData from './src/data/DefaultData'
import SimpleData from './src/data/SimpleData'

import ChoiceData from './src/mod/ChoiceData'
import DictionaryData from './src/mod/DictionaryData'
import DictionaryList from './src/mod/DictionaryList'
import EmptyData from './src/mod/EmptyData'
import FuncData from './src/mod/FuncData'
import IdData from './src/mod/IdData'
import InterfaceData from './src/mod/InterfaceData'
import LayoutData from './src/mod/LayoutData'
import LifeData from './src/mod/LifeData'
import ModuleData from './src/mod/ModuleData'
import OptionData from './src/mod/OptionData'
import PaginationData from './src/mod/PaginationData'
import PromiseData from './src/mod/PromiseData'
import StatusData from './src/mod/StatusData'
import StatusDataItem from './src/mod/StatusDataItem'
import UpdateData from './src/mod/UpdateData'

import ListData from './src/core/ListData'

ModuleData.setDictionary('status', StatusData)
ModuleData.setDictionary('promise', PromiseData)
ModuleData.setDictionary('dictionary', DictionaryList)
ModuleData.setDictionary('option', OptionData)
ModuleData.setDictionary('choice', ChoiceData)
ModuleData.setDictionary('pagination', PaginationData)
ModuleData.setDictionary('update', UpdateData)

export {
  BaseData,
  DefaultData,
  SimpleData,
  ChoiceData,
  DictionaryData,
  DictionaryList,
  EmptyData,
  FuncData,
  IdData,
  InterfaceData,
  LayoutData,
  LifeData,
  ModuleData,
  OptionData,
  PaginationData,
  PromiseData,
  StatusData,
  StatusDataItem,
  UpdateData,
  ListData
}
