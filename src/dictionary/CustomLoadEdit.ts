import { createCustomEdit, DefaultCustomEditInitOption } from "./CustomEdit"
import DefaultLoadEdit, { DefaultLoadEditInitOption } from "./DefaultLoadEdit"

export type CustomLoadEditInitOption = DefaultCustomEditInitOption<'customLoad'> & DefaultLoadEditInitOption<boolean>

class CustomLoadEdit extends createCustomEdit<boolean, 'customLoad'>('customLoad', DefaultLoadEdit) {}

export default CustomLoadEdit
