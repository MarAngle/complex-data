
### Abandon
- 优化ObserveList通过defineReactive实现而不是之前的observe实现
- - 实际上此实现可能会导致form在重复生成响应式时导致过多的set重写问题，暂时弃用
- 考虑originProp跟随edit，尽可能的把字典数据与编辑数据解绑，包括编辑函数，考虑加载时把对应函数直接加载到编辑数据中，简化字典数据
- - 理论上originProp是全局一致，跟随edit需要额外定义，实现逻辑更改为originProp与prop相同则不赋值
- DictionaryData中添加菜单转DictionaryValue的函数
- - 通过尽可能减少DictionaryData与DictionaryValue的关联，后期主要通过DictionaryValue实现功能逻辑，转换功能放弃
- 重新instanceof判断static [Symbol.hasInstance](instance: any) { return instance.constructor.$name === this.$name }
- - 实际调用发现，最终的判断都会到Data中去判断与Data的关系而不是与DefaultData的关系，猜测每个类单独重写此方法可能回有效，但是可能存在重写疏漏导致的错误问题，此功能放弃，特殊项目需要可以单独实现
- 放弃级联数据的关联，级联数据需要可通过基础函数实现，仅添加depth作为可能存在的深度的额外判断条件
- 相互依赖关系通过额外的工具函数实现
- DefaultMod的formaters属性，考虑实现对AttrsValue的最终格式化，但是因renders函数本身能实现相关功能且需要对组件进行大量适配，放弃

### TIPS
- 持续优化reset/destory，其中reset在能恢复的基础上尽可能的删除数据，destory不考虑恢复问题，尽可能的初始化数据
- 删除属性测试结果，delete时间长但是后期内存占用小，设置undefined速度快但是有小内存占用
- 数据保存，array/object/map测试结果，内存占用array[593M]/object[882M]/map[982M]，保存速度array[958ms]/object[5084ms]/map[5161ms]，读取速度array[基于index速度最快基于循环查找超大数据量下内存溢出]/object[1872ms]/map[268ms]

### ToDo
- 优化全局类型
- 实现List表单
- SearchMenu实现完成后联动刷新机制
- 简化整体代码
- 优化代码结构

### Doing

### `4.10.7`
- feat(SimpleDateEdit): `rangeLimit`配置扩展，添加相等判断和信息提示，并优化修正相关功能。
- feat(DefaultEdit): 添加`ruleMessage`配置项以及相关的默认值，实现快速定义ruleMessage的功能。

### `4.10.6`
- feat(SimpleDateEdit): 添加`complexDisabledDate`配置项，协调`rangeLimit`一起，存在其中一个参数时`disabledDate`禁用时间判断函数将额外传递参数实现复杂判断。
- feat(SimpleDateEdit): 优化`$parseRuleList`函数，当前是范围时间选择器时，则需要额外判断数据的开始结束时间都不为空。
- feat(type): 添加`editPayloadType`类型。

### `4.10.5`
- fix(dictionary): 删除 `DictionaryValue` 的冗余属性 `label` 。

### `4.10.4`
- feat(load): `SelectData` 和 `BaseData` 添加 `onLoaded` 方法，用于注册加载成功的回调。该方法会判断当前加载状态：若已加载，则立即执行回调；若未加载，则等待加载完成后执行。

### `4.10.3`
- feat(menu): `MenuValue` 添加modifiers事件修饰符。

### `4.10.2`
- feat(force): `ForceValue` 在 `ing=true` 时，若 `data` 不存在则默认为 `true`，确保 `ing` 判断逻辑在 `data` 为空时依然有效。

### `4.10.1`
- refactor(build): 移除项目的所有构建配置，回归到纯源码模式。
- feat(test): 完善 `Vitest` 单元测试流程，并实现了基础的单元测试架构。
- docs(readme): 优化 `README.md` 文件。
- chore(history): 全面优化和重构 `history.md` 的格式。
- fix(cache): 修正 `StorageValue` 中基于读取次数的缓存过期机制未正确计数导致无法过期的 BUG。
- refactor(grid): 移除 `GridParse` 中未使用的冗余代码。

### `4.9.8`
- fix(track): 修正 `TrackData.resetStatus` 错误的将 `init` 设置为 `false` 的 BUG。
- feat(track): 优化轨迹数据的整体逻辑。

### `4.9.6`
- fix(track): 修正 `TrackData.pushData` 在无数据和无地图覆盖物的初始状态修正，以及未正确计算 `maxIndex` 和 `dict` 的 BUG。

