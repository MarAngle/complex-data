import IdData from './../mod/IdData'

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

let install = {
  /**
   * 获取id
   * @param {string} name 名称
   * @returns {string}
   */
  getId: function(name = '') {
    let id = 'Auto' + name + autoId.getData()
    return id
  }
}

export default install
