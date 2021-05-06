let utils = {}

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