### `4.9.5`
- refactor(track): `TrackData` 的 `line/connect` 的变量名优化。
- fix(track): 修正 `TrackData.stop`。

### `4.9.4`
- fix(track): 修正 `TrackData.pushData` 未重新计算 `maxIndex` 的 BUG。

### `4.9.3`
- feat(track): `TrackData` 添加 `pushData` 方法。
- fix(track): 修正 `TrackData.$setIndex` 在未传递 `currentIndex` 时，在结束时错误将 `this.$index.next.data` 设置为溢出 `index` 的 BUG。

### `4.9.2`
- feat(track): 优化 `TrackData` 轨迹数据。

### `4.9.1`
- feat(module): 修改模块加载逻辑为 ES2020。

### `4.8.15`
- feat(config): `config` => `dataConfig`, `dataConfig` 添加 `style` 属性, 输出 `dataConfig`。

### `4.8.13`
- feat(select): 扩展 `SelectValue` 数据，添加 `$color` 属性，此属性存在时取全局 `color` 值进行动态赋值。

### `4.8.12`
- feat(events): `BaseData` 的 `triggerMethodOption` 的 `throttle` => `debounce`，更贴近实际功能防抖。
- fix(select): `SelectEdit` 将 `$searchData` 函数并入 `loadData` 函数中实现，避免加载时的错误调用。
- fix(select): `SelectEdit` 在每次检索时都保存当前检索值，避免 BUG。

### `4.8.11`
- feat(select): `DefaultSelectEdit` 添加 `filter` 函数，实现自定义加载 `list` 的逻辑。

### `4.8.9`
- fix(select): 修正 `SelectValue` 初始化时未正确赋值 `equal/hidden/miss` 的 BUG。

### `4.8.8`
- fix(file): 修正 `FileEdit` 的 `multiple` 被错误的传递为 `false` 的 BUG。

### `4.8.7`
- refactor(types): 优化 `ComplexInfo.$info` 的类型。

### `4.8.6`
- refactor(types): 简化 `SelectValue/CascaderValue` 数据类型，删除 `DefaultSelectValueType/DefaultCascaderValueType`。

### `4.8.5`
- refactor(dictionary): 优化 `DictionaryValue` 的 `_initEditMod` 函数逻辑。
- feat(select): 添加 `DefaultSelectEdit` 数据，调整 `SelectEdit` 基于 `DefaultSelectEdit` 实现。
- feat(custom): 添加 `createCustomEdit` 函数创建自定义组件，添加 `CustomLoadEdit` 组件。
- refactor(types): 全局添加 `DefaultEdit` 的泛型 `M`。
- refactor(custom): 优化 `createCustomEdit` 的返回值，修正类型报错。
- feat(events): `SearchData` 添加 `inited` 生命周期，对应字典构建完成生命周期。
- feat(events): `ComplexData` 添加 `$onSearchInited` => 在检索加载完成后触发回调函数, `loadDataBySearchInited` => 在检索加载完成后触发数据加载函数。
- refactor(code): 基于 AI 优化代码。

### `4.8.3`
- feat(track): 添加 `TrackData` 轨迹数据结构。

### `4.8.1`
- chore: 稳定版。

### `4.6.36`
- chore(deps): `utils` 依赖升级。

### `4.6.32`
- chore(deps): `utils` 依赖升级。
- refactor(data)!: **[非兼容性更新]** `DefaultData._getRealName` => `DefaultData._getProp`。

### `4.6.31`
- refactor(sort)!: **[非兼容性更新]**
  - **类型**:
    - `DefaultModOffsetSort` => 删除
    - `DefaultModBeforeSort` => `DefaultModBeforeOrder`
    - `DefaultModAfterSort` => `DefaultModAfterOrder`
    - `DefaultModSort` => `DefaultModOrder`
  - **结构**:
    - `DefaultMod.sort` => `DefaultMod.order`

### `4.6.30`
- fix(sort): `SortData` 排序数据修正 BUG, 整体逻辑优化。
- feat(reset): `ResetData` 添加 `sort` 配置项。
- feat(sort): `ComplexData` 适配 `sort` 全局函数。

### `4.6.29`
- refactor(choice)!: **[非兼容性更新]** `ForceValue` 初始化传参优化。
- feat(reset): 新增 `ResetData` 数据，实现根据主数据状态自动 `reset` 的数据类型，设置为 `ChoiceData` 的父类。
- feat(sort): 添加 `SortData` 排序数据。

