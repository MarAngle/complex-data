import IdData from './../mod/IdData'

let install = {
  getId: function(name: string = '') {
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
}

export default install
