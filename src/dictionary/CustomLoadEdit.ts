import type { DefaultCustomEditInitOption } from "./CustomEdit"
import { createCustomEdit } from "./CustomEdit"
import DefaultLoadEdit from "./DefaultLoadEdit"
import type { DefaultLoadEditInitOption } from "./DefaultLoadEdit"

export type CustomLoadEditInitOption = DefaultCustomEditInitOption<'customLoad'> & DefaultLoadEditInitOption<boolean>

class CustomLoadEdit extends createCustomEdit<boolean, 'customLoad'>('customLoad', DefaultLoadEdit) {}

export default CustomLoadEdit