### `4.6.27`
- chore(deps): `utils` 依赖升级。
- refactor(choice)!: **[非兼容性更新]** `ForceValue` 添加 `trigger` 属性, 优化 `choice` 触发数据。
- refactor(choice): 优化 `ChoiceData`。

### `4.6.26`
- chore(deps): `utils` 依赖升级。
- feat(edit): `DefaultEdit` 添加 `deepClone` 初始化参数，当为真时，对传入数据为复杂数据时编辑进行深拷贝。

### `4.6.25`
- feat(custom): `CustomEdit` 的 `model` 配置项优化，`change` 字段可配置其他字段，设置双向绑定参数；`handler` 可配置指定双向绑定函数。
- refactor(mod): `DefaultMod` 删除 `reactives` 相关配置项。

### `4.6.24`
- chore(deps): `utils` 依赖升级。
- refactor(edit): `DefaultEdit.getRuleList` => `parseRuleList`。
- feat(validation): `multiple && required` 时自动校验数据不为空数组。

### `4.6.22`
- feat(file): `FileEdit` 当 `option` 的 `image` 存在时，`accept` 的默认值改为 `image/*`。
- refactor(edit): 优化 `FormEdit/ListEdit`。

### `4.6.20`
- refactor(promise): 全局 Promise 返回逻辑优化。

### `4.6.19`
- feat(layout): 添加默认宽度。

### `4.6.18`
- refactor(api)!: **[非兼容性更新]** `ComplexData` 的常见方法去除 `$` 符, 添加全局拦截, 实现基础的 `dataChange` 生命周期。

### `4.6.16`
- refactor(edit)!: **[非兼容性更新]** `DefaultSimpleEdit.disabled` 作为高频率的差异化值更改为 `InterfaceValue` 结构。

### `4.6.15`
- feat(file): 文件上传扩展 `isUrl` 配置项, 为真则说明值为 url。

### `4.6.13`
- refactor(data): 因 ts 类型报错, 优化 `ComplexData` 的常见函数到类实例成员属性上, 实现可继承赋值可改写。

### `4.6.11`
- feat(file): `defaultFileOption` 的 `image` 属性扩展。

### `4.6.10`
- refactor(icon): `icon:plus` => `build/upload` => `import/download` => `export`。

### `4.6.9`
- feat(mod): `DefaultMod` 添加 `hidden/frozen` 属性，用于本身一直是隐藏/冻结状态的模块。
- fix(types): 修正 `DateRangeEditInitOption` 类型。

### `4.6.8`
- refactor(types): `SelectValueType` 类型不作为基类，避免赋值时需要额外进行类型断言的问题。
- feat(file): `defaultFileOption` 类型添加 `image` 属性，标明此文件上传为图片类型。

### `4.6.7`
- chore(deps): `utils` 依赖升级。
- feat(edit): 添加列表编辑 `ListEdit`。
- feat(menu): 优化 `MenuValue` 数据，添加 `hidden` 隐藏配置项，添加 `confirm` 确认配置项。

### `4.6.1`
- chore(deps): `utils` 依赖升级。
- refactor(sort): 优化排序相关逻辑。

### `4.4.6`
- feat(sort): `DefaultMod` 添加排序参数。
- feat(dictionary): `DictionaryData` 添加排序静态函数，`getPageList/getObserveList` 时基于 `DefaultMod.$sort` 进行额外排序。

### `4.4.5`
- chore(deps): `utils` 依赖升级。
- fix(search): `SearchData` 在 `reset` 时重置 `formData`。

### `4.4.4`
- feat(select): `SelectValue` 添加 `getIndex/getItemByIndex/getItemByOffset` 函数。
- fix(types): 修正 `DictionaryValue` 调用 `$formatInitOption` 的类型标注错误。

### `4.4.3`
- feat(depend): 优化依赖相关功能，依赖实现创建时加载和数据加载前加载。
- feat(search): 优化 `search` 的加载顺序，在依赖加载完成后再进行加载。

### `4.4.1`
- chore(deps): 依赖升级，生命周期优化。

### `4.3.43`
- refactor(events): 优化 `triggerMethod` 相关函数的传参。
- feat(events): `triggerMethod` 实现节流。

### `4.3.41`
- feat(data): 添加 `depth` 作为可能存在的深度的额外判断条件。

