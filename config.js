import typeData from './option-antd/src/option/typeData'
import timeUtils from './option-antd/src/option/timeUtils'

let config = {
  LayoutData: {
    grid: 24,
    label: 8,
    content: 16
  },
  PaginationData: {
    size: 10,
    sizeList: ['10', '20', '50', '100'],
    jumperChange: true,
    sizeChange: true
  },
  SearchData: {
    menu: [
      {
        type: 'primary',
        icon: 'search',
        name: '查询',
        act: 'search'
      },
      {
        type: 'default',
        icon: 'reload',
        name: '重置',
        act: 'reset'
      }
    ]
  },
  StatusData: {
    list: [
      {
        prop: 'load',
        data: {
          list: [
            {
              value: 'unload',
              label: '未加载'
            },
            {
              value: 'loading',
              label: '加载中'
            },
            {
              value: 'loaded',
              label: '已加载'
            }
          ]
        }
      },
      {
        prop: 'update',
        data: {
          list: [
            {
              value: 'updated',
              label: '等待更新'
            },
            {
              value: 'updating',
              label: '更新中'
            }
          ]
        }
      },
      {
        prop: 'operate',
        data: {
          list: [
            {
              value: 'operated',
              label: '等待操作'
            },
            {
              value: 'operating',
              label: '操作中'
            }
          ],
          option: {
            type: 'count',
            prop: 'operating'
          }
        }
      }
    ]
  },
  UpdateData: {
    offset: 10000
  },
  antd: {
    format: {
      list: {
        width: 100,
        scrollWidth: 100,
        ellipsis: true,
        autoText: true
      }
    },
    EditData: {
      typeData: typeData,
      timeUtils: timeUtils
    }
  }
}

export default config
