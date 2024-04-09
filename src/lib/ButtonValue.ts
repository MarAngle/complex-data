import { fileOption, renderType } from "../type"
import MenuValue, { MenuValueInitOption } from "./MenuValue"

export interface ButtonValueInitOption<E = MouseEvent, A extends unknown[] = unknown[]> extends MenuValueInitOption<E, A> {
  upload?: (file: File) => Promise<unknown>
  fileOption?: Partial<fileOption>
  render?: renderType
}

class ButtonValue<E = MouseEvent, A extends unknown[] = unknown[]> extends MenuValue<E, A> {
  upload?: (file: File) => Promise<unknown>
  fileOption?: Partial<fileOption>
  render?: renderType
  constructor(initOption: ButtonValueInitOption<E, A>) {
    super(initOption)
    this.upload = initOption.upload
    this.fileOption = initOption.fileOption
    this.render = initOption.render
  }
}

export default ButtonValue

