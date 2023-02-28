import { setDataByDefault } from 'complex-utils'

export const formatInitOption = function(initOption?: any, defaultInitOption?: any, emptyErrorMsg?: any) {
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
    setDataByDefault(initOption, defaultInitOption)
  }
  return initOption
}
