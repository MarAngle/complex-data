import Data from './src/data/Data'
import SimpleData from './src/data/SimpleData'
import DefaultData from './src/data/DefaultData'
import BaseData from './src/data/BaseData'
import SearchData from './src/data/SearchData'
import SelectList from './src/data/SelectList'

import ComplexData from './src/core/ComplexData'
import ComplexList from './src/core/ComplexList'

import AttributesData from './src/lib/AttributesData'
import EmptyData from './src/lib/EmptyData'
import IdData from './src/lib/IdData'
import InterfaceData from './src/lib/InterfaceData'
import LifeItem from './src/lib/LifeItem'
import LifeData from './src/lib/LifeData'
import ModuleData from './src/lib/ModuleData'
import StatusItem from './src/lib/StatusItem'
import StatusData from './src/lib/StatusData'
import PromiseData from './src/lib/PromiseData'
import DependData from './src/lib/DependData'
import UpdateData from './src/lib/UpdateData'
import LayoutData from './src/lib/LayoutData'
import DictionaryData from './src/lib/DictionaryData'
import DictionaryList from './src/lib/DictionaryList'
import PaginationData from './src/lib/PaginationData'
import ChoiceData from './src/lib/ChoiceData'

import ObserveList from './src/mod/ObserveList'
import DefaultEdit from './src/mod/DefaultEdit'
import DefaultInfo from './src/mod/DefaultInfo'
import DefaultList from './src/mod/DefaultList'
import DefaultCustom from './src/mod/DefaultCustom'

ModuleData.setDictionary('status', StatusData)
ModuleData.setDictionary('promise', PromiseData)
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
  SelectList,

  ComplexData,
  ComplexList,

  AttributesData,
  EmptyData,
  IdData,
  InterfaceData,
  LifeItem,
  LifeData,
  ModuleData,
  StatusItem,
  StatusData,
  PromiseData,
  DependData,
  UpdateData,
  LayoutData,
  DictionaryData,
  DictionaryList,
  PaginationData,
  ChoiceData,

  ObserveList,
  DefaultEdit,
  DefaultInfo,
  DefaultList,
  DefaultCustom
}