### `4.3.40`
- feat(mod): `DictionaryData/DefaultMod` 添加 `collapse` 折叠判断值。

### `4.3.38`
- feat(select): `SelectEdit` 添加 `search` 相关设置项。

### `4.3.36`
- feat(data): `ComplexData` 的默认函数添加 `editData`，优化函数赋值和类型。

### `4.3.33`
- refactor(edit): `DefaultEdit` 的 `rule` 相关参数优化。

### `4.3.31`
- feat(custom): `CustomEdit` 添加 `model` 属性。
- feat(search): `SearchData` 优化 `Button` 初始化参数。

### `4.3.28`
- refactor(code): 优化 `undefined` 校验。

### `4.3.27`
- feat(file): 优化 `FileEdit` 组件，统一上传插件的整体逻辑。

### `4.3.19`
- feat(date): 日期范围接收 `endProp` 字段，直接解析。
- feat(date): 添加 `rangeLimit` 范围限制，模板根据具体情况解析。
- refactor(types): 优化 `fileOption` 类型。

### `4.3.15`
- refactor(cascader): 统一 `Cascader` 名称。

### `4.3.14`
- refactor(select): 优化 `SelectEdit` 对 `SelectData` 的适配。
- feat(menu): `MenuValue` 实现防抖参数添加。

### `4.3.11`
- refactor(edit): 优化 `SearchData/FormEdit`。

### `4.3.9`
- feat(observe): `ObserveList` 添加 `reset`。
- refactor(dictionary): 优化整体逻辑，`DictionaryValue.parseValue` 解析 `DefaultInfo` 模块。
- fix(grid): 修正 `GridParse` 整体逻辑。

### `4.3.6`
- feat(form): 级联表单适配完成，准备测试。

### `4.3.3`
- feat(form): 添加 `FormEdit`。
- feat(dictionary): `DictionaryValue` 接收添加 `dictionary(DictionaryData)`。

### `4.3.2`
- fix(dictionary): 修正 `DictionaryValue` 错误引用。
- fix(dictionary): 修正 `DictionaryValue.parseValue` 未正确 `resolve` 的 BUG。

### `4.3.1`
- refactor(data)!: **[重点非兼容性更新]**
  - 依赖升级，优化 `setProp/getProp` 相关逻辑。
  - 添加 `Symbol('empty')` 值和 `nonEmptySetProp/nonEmptySetComplexProp` 函数，实现当值为 `Symbol('empty')` 时不进行赋值和传递。
  - 优化字典赋值格式化相关逻辑。
  - 更改整体逻辑，由之前基于源数据生成新数据后保存更改为源数据直接进行格式化处理后保存。
  - 删除 `DefaultList.auto`。
  - 删除 `DefaultEdit.value.init`。
  - 删除 `SearchData.$form`。
  - `DictionaryValue` 赋值默认直接使用 `setProp` 赋值，不考虑级联属性 `a.b` 的赋值逻辑。
  - `DictionaryValue`:
    - 添加 `complex.assignProp` 设置项。
    - 删除 `$setTargetData` 函数。
    - 添加 `$assignData` 函数，基于原 `$formatData` 函数，实现赋值相关逻辑。
    - 更改 `$formatData` 函数，由原来的赋值逻辑更改为格式化逻辑。
  - `DictionaryData`:
    - 添加 `complex.assign` 设置项。
    - `createEditData` => `parseData`
    - `createPostData` => `collectData`
  - `SearchData`:
    - `$resetFormData` => `resetFormData`, 删除 `observe` 重新构建逻辑。
    - `$syncFormData` => `validateAndSyncData`
    - `syncFormData` => `syncData`
    - `resetFormData` => `resetForm`
    - `resetOption.copy` => `resetOption.sync`
    - `setForm` => `assignData`
  - `ComplexData`:
    - `createEditDataByDictionary` => `parseDataByDictionary`
    - `createPostDataByDictionary` => `collectDataByDictionary`

### `4.2.23`
- chore(deps): 依赖升级。
- refactor(types): 添加 `DataWithSimpleLoad` 类型，优化 `BaseData/SelectData/DefaultLoadEdit` 类型。
- refactor(types): 减少 `unknow` 类型。

### `4.2.22`
- refactor(types): 添加 `DataWithLoad` 类型，优化 `BaseData/SelectData/DefaultLoadEdit` 类型。
- refactor(types): 优化 `RelationData` 的数据类型要求，扩展适配性。

