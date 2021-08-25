import _func from 'complex-func'
import instrcution from './data'
import SimpleData from './../src/data/SimpleData.js'

SimpleData.buildInstrcution = function (instrcutionData) {
  instrcution.build(instrcutionData)
}

SimpleData.getInstrcution = function (type) {
  return instrcution.get(this.name, type)
}

let data = {}

function LoadProp (contents) {
  _func.loadContents(contents, function(item, path) {
    let name = path.replace(/^\.\/(.*)\.\w+$/, '$1')
    if (!data[name]) {
      data[name] = item.default
    } else {
      console.error('auto mod load is repeat')
    }
  })
}
const dataContent = require.context('./data', false, /\.js$/)
const modContent = require.context('./mod', false, /\.js$/)
const mainContent = require.context('./main', false, /\.js$/)

LoadProp(modContent)
LoadProp(dataContent)
LoadProp(mainContent)

export default data
