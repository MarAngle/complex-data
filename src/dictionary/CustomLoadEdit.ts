import { createCustomEdit, DefaultCustomEditInitOption } from "./CustomEdit"
import DefaultLoadEdit, { DefaultLoadEditInitOption } from "./DefaultLoadEdit"

export type CustomLoadEditInitOption = DefaultCustomEditInitOption<'customLoad'> & DefaultLoadEditInitOption<boolean>

const CustomLoadEdit = createCustomEdit<boolean, 'customLoad'>('customLoad', DefaultLoadEdit)

export default CustomLoadEdit
