import _func from 'complex-func'
import DefaultEdit from '../../mod/DefaultEdit'
import InterfaceData from './../../../src/mod/InterfaceData'
import config from '../../config'

class EditData extends DefaultEdit {
  constructor(initOption, payload) {
    super(initOption)
    this.triggerCreateLife('EditData', 'beforeCreate', initOption, payload)
    this.triggerCreateLife('EditData', 'created')
  }
}

EditData.$name = 'EditData'

export default EditData
