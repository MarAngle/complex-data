import _func from 'complex-func'

let utils = {
  formatInitOption(initOption, defaultInitOption, noneErrorMsg) {
    if (!initOption) {
      if (noneErrorMsg) {
        throw new Error(noneErrorMsg)
      } else {
        initOption = {}
      }
    }
    if (defaultInitOption) {
      _func.setDataByDefault(initOption, defaultInitOption)
    }
    return initOption
  }
}

export default utils
