function loadContents(contents, fn) {
  let contentList = contents.keys()
  contentList.forEach((path, index) => {
    fn(contents(path), path, index)
  })
}
function buildLoadContent(contents, countUrl) {
  // -----
  let importurl = ''
  let exportlist = ''
  let maindata = {}
  function LoadProp (data, contents) {
    loadContents(contents, function(item, path) {
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
buildLoadContent(dataContent, 'src/data')
const modContent = require.context('./src/mod', false, /\.js$/)
buildLoadContent(modContent, 'src/mod')
const mainContent = require.context('./src/main', false, /\.js$/)
buildLoadContent(mainContent, 'src/main')
