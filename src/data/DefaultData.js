import _func from 'complex-func'
import SimpleData from './SimpleData'
import ModuleData from './../mod/ModuleData'
import LifeData from './../mod/LifeData'

class DefaultData extends SimpleData {
  constructor (initOption) {
    if (!initOption) {
      initOption = {}
    }
    super(initOption)
    this.$module = new ModuleData({
      life: new LifeData(initOption.life)
    })
  }
}

DefaultData.$name = 'DefaultData'

export default DefaultData
