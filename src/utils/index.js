import _func from 'complex-func'

let utils = {
  formatInitOption(initOption, defaultInitOption, emptyErrorMsg) {
    if (!initOption) {
      if (emptyErrorMsg) {
        throw new Error(emptyErrorMsg)
      } else {
        initOption = {}
      }
    } else if (initOption === true) {
      initOption = {}
    }
    if (defaultInitOption) {
      _func.setDataByDefault(initOption, defaultInitOption)
    }
    return initOption
  }
}

export default utils
