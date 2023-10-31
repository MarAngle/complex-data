
const config = {
  active: {
    data: 'actived',
    auto: true
  },
  update : {
    offset: 60000
  },
  status: {
    data: {
      load: {
        trigger: {
          start: {
            from: ['un', 'fail'],
            to: 'ing'
          },
          success: {
            from: ['ing'],
            to: 'success'
          },
          fail: {
            from: ['ing'],
            to: 'fail'
          }
        },
        list: ['un', 'ing', 'success', 'fail']
      },
      operate: {
        trigger: {
          start: {
            from: ['un'],
            to: 'ing'
          },
          success: {
            from: ['ing'],
            to: 'un'
          },
          fail: {
            from: ['ing'],
            to: 'un'
          }
        },
        list: ['un', 'ing'],
        option: {
          type: 'count'
        }
      }
    }
  }
}

export default config