### `4.2.21`
- fix(module): 修正 `ModuleData` 的 `reset/destory`。
- fix(search): 优化 `SearchData` 的 `reset/destory`。

### `4.2.20`
- refactor(select): `CascaderData` => `SelectData`。

### `4.2.19`
- refactor(select): 简化 `SelectValue` 设置项，删除 `dict` 相关参数直接使用默认值。
- refactor(select): 拆分 `CascaderValue` 和 `SelectValue`。
- refactor(select): `SelectData` => `CascaderData`。
- refactor(select): `SelectEdit` 初始化接收 `SelectValue` 参数，删除 `dict` 相关字段。

### `4.2.18`
- feat(search): `SearchData` 的 `getData` 默认深拷贝。
- fix(select): 修正 `SelectData` 未正确触发创建生命周期的 BUG。
- feat(select): 优化 `SelectData` 的 `storage` 的加载。
- feat(data): `Data` 添加静态函数 `$formatInitOption` 格式化加载参数。

### `4.2.17`
- refactor(depend): `BaseData` 的 `loadDepend` 整体逻辑优化，避免主数据先于依赖数据加载完成。
- fix(types): `RelationData` 类型修正。
- chore(deps): 依赖升级，未使用参数前缀加 `_`。

### `4.2.14`
- feat(choice): `ComplexData` 添加 `choice` 相关函数。
- chore(deps): 依赖升级。

### `4.2.12`
- refactor(types): 优化 `type` 位置。
- fix(types): 修正 `DictionaryData` 类型 BUG。
- feat(observe): `DictionaryData.createPostData` 适配 `ObserveList` 的冻结功能。

### `4.2.11`
- feat(search): `SearchData` 添加 `Info` 详情按钮。
- feat(data): `ComplexData` 添加 `refreshData` 详情接口。

### `4.2.10`
- refactor(dictionary)!: **[非兼容性更新]** `DefaultInfo/DefaultSimpleMod` => `DefaultMod`, `DefaultMod` => `DefaultInfo`，优化编辑数据链。

### `4.2.9`
- refactor(types): `MenuValue/ButtonValue` 删除，改为类型。
- fix(date): 修正 `SimpleDateEdit` 的默认值问题。

### `4.2.7`
- feat(date): `DateRangeEdit` 添加 `endPlaceholder` 属性。
- refactor(edit): 编辑数据的 `$defaultPlaceholder` 函数优化。
- refactor(dictionary): 优化 `DictionaryValue` 属性 `originProp` 为可选不赋值。
- refactor(api): 优化 `DictionaryValue/DefaultSimpleMod`，`fetch` => `collect`。

### `4.2.6`
- refactor(date): 合并 `Date/DateRange` 相关功能。

### `4.2.5`
- refactor(dictionary): 优化字典模块，`DefaultSimpleMod` => `DefaultMod`，简化 `DefaultSimpleMod`。
- refactor(code): `class extends null` 弃用。
- fix(events): 修正生命周期调用 BUG。

### `4.2.2`
- refactor(dictionary): `DefaultSimpleMod` 弃用 `InterfaceData` 结构，简化构建。
- refactor(grid): `GridParse` 输出值格式优化。

### `4.2.1`
- fix(build): 修复 `index` 导出。

### `4.2.0`
- refactor(code)!: **[核心重构]**
  - 优化函数名称，`_` 为私有属性，`$` 为功能函数。
  - 优化整个按钮相关逻辑，统一调用链。
  - 优化 `SelectValue`，适配级联数据。
  - 添加 `StorageValue` 本地缓存数据控制器。
  - 修正 `DefaultEdit` 在 `multiple` 时默认值为 `[]` 导致的引用问题。
  - 布局通过解析器加值实现。
  - 优化 `Edit` 的 `rule` 属性整体逻辑。
  - 优化 `DictionaryValue/DefaultSimpleMod`，`format` => `assign`, `show/edit` => `parse`，`post` => `collect`。
  - 优化 `ObserveList` 的响应式逻辑，仅监控需要的属性。
  - `Observe` 添加额外逻辑，实现冻结和解冻。
  - 合并 `select/cascader`。

### `4.1.18`
- fix(events): 修正 `$triggerMethodWithStatus` 无函数时的状态回滚。

