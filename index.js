import Data from './src/data/Data'
import SimpleData from './src/data/SimpleData'
import DefaultData from './src/data/DefaultData'
import BaseData from './src/data/BaseData'
import SearchData from './src/data/SearchData'
import FilterData from './src/data/FilterData'

import EmptyData from './src/mod/EmptyData'
import IdData from './src/mod/IdData'
import InterfaceData from './src/mod/InterfaceData'
import FuncData from './src/mod/FuncData'
import LifeData from './src/mod/LifeData'
import ModuleData from './src/mod/ModuleData'
import StatusDataItem from './src/mod/StatusDataItem'
import StatusData from './src/mod/StatusData'
import PromiseData from './src/mod/PromiseData'
import OptionData from './src/mod/OptionData'
import PaginationData from './src/mod/PaginationData'
import ChoiceData from './src/mod/ChoiceData'
import UpdateData from './src/mod/UpdateData'
import LayoutData from './src/mod/LayoutData'
import DictionaryItem from './src/mod/DictionaryItem'
import DictionaryList from './src/mod/DictionaryList'

import ListData from './src/core/ListData'

ModuleData.setDictionary('status', StatusData)
ModuleData.setDictionary('promise', PromiseData)
ModuleData.setDictionary('option', OptionData)
ModuleData.setDictionary('pagination', PaginationData)
ModuleData.setDictionary('choice', ChoiceData)
ModuleData.setDictionary('update', UpdateData)
ModuleData.setDictionary('dictionary', DictionaryList)
ModuleData.setDictionary('search', SearchData)

export {
  Data,
  SimpleData,
  DefaultData,
  BaseData,
  SearchData,
  FilterData,

  EmptyData,
  IdData,
  InterfaceData,
  FuncData,
  LifeData,
  ModuleData,
  StatusDataItem,
  StatusData,
  PromiseData,
  OptionData,
  PaginationData,
  ChoiceData,
  UpdateData,
  LayoutData,
  DictionaryItem,
  DictionaryList,

  ListData
}
