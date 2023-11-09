
const config = {
  active: {
    data: 'actived',
    auto: true
  },
  update : {
    offset: 60000
  },
  pagination: {
    size: {
      show: true,
      data: 10,
      list: [10, 20, 50, 100]
    },
    jumper: {
      change: true
    }
  },
  layout: {
    grid: 24,
    label: 8,
    content: 16
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
  },
  dictionary: {
    empty: true,
    depth: Symbol('depth'),
    module: {
      list: {
        width: 100,
        ellipsis: true,
        auto: true
      }
    }
  }
}

export default config
