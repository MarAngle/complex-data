import IdData from './../mod/IdData'

let install = {}

install.getId = function(name = '') {
  let id = new IdData({
    list: [
      'AutoInstall',
      name,
      {
        type: 'time'
      },
      {
        type: 'id'
      }
    ]
  })
  return id
}

export default install
