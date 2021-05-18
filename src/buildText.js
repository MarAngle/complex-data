// -----
let importurl = ''
let exportlist = ''

const _data = require.context('./data', false, /\.js$/)
const _mod = require.context('./mod', false, /\.js$/)
const _main = require.context('./main', false, /\.js$/)
let maindata = {}
let mainmod = {}
let mainmain = {}
function LoadProp (data, _prop) {
  let jslist = _prop.keys()
  jslist.forEach(item => {
    let moditem = _prop(item)
    let modname = item.replace(/^\.\/(.*)\.\w+$/, '$1')
    if (!data[modname]) {
      data[modname] = moditem.default
    } else {
      console.error('auto mod load is repeat')
    }
  })
}
function countProp (data, url) {
  if (importurl) {
    importurl += `
`
exportlist += `
`
  }
  for (let n in data) {
    exportlist = exportlist + `
  ${n},`
    importurl = importurl + `
import ${n} from './${url}/${n}'`
  }
}
LoadProp(maindata, _data)
countProp(maindata, 'data')
LoadProp(mainmod, _mod)
countProp(mainmod, 'mod')
LoadProp(mainmain, _main)
countProp(mainmain, 'main')
console.log(importurl)
console.log(exportlist)
// -----