### `4.1.17`
- refactor(api): `ComplexData` 修正 `getSize/setSize` => `getPageSize/setPageSize`。
- fix(types): `ButtonGroupEditOption` 类型修正。
- feat(data): `Default` 添加 `editable` 判断是否是需要编辑的数据。
- refactor(types): `Status` 类型优化。
- chore(deps): 依赖升级。

### `4.1.14`
- feat(edit): `EditData` 添加 `simple` 设置项。
- refactor(mod): `DefaultMod` 基类由 `Data` 切换为 `SimpleData`, 实现 `extra`。
- refactor(types): 优化 `PureButtonValue` 类型。
- fix(icon): 修正错误 `icon`。

### `4.1.12`
- feat(search): `SearchData` 的 `Button` 提前生成。

### `4.1.11`
- refactor(types): 优化 `ButtonValue` 类型。

### `4.1.10`
- refactor(search): 优化 `SearchData` 的 `observe` 传参。
- refactor(form)!: **[重要]** `FormValue` 由抽象类转换为实体类，避免加载顺序导致的 BUG。

### `4.1.9`
- refactor(edit): 优化加载编辑数据逻辑。

### `4.1.8`
- chore(deps): 升级依赖。
- feat(date): 实现 `disabledDate` 相关逻辑。

### `4.1.7`
- refactor(search): 优化检索。
- refactor(config): 将配置项集成在类静态属性中。
- refactor(file): 优化文件上传相关参数。

### `4.1.3`
- feat(button): 按钮加载/禁用接收函数。
- feat(search): 扩展检索菜单默认值。

### `4.1.2`
- refactor(dictionary): 优化字典构建函数。
- fix(search): 修正检索 `menu.name` 被非预期赋值。

### `4.1.1`
- fix(events): 修正 `BaseData` 的 `triggerMethod` 相关逻辑 BUG。
- refactor(search): 优化检索函数的菜单默认为独立模块。

### `4.1.0`
- refactor(code): 优化函数命名规则：外部函数以字母开头，内部函数以 `$` 开头，私有函数以 `_` 开头。

### `4.0.20`
- feat(events): 优化创建生命周期函数，通过 `$onCreatedLife` 实现生命周期创建完成回调。

### `4.0.19`
- refactor(search): `SearchData` 菜单默认参数优化。
- feat(config): `config` 添加 `formatPixel` 函数。
- feat(button): `ButtonGroupEdit` 添加间隔设置项。

### `4.0.17`
- refactor(depend)!: **[非兼容性更新]** `DependData` => `RelationData`，位置由 `ModuleData` 转换为 `BaseData` 的不可枚举属性。
- refactor(depend): 简化依赖相关函数，删除 `once` 等设置项，改为 `bind` 函数中传递解绑函数。

### `4.0.16`
- refactor(api)!: **[非兼容性更新]** `DictionaryData:$createEditData` => `$createEditData`，后续相关调用名称优化。
- feat(date): 实现 `DateEdit/DateRangeEdit` 的数据转换。
- feat(data): 扩展 `ComplexData` 的常用函数，减少后期自定义类。

### `4.0.14`
- refactor(build): 优化字段加载和文件目录，修正组件构建 BUG。

### `4.0.13`
- chore(deps): 升级依赖，适配 `formatConfig`。

### `4.0.12`
- fix(mod): 修正 `DefaultMod` 相关类的初始化未正确传递 `parent` 的 BUG。
- fix(select): 修正 `SelectValue` 的初始化类型中 `dict` 错误的被标记为必填项的 BUG。

### `4.0.11`
- feat(data): 添加基础的 `Data` 构建格式化函数，适配不同环境。
- chore(deps): 升级依赖，修正类型报错。

### `4.0.9`
- refactor(edit): 优化 `AttrsValue/ContentEdit/DateEdit/DateRangeEdit`。

### `4.0.8`
- refactor(layout)!: **[非兼容性更新]** 添加 `LayoutValue/InterfaceLayoutValue`，优化组件的 `width` 到 `$layout` 中。
- refactor(date): 修正 `DefaultDate` => `DateEdit`.
- feat(date): 添加 `DateRangeEdit`。
- chore(deps): 升级依赖。

### `4.0.7`
- refactor(attrs)!: **[非兼容性更新]** `AttributeValue` => `AttrsValue`。
- refactor(attrs): 统一 `$local/$attrs` 属性。

### `4.0.3`
- refactor(render): 优化 `Attribute/Render` 相关逻辑。

### `4.0.1`
- feat: 基于 `complex-data` 简化逻辑，实现基本的功能。
