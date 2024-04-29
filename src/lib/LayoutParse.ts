import GridParse, { GridParseInitOption } from "./GridParse"
import InterfaceValue, { InterfaceValueInitOption } from "./InterfaceValue"

export interface LayoutParseInitOption {
  grid?: InterfaceValueInitOption<undefined | GridParseInitOption>
}

class LayoutParse {
  static $name = 'LayoutParse'
  grid: InterfaceValue<GridParse>
  constructor(initOption: LayoutParseInitOption = {}) {
    if (!initOption.grid) {
      initOption.grid = {
        default: undefined as undefined | GridParseInitOption
      }
    }
    const gridData = {} as InterfaceValueInitOption<GridParse>
    for (const prop in initOption.grid) {
      gridData[prop as keyof InterfaceValueInitOption<GridParse>] = new GridParse(initOption.grid![(prop as keyof LayoutParseInitOption['grid'])])
    }
    this.grid = new InterfaceValue(gridData)
  }
}

export default LayoutParse
