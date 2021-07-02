import _func from 'complex-func'

function buildLoadContent(contents, countUrl) {
  // -----
  let importurl = ''
  let exportlist = ''
  let maindata = {}
  function LoadProp (data, contents) {
    _func.loadContents(contents, function(item, path) {
      let name = path.replace(/^\.\/(.*)\.\w+$/, '$1')
      if (!data[name]) {
        data[name] = item.default
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
  LoadProp(maindata, contents)
  countProp(maindata, countUrl)

  console.log(importurl)
  console.log(exportlist)
  // -----
}
const dataContent = require.context('./src/data', false, /\.js$/)
const modContent = require.context('./src/mod', false, /\.js$/)
const mainContent = require.context('./src/main', false, /\.js$/)
if (_func.getEnv() == 'development') {
  buildLoadContent(modContent, 'src/mod')
  buildLoadContent(dataContent, 'src/data')
  buildLoadContent(mainContent, 'src/main')
}
