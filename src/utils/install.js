import IdData from './../mod/IdData'

let install = {}

const autoId = new IdData({
  list: [
    {
      type: 'time'
    },
    {
      type: 'id'
    }
  ]
})

install.getId = function(name = '') {
  let id = 'AutoInstall' + name + autoId.getData()
  console.log(id)
  return id
}

export default install
