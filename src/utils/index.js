let utils = {}

/**
 * 合并数据，仅合并一层
 * @param {*} originData
 * @param {*} defaultData
 * @returns {object}
 */
utils.formatData = function(originData, defaultData) {
  if (originData) {
    return {
      ...defaultData,
      ...originData
    }
  } else {
    return defaultData
  }
}

export default utils
